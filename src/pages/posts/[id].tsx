import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data: postWithAuthor } = api.posts.getById.useQuery({ postId });

  if (!postWithAuthor)
    return <div className="flex justify-center text-4xl">404</div>;

  return (
    <>
      <Head>
        <title>{`${postWithAuthor.post.content} - @${postWithAuthor.author.username}`}</title>
      </Head>
      <PostView post={postWithAuthor.post} author={postWithAuthor.author} />
    </>
  );
};

export default SinglePostPage;

export const getStaticPaths = () => ({ paths: [], fallback: "blocking" });

export const getStaticProps: GetStaticProps = async (context) => {
  const postId = context.params?.id; // no typesafety here :c
  if (typeof postId !== "string") throw new Error("no post id");

  const ssgHelper = generateSSGHelper();
  await ssgHelper.posts.getById.prefetch({ postId });

  return { props: { trpcState: ssgHelper.dehydrate(), postId } };
};
