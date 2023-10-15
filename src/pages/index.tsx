import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { api, type RouterOutputs } from "~/utils/api";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postContentSchema } from "~/schemas/postSchema";
import { type z } from "zod";
import Link from "next/link";
import { ProfileImg } from "~/components/profileImg";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof postContentSchema>>({
    resolver: zodResolver(postContentSchema),
  });
  const ctx = api.useContext(); // dont inline this or invalidate() wont work as expected 🤷‍♂️
  const { mutate: createPost } = api.posts.create.useMutation({
    onSuccess: () => {
      void ctx.posts.invalidate();
      reset();
    },
    onError: (e) => {
      const errorMsg = e.data?.zodError?.fieldErrors.content;
      toast.error(errorMsg?.[0] ?? "Failed to post! Please try again later.");
    },
  });
  const { user } = useUser();

  if (!user) return;

  return (
    <form
      className="flex items-center gap-3 text-2xl"
      onSubmit={(e) => void handleSubmit((post) => createPost(post))(e)} // explicit `e`, otherwise it doesnt preventDefault 🤷‍♂️
    >
      <ProfileImg imageUrl={user.imageUrl} />
      <input
        {...register("content")}
        type="text"
        autoComplete="off"
        placeholder="type some emojis... 👀"
        className="bg-transparent px-2 outline-none"
        onKeyDown={(e) =>
          e.key === "Enter" &&
          errors.content &&
          toast.error(`${errors.content.message}`)
        }
      />
      <button
        disabled={isSubmitting || !!errors.content}
        className="flex h-[50px] min-w-[50px] items-center justify-center rounded-full bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700"
      >
        {isSubmitting ? <LoadingSpinner size={20} /> : "📢"}
      </button>
    </form>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3 border-b border-slate-400 p-4 ">
      <ProfileImg imageUrl={author.imageUrl} />
      <div className="flex flex-col">
        <div className="whitespace-pre text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>@{author.username}</span>
          </Link>
          {"  ·  "}
          <Link href={`/posts/${post.id}`}>
            <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="">
      {data.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <div className="h-22 flex items-center justify-between border-b border-slate-400 p-4">
        <CreatePostWizard />
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
      </div>
      <Feed />
    </>
  );
}
