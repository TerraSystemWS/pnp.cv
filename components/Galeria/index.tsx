import React, { useState } from "react";
import Image from "next/image";
import { getStrapiMedia } from "../../lib/utils";
import ImageLightbox from "../custom/ImageLightbox";

interface GalleryProps {
	images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
	const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);
	const [hovered, setHovered] = useState<number | null>(null);

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5">
			{images.map((imageUrl, index) => {
				const fullUrl = getStrapiMedia(imageUrl) || "https://placehold.co/400x300";
				const hov = hovered === index;
				return (
					<button
						key={index}
						onClick={() => setLightboxImage({ url: fullUrl, title: `Imagem ${index + 1}` })}
						onMouseEnter={() => setHovered(index)}
						onMouseLeave={() => setHovered(null)}
						aria-label="Ampliar imagem"
						style={{
							position: "relative",
							display: "block",
							padding: 0,
							border: "none",
							background: "transparent",
							cursor: "zoom-in",
							borderRadius: "0.5rem",
							overflow: "hidden",
						}}
					>
						<Image
							className="h-auto max-w-full rounded-lg"
							src={fullUrl}
							alt={`Imagem ${index + 1}`}
							width={400}
							height={300}
							style={{ width: "100%", height: "auto", display: "block" }}
						/>
						<span
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: hov ? "rgba(20,17,10,0.35)" : "rgba(20,17,10,0)",
								transition: "background 0.2s",
							}}
						>
							<span
								style={{
									width: "42px",
									height: "42px",
									borderRadius: "50%",
									background: "rgba(255,255,255,0.95)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									opacity: hov ? 1 : 0,
									transform: hov ? "scale(1)" : "scale(0.85)",
									transition: "opacity 0.2s, transform 0.2s",
								}}
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#241f0f" strokeWidth="2.2" strokeLinecap="round">
									<circle cx="11" cy="11" r="7" />
									<line x1="21" y1="21" x2="16.65" y2="16.65" />
								</svg>
							</span>
						</span>
					</button>
				);
			})}

			<ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
		</div>
	);
};

export default Gallery;
