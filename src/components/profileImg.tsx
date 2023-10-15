import Image from "next/image";
import cn from "~/components/helpers/cn";

type ProfileImgProps = {
  imageUrl: string;
  alt?: string;
  size?: number;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export const ProfileImg = ({
  imageUrl,
  alt,
  size,
  className,
}: ProfileImgProps) => {
  return (
    // todo: up profile quality (change to .png or sth)
    <Image
      src={imageUrl}
      alt={alt ?? "profile image"}
      width={size ?? 56}
      height={size ?? 56}
      className={cn("rounded-full", className)}
      quality={100}
    />
    // <img src={imageUrl} alt="Profile image" className="h-14 w-14 rounded-full" />
  );
};
