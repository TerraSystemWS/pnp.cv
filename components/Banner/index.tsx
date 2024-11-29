import { Carousel, Alert } from "flowbite-react"
import { StrapiImage } from "../custom/StrapiImage"

const Banner = (props: any) => {
  console.log(props)
  return (
    <>
      <div className="-mt-2">
        <div className="h-56 md:h-screen z-0">
          <Carousel data-carousel="slide">
            {props.dados.map((value: any) => (
              <StrapiImage
                key={value.id}
                src={value.url}
                alt={value.title}
                width={1024}
                height={500}
                className="cursor-pointer"
              />
            ))}
          </Carousel>
        </div>
      </div>
    </>
  )
}

export default Banner
