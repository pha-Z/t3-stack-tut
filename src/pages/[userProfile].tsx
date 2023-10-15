import { createServerSideHelpers } from "@trpc/react-query/server";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import superjson from "superjson";
import { ProfileImg } from "~/components/profileImg";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";

const UserProfileFeed = ({ authorId }: { authorId: string }) => {
  const { data: userPosts, isLoading } = api.posts.getPostsByAuthorId.useQuery({
    authorId,
  });

  if (isLoading) return <LoadingPage />;
  if (!userPosts || userPosts.length === 0)
    return <div>The user has not posted anything yet.</div>;

  return userPosts.map((postWithAuthor) => (
    <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
  ));
};

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
      <div className="flex h-48 w-full flex-col justify-end bg-slate-600">
        {/* banner */}
        <ProfileImg
          imageUrl={userProfile.imageUrl}
          alt={`${userProfile.username ?? ""}'s profile image`}
          size={144}
          className="-mb-[64px] ml-4 border-4 border-black bg-black"
        />
      </div>
      <div className="w-full border-b border-slate-400 px-6 pb-5 font-bold">
        <div className="flex h-[72px] items-center justify-end">
          <button className="h-fit rounded-full border border-slate-400 px-5 py-2">
            Edit profile
          </button>
        </div>
        <div className="text-2xl ">@{userProfile.username ?? ""}</div>
      </div>
      <UserProfileFeed authorId={userProfile.id} />
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

  await ssgHelpers.userProfile.getUserByUsername.prefetch({ username });

  return { props: { trpcState: ssgHelpers.dehydrate(), username } };
};
