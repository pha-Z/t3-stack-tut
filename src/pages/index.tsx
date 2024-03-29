import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { type z } from "zod";
import { Container } from "~/components/container";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { PostView } from "~/components/postview";
import { postContentSchema } from "~/schemas/postSchema";
import { api } from "~/utils/api";

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
  const ctx = api.useContext(); // dont inline this or invalidate() wont work as expected
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
    <div className="flex items-center gap-3 sm:gap-5">
      <div className="wrapper-div-moment">
        <Image
          src={user.imageUrl}
          alt={`${user.username ?? ""}'s profile image`}
          width={72}
          height={72}
          className="rounded-full"
          quality={100}
        />
      </div>
      <form
        className="flex h-12 items-center"
        onSubmit={(e) => void handleSubmit((post) => createPost(post))(e)} // explicit `e`, otherwise it doesnt preventDefault 🤷‍♂️
      >
        <input
          {...register("content")}
          type="text"
          autoComplete="off"
          placeholder="type some emojis... 👀"
          className="h-full rounded-full bg-zinc-800 pl-6 pr-8 outline-none focus:outline focus:outline-zinc-600 sm:text-2xl md:pr-16"
          onKeyDown={(e) =>
            e.key === "Enter" &&
            errors.content &&
            toast.error(`${errors.content.message}`)
          }
        />
        <button
          disabled={isSubmitting || !!errors.content}
          className="-ml-[50px] flex h-[50px] min-w-[50px] items-center justify-center rounded-full border-r-[3px] border-zinc-600 hover:border-b disabled:border-zinc-800"
        >
          {isSubmitting ? <LoadingSpinner size={20} /> : "📢"}
        </button>
      </form>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return data.map((postWithAuthor) => (
    <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
  ));
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <Container>
      <div className="h-22 sticky top-0 flex items-center justify-between border-b border-zinc-700 bg-zinc-950 p-4">
        <CreatePostWizard />
        {isSignedIn ? <SignOutButton /> : <SignInButton />}
      </div>
      <Feed />
    </Container>
  );
}
