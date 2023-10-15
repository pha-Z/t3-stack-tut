import Image from "next/image";

export const ProfileImg = ({
  imageUrl,
  size,
}: {
  imageUrl: string;
  size?: number;
}) => (
  // todo: up profile quality (change to .png or sth)
  <Image
    src={imageUrl}
    alt="Profile image"
    width={size ?? 56}
    height={size ?? 56}
    className="rounded-full"
    quality={100}
  />
  // <img src={imageUrl} alt="Profile image" className="h-14 w-14 rounded-full" />
);
