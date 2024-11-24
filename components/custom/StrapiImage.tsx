import Image from "next/image"
import { getStrapiMedia } from "../../lib/utils"

interface StrapiImageProps {
  src: string
  alt: string
  height: number
  width: number
  className?: string
}
interface StrapiDataProps {
  src: string
  className?: string
}
const imageLoader = ({ src }: any) => {
  return src
}

export function StrapiImage({
  src,
  alt,
  width,
  height = width,
  className,
}: Readonly<StrapiImageProps>) {
  if (!src) return null
  const imageUrl = getStrapiMedia(src)
  const imageFallback = `https://placehold.co/${width}x${height}`

  // console.log("imageUrl dento strapiImage");
  // console.log(imageUrl);
  // console.log(imageFallback);
  return (
    <img
      // loader={imageLoader}// funciona mas retira a otimizaçao de imagens
      src={imageUrl ?? imageFallback}
      alt={alt}
      // height={height}
      // width={width}
      height={`${height}px`}
      width={`${width}px`}
      className={className}
    />
  )
}

export function StrapiData({ src }: Readonly<StrapiDataProps>) {
  if (!src) return " "
  const imageUrl = getStrapiMedia(src)
  let srcFinal = { imageUrl }

  return srcFinal
}
