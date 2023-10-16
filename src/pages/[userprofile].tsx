import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { Container } from "~/components/container";

const UserProfileFeed = ({ authorId }: { authorId: string }) => {
  const { data: userPosts, isLoading } = api.posts.getByAuthorId.useQuery({
    authorId,
  });

  if (isLoading) return <LoadingPage />;
  if (!userPosts || userPosts.length === 0)
    return <div>The user has not posted anything yet.</div>;

  return (
    <div className="overflow-y-auto">
      {userPosts.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
};

const UserProfile: NextPage<{ username: string }> = ({ username }) => {
  const { user, isSignedIn } = useUser();
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
      <Container>
        <div className="flex h-48 w-full flex-col justify-end bg-slate-600">
          {/* banner */}
          <Image
            src={userProfile.imageUrl}
            alt={`${userProfile.username ?? ""}'s profile image`}
            width={144}
            height={144}
            className="-mb-[64px] ml-4 rounded-full border-4 border-zinc-900 bg-zinc-900"
          />
        </div>
        <div className="w-full border-b border-zinc-700 px-6 pb-5 font-bold">
          <div className="flex h-[72px] items-center justify-end">
            {isSignedIn && user.username === username && (
              <button className="h-fit rounded-full border border-zinc-400 px-5 py-2">
                Edit profile
              </button>
            )}
          </div>
          <div className="text-2xl ">@{userProfile.username ?? ""}</div>
        </div>
        <UserProfileFeed authorId={userProfile.id} />
      </Container>
    </>
  );
};

export default UserProfile;

export const getStaticPaths = () => ({ paths: [], fallback: "blocking" });

export const getStaticProps: GetStaticProps = async (context) => {
  const userProfileUrl = context.params?.userprofile; // no typesafety here :c
  if (typeof userProfileUrl !== "string") throw new Error("no user profile");

  const username = userProfileUrl.replace("@", "");

  const ssgHelper = generateSSGHelper();
  await ssgHelper.userProfile.getUserByUsername.prefetch({ username });

  return { props: { trpcState: ssgHelper.dehydrate(), username } };
};
