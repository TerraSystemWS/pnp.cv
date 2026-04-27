import React from "react";
import Image from "next/image";
import { StrapiImage } from "../custom/StrapiImage";
import { getStrapiMedia } from "../../lib/utils";

interface GalleryProps {
	images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
			{images.map((imageUrl, index) => (
				<div key={index}>
					<Image
						className="h-auto max-w-full rounded-lg"
						src={getStrapiMedia(imageUrl) || "https://placehold.co/400x300"}
						alt={`Image ${index}`}
						width={400}
						height={300}
					/>
					{/* <StrapiImage
						src={imageUrl}
						alt={`Image ${index}`}
						className="block h-full w-full rounded-lg object-cover object-center cursor-pointer"
						height={400} // Adjust the height of the image
						width={400} // Adjust the width of the image
					/> */}
				</div>
			))}
		</div>
	);
};

export default Gallery;
