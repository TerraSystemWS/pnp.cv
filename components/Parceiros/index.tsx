import Morelink from "../../public/more.svg";
import { Tooltip } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

const Parceiros = (props: any) => {
	return (
		<section className="bg-white dark:bg-gray-900">
			<div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
				<Link href="/parceiros">
					<h2 className="mb-8 lg:mb-16 text-3xl font-extrabold tracking-tight leading-tight text-center text-amarelo-ouro  md:text-4xl">
						PARCEIROS
					</h2>
				</Link>
				<div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
					{props.dados?.map((value: any, index: any) => {
						// let count = 0;
						if (index < 6) {
							return (
								<>
									<Link
										key={index}
										href={value.link || "#"}
										className="flex justify-center items-center"
										target="_blank"
										rel="noreferrer"
									>
										<Image
											className="grayscale"
											src={value.foto}
											alt={value.title}
											width={150}
											height={150}
										/>
									</Link>
								</>
							);
						} else {
							return "";
						}
					})}
				</div>
			</div>
		</section>
	);
};

export default Parceiros;
