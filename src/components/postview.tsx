import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { RouterOutputs } from "~/utils/api";
import Link from "next/link";
import Image from "next/image";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3 border-b border-slate-400 p-4 ">
      <Image
        src={author.imageUrl}
        alt={`${author.username}'s profile image`}
        width={56}
        height={56}
        className="rounded-full"
        quality={100}
      />
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
        <span className="break-words text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
