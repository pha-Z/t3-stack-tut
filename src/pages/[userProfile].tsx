import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import superjson from "superjson";
import { ProfileImg } from "~/components/profileImg";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { api } from "~/utils/api";

const UserProfile: NextPage<{ username: string }> = ({ username }) => {
  const { data: userProfile } = api.userProfile.getUserByUsername.useQuery({
    username,
  });

  if (!userProfile)
    return <div className="flex justify-center text-4xl">404</div>;

  return (
    <>
      <Head>
        <title>{userProfile.username}</title>
      </Head>
      <div className="h-36 w-full bg-slate-600">banner</div>
      <div className="w-full border-b border-slate-400 pb-6 pl-6">
        <ProfileImg
          imageUrl={userProfile.imageUrl}
          alt={`${userProfile.username ?? ""}'s profile image`}
          size={128}
          className="-mt-[64px] border-4 border-black bg-black"
        />
        {/* <button className="flex items-center rounded-full border px-3 py-2">
          edit profile
        </button> */}
        <div className="text-2xl font-bold">@{userProfile.username ?? ""}</div>
      </div>
    </>
  );
};

export default UserProfile;

export const getStaticPaths = () => ({ paths: [], fallback: "blocking" });

export const getStaticProps: GetStaticProps = async (context) => {
  const ssgHelpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, currentUserId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  const userProfileUrl = context.params?.userProfile;
  if (typeof userProfileUrl !== "string") throw new Error("no user profile");

  const username = userProfileUrl.replace("@", "");

  await ssgHelpers.userProfile.getUserByUsername.prefetch({
    username: username,
  });

  return { props: { trpcState: ssgHelpers.dehydrate(), username } };
};
