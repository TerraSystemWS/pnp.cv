import React from "react";
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
					<img
						className="h-auto max-w-full rounded-lg"
						src={getStrapiMedia(imageUrl) || " "}
						alt={`Image ${index}`}
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
