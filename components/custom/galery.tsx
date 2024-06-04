import React, { useState } from "react";
import { StrapiImage } from "./StrapiImage";

interface GaleryProps {
	imageUrls: string[];
}

const Galery: React.FC<GaleryProps> = ({ imageUrls }) => {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [magnify, setMagnify] = useState<boolean>(false);
	const [magnifyImageUrl, setMagnifyImageUrl] = useState<string>("");

	const handleMagnify = (url: string, index: number) => {
		setMagnifyImageUrl(url);
		setCurrentIndex(index);
		setMagnify(true);
	};

	const handleCloseMagnify = () => {
		setMagnify(false);
		setMagnifyImageUrl("");
	};

	const handleNextImage = () => {
		const nextIndex = (currentIndex + 1) % imageUrls.length;
		setCurrentIndex(nextIndex);
		setMagnifyImageUrl(imageUrls[nextIndex]);
	};

	const handlePrevImage = () => {
		const prevIndex =
			(currentIndex - 1 + imageUrls.length) % imageUrls.length;
		setCurrentIndex(prevIndex);
		setMagnifyImageUrl(imageUrls[prevIndex]);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "ArrowRight") {
			handleNextImage();
		} else if (event.key === "ArrowLeft") {
			handlePrevImage();
		}
	};

	return (
		<>
			<div
				className="container mx-auto px-5 py-2 lg:px-32 lg:pt-12"
				onKeyDown={handleKeyDown}
				tabIndex={0}
			>
				<div className="flex flex-wrap -m-2">
					{imageUrls.map((url, index) => (
						<div
							className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2"
							key={index}
							onClick={() => handleMagnify(url, index)}
						>
							<div className="w-full p-1 md:p-2">
								<StrapiImage
									src={url}
									alt="gallery"
									className="block h-full w-full rounded-lg object-cover object-center cursor-pointer"
									height={400} // Adjust the height of the image
									width={400} // Adjust the width of the image
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			{/* Magnify popup */}
			{magnify && (
				<div
					className="fixed top-0 left-0 z-50 w-full h-full flex justify-center items-center bg-black bg-opacity-50"
					onClick={handleCloseMagnify}
				>
					<StrapiImage
						src={magnifyImageUrl}
						alt="Magnified Image"
						className="max-h-full max-w-full"
						onClick={(e) => e.stopPropagation()}
					/>
					<button
						className="absolute top-1/2 transform -translate-y-1/2 left-4 bg-gray-800 text-white rounded-full p-2 focus:outline-none"
						onClick={(e) => {
							e.stopPropagation();
							handlePrevImage();
						}}
					>
						{"<"}
					</button>
					<button
						className="absolute top-1/2 transform -translate-y-1/2 right-4 bg-gray-800 text-white rounded-full p-2 focus:outline-none"
						onClick={(e) => {
							e.stopPropagation();
							handleNextImage();
						}}
					>
						{">"}
					</button>
				</div>
			)}
		</>
	);
};

export default Galery;
