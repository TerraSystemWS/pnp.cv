import Image from "next/image";
import { getStrapiMedia } from "../../lib/utils";

interface StrapiImageProps {
  src: string;
  alt: string;
  height: number;
  width: number;
  className?: string;
}

const imageLoader = ({ src }: any) => {
  return src
}

export function StrapiImage({
  src,
  alt,
  height,
  width,
  className,
}: Readonly<StrapiImageProps>) {
  if (!src) return null;
  const imageUrl = getStrapiMedia(src);
  const imageFallback = `https://placehold.co/${width}x${height}`;

  // console.log("imageUrl dento strapiImage");
  // console.log(imageUrl);
  // console.log(imageFallback);
  return (
    <Image
      loader={imageLoader}
      src={imageUrl ?? imageFallback}
      alt={alt}
      height={height}
      width={width}
      className={className}
    />
  );
}