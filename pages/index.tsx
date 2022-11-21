import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import logo from "public/logo1.png";
import { fetcher } from "../lib/api";
import { Alert, Carousel } from "flowbite-react";
import Juri from "../components/Juri";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function Home({ social, contato, banners, juris }: any) {
	// create data for Banner carousel
	let bannerData: any = [];
	// create banner object
	banners.data.map((value: any, index: any) => {
		if (value.attributes.destaque) {
			bannerData[index] = {
				id: index,
				title: value.attributes.banners.titulo,
				url: value.attributes.banners.image.data.attributes.url,
			};
		}
	});

	// dados do juri
	let Juris: any = [];
	// create Juris objetct
	juris.data.map((value: any, index: any) => {
		value.attributes.juri.map((value2: any, index2: any) => {
			// console.log(value2.foto.data?.attributes.url);
			Juris[index2] = {
				id: index2,
				edicao: value.attributes.N_Edicao,
				j_foto: value2.foto.data?.attributes.url,
				j_nome: value2.nome,
				j_titulo: value2.titulo,
				j_descricao: value2.descricao,
			};
		});
	});

	// console.log(Juris);

	// return;
	return (
		<Layout rsocial={social} contato={contato}>
			{/* <pre>{JSON.stringify(banners, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(bannerData, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(Juris, null, 2)}</pre> */}

			<div className="-mt-2">
				{/* ex class h-56 sm:h-64 xl:h-80 2xl:h-96 */}
				<div className="h-56 md:h-screen z-0">
					<Carousel>
						{bannerData.map((value: any) => (
							<Image
								key={value.id}
								src={value.url}
								alt={value.title}
								width={1024}
								height={500}
							/>
						))}
					</Carousel>
				</div>
			</div>

			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
						<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block text-amarelo-ouro">
								PREMIO NACIONAL DE PUBLICIDADE
							</span>
							{/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> */}
						</h2>
						<div className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
							O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da
							atividade publicitária, através do reconhecimento da qualidade dos
							trabalhos publicitários e institucionais exibidos e veiculados,
							premiando os que pela sua criatividade e originalidade contribuam
							para o desenvolvimento do mercado publicitário em Cabo Verde.
						</div>
					</div>
				</div>
			</div>

			<Juri dados={Juris} />

			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block">Pronto para inscreva-se?</span>
							<span className="block text-amarelo-ouro">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span>
						</h2>
						<div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
							<div className="inline-flex rounded-md shadow">
								<a
									href="/inscricao"
									className="inline-flex items-center justify-center rounded-md border border-transparent bg-amarelo-ouro px-5 py-3 text-base font-medium text-white hover:bg-castanho-claro"
								>
									Inscrever
								</a>
							</div>
							<div className="ml-3 inline-flex rounded-md shadow">
								<a
									href="/regulamentos"
									className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
								>
									Regulamentos
								</a>
							</div>
						</div>
					</div>
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
	// GET: dados dos juris
	const juris = await fetcher(`${api_link}/edicoes?populate=deep`);

	// console.log(banners.attributes);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, banners, juris } };
}
