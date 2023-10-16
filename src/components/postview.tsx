import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;
  return (
    <div className="flex min-h-[100px] gap-3 border-b border-zinc-700 p-4">
      <div className="wrapper-div-moment">
        <Image
          src={author.imageUrl}
          alt={`${author.username}'s profile image`}
          width={56}
          height={56}
          className="rounded-full"
          quality={100}
        />
      </div>
      <div className="flex flex-col">
        <div className="whitespace-pre">
          <Link href={`/@${author.username}`}>
            <span className="font-semibold">@{author.username}</span>
          </Link>
          {"  ·  "}
          <Link href={`/posts/${post.id}`}>
            <span className="font-thin text-zinc-400">
              {dayjs(post.createdAt).fromNow()}
            </span>
          </Link>
        </div>
        <span className="break-words text-2xl">{post.content}</span>
      </div>
    </div>
  );
};
