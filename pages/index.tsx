import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import logo from "public/logo1.png";
import { fetcher } from "../lib/api";
import { Alert, Carousel } from "flowbite-react";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function Home({ social, contato, banners }: any) {
	// create data for Banner carousel
	let bannerData: any = [];
	// create de banner object
	banners.data.map((value: any, index: any) => {
		if (value.attributes.destaque) {
			bannerData[index] = {
				id: index,
				title: value.attributes.banners.titulo,
				url: value.attributes.banners.image.data.attributes.url,
			};
		}
	});

	// return
	return (
		<Layout rsocial={social} contato={contato}>
			{/* <pre>{JSON.stringify(banners, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(bannerData, null, 2)}</pre> */}

			<div className="container max-w-full -mt-2">
				{/* ex class h-56 sm:h-64 xl:h-80 2xl:h-96 */}
				<div className="h-56 md:h-screen">
					<Carousel>
						{bannerData.map((value: any) => (
							<Image
								key={value.id}
								src={value.url}
								alt={value.title}
								width={800}
								height={600}
							/>
						))}
					</Carousel>
				</div>
			</div>
		</Layout>
	);
}

// export async function getStaticProps() {

// 	return {
// 		props: ,
// 		revalidate: 60 /*in seconds*/,
// 	};
// }

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);

	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);
	// GET: dados para banners
	const banners = await fetcher(`${api_link}/banners?populate=deep`);

	// console.log(banners.attributes);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, banners } };
}
