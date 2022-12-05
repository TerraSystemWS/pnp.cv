import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import logo from "public/logo1.png";
import { fetcher } from "../lib/api";
import { Carousel, Button, Alert } from "flowbite-react";
import Juri from "../components/Juri";
import Categorias from "../components/Categorias";
import Parceiros from "../components/Parceiros";
import { HiInformationCircle } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";
const qs = require("qs");

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

export default function Home({
	social,
	contato,
	banners,
	edicao,
	parceiros,
}: any) {
	// router
	const router = useRouter();
	// create data for Banner carousel
	let bannerData: any = [];
	// dados do juri
	let Juris: any = [];
	// dados de categorias
	let Categoria: any = [];
	//dados do grupo de parceiros
	let parceirosOrganizacao: any = [];
	let parceirosPadrinho: any = [];
	let parceirosPatrocinadores: any = [];
	let parceirosMedia: any = [];
	// create banner object
	banners.data.map((value: any, index: any) => {
		if (value.attributes.destaque) {
			bannerData[index] = {
				id: index,
				title: value.attributes.banners.titulo,
				url: value.attributes.banners.image.data?.attributes.url || "/",
			};
		}
	});
	// create Juris objetct
	edicao.data.map((value: any, index: any) => {
		value.attributes.juri.map((value2: any, index2: any) => {
			// console.log(value2.foto.data?.attributes.url);
			Juris[index2] = {
				id: index2,
				edicao: value.attributes.N_Edicao,
				j_foto: value2.foto.data?.attributes.formats.medium.url || "/",
				j_nome: value2.nome,
				j_titulo: value2.titulo,
				j_descricao: value2.descricao,
			};
		});
		// get dados da categoria
		value.attributes.categoria.map((categs: any, index3: any) => {
			Categoria[index3] = {
				id: index3,
				titulo: categs.titulo,
				slug: categs.titulo.replace(/ /g, "_"),
				descricao: categs.descricao,
			};
		});
	});

	parceiros.data.map((value: any, index: any) => {
		value.attributes.organizacao.map((value2: any, index2: any) => {
			parceirosOrganizacao[index2] = {
				id: index2,
				link: value2.link,
				title: value2.logo.data?.attributes.name,
				foto: value2.logo.data?.attributes.url || "/",
			};
		});
		value.attributes.parceiros_padrinhos.map((value2: any, index2: any) => {
			parceirosPadrinho[index2] = {
				id: index2,
				link: value2.link,
				title: value2.logo.data?.attributes.name,
				foto: value2.logo.data?.attributes.url || "/",
			};
		});
		value.attributes.patrocinadores.map((value2: any, index2: any) => {
			parceirosPatrocinadores[index2] = {
				id: index2,
				link: value2.link,
				title: value2.logo.data.attributes.name,
				foto: value2.logo.data?.attributes.url || "/",
			};
		});
		value.attributes.media_parteners.map((value2: any, index2: any) => {
			parceirosMedia[index2] = {
				id: index2,
				link: value2.link,
				title: value2.logo.data.attributes.name,
				foto: value2.logo.data?.attributes.url || "/",
			};
		});
	});

	// create the partner list
	let partnerList: any = [];
	parceirosOrganizacao.map((value: any) => {
		partnerList.push({
			link: value.link,
			title: value.title,
			foto: value.foto,
		});
	});
	parceirosPadrinho.map((value: any) => {
		partnerList.push({
			link: value.link,
			title: value.title,
			foto: value.foto,
		});
	});
	parceirosPatrocinadores.map((value: any) => {
		partnerList.push({
			link: value.link,
			title: value.title,
			foto: value.foto,
		});
	});
	parceirosMedia.map((value: any) => {
		partnerList.push({
			link: value.link,
			title: value.title,
			foto: value.foto,
		});
	});

	const goto = (link: string) => {
		router.push(link);
	};

	// console.log("partnerList");
	// console.log(partnerList);

	// return;
	return (
		<Layout rsocial={social} contato={contato}>
			{/* <pre>{JSON.stringify(banners, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(bannerData, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(edicao, null, 2)}</pre> */}
			{/* <pre>{JSON.stringify(parceiros, null, 2)}</pre> */}

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
								onClick={() => goto(value.url)}
								className="cursor-pointer"
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
								PRÉMIO NACIONAL DE PUBLICIDADE
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

			<Categorias dados={Categoria} />

			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto">
					<div className="text-center mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-amarelo-ouro mb-4">
							PRÉMIO PÚBLICO DE PUBLICIDADE
						</h1>
						<p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
							O Prémio Público de Publicidade é uma das categorias do Prémio
							Naccional de Publicidade (PNP) em que a votação é feita somente
							pelo público, através da internet. Trata-se de um prémio da
							responsabilidade do PNP, com regulamento próprio, sem avaliaçaõ do
							júri, baseado apenas no critério de popularidade.
						</p>
					</div>
					<div className="flex flex-col gap-4 w-1/2 justify-center sm:mx-auto sm:mb-2 -mx-2">
						<button
							className="h-10 px-6 font-semibold rounded-md bg-black text-white"
							type="submit"
							disabled
						>
							Votar
						</button>

						<Alert color="warning" icon={HiInformationCircle}>
							<span>
								<span className="font-medium">Info!</span> Link ativo somente no
								peíodo de votação.
							</span>
						</Alert>
					</div>
				</div>
			</section>

			<Juri dados={Juris} />

			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block">Pronto para se inscrever?</span>
							<span className="block text-amarelo-ouro">
								Inscrições abertas de 1 a 31 de Janeiro de 2023
							</span>
						</h2>
						<div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
							<div className="inline-flex rounded-md shadow">
								<Link
									href="/inscrever"
									className="inline-flex items-center justify-center rounded-md border border-transparent bg-amarelo-ouro px-5 py-3 text-base font-medium text-white hover:bg-castanho-claro"
								>
									Inscrever
								</Link>
							</div>
							<div className="ml-3 inline-flex rounded-md shadow">
								<Link
									href="/regulamentos"
									className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
								>
									Regulamentos
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Parceiros dados={partnerList} />
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

	const query = qs.stringify(
		{
			sort: ["N_Edicao:asc"],
		},
		{
			encodeValuesOnly: true, // prettify URL
		}
	);

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);
	// GET: dados para banners
	const banners = await fetcher(`${api_link}/banners?populate=deep`);
	// GET: dados dos juris, categorias
	const edicao = await fetcher(`${api_link}/edicoes?populate=deep&${query}`);
	// GET: dados dos parceiros
	const parceiros = await fetcher(`${api_link}/parceiros?populate=deep`);

	// console.log(banners.attributes);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, banners, edicao, parceiros } };
}
