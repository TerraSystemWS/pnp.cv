import Layout from "../components/Layout";
import { fetcher } from "../lib/api";
import showdown from "showdown";
// import Link from "next/link";
import Head from "next/head";
const qs = require("qs");
import { useFetchUser } from "../lib/authContext";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Regulamentos = ({ social, contato, edicao, navbar }: any) => {
	const { user, loading } = useFetchUser();
	// const createMarkup = (values: any) => {
	//   // const values =
	//   const converter = new showdown.Converter();
	//   const html = converter.makeHtml(values);
	//   return { __html: html };
	// };

	const createMarkup = (values: any) => {
		// console.log(values);
		if (typeof values !== "string") {
			// Handle the case when values is not a string, such as logging an error or returning a default value.
			console.error("Error: 'values' is not a string.");
			return { __html: "" }; // or any default value you want to return
		}

		const converter = new showdown.Converter();
		const html = converter.makeHtml(values);
		return { __html: html };
	};

	let Categoria: any = [];
	let Regulamentos: any = [];
	// create Juris objetct
	/**
	 * fiz um harded code com o numero de edicoes que tem de ser mudade urgente
	 * antis tinha essa linha edicao.data.map((value: any, index: any) => {
	 */

	console.log("edicao");
	console.log(edicao);
	edicao.attributes.regulamentos.map((value2: any, index2: any) => {
		// console.log("value2 :: regulamentos");
		// console.log(value2.titulo);
		// console.log(value2.descricao);
		//  console.log(value2.foto.data?.attributes.url);
		Regulamentos[index2] = {
			id: index2,
			titulo: value2.titulo,
			descricao: createMarkup(value2.descricao),
		};
	});

	edicao.attributes.categoria.map((categs: any, index3: any) => {
		Categoria[index3] = {
			id: index3,
			titulo: categs.titulo,
			slug: categs.titulo.replace(/ /g, "_"),
			descricao: createMarkup(categs.descricao),
		};
	});

	// edicao.data.map((value: any, index: any) => {
	// 	value.attributes.regulamentos.map((value2: any, index2: any) => {
	// 		// console.log(value2.foto.data?.attributes.url);
	// 		Regulamentos[index2] = {
	// 			id: index2,
	// 			titulo: value2.titulo,
	// 			descricao: createMarkup(value2.descricao),
	// 		};
	// 	});
	// 	// get dados da categoria
	// 	value.attributes.categoria.map((categs: any, index3: any) => {
	// 		Categoria[index3] = {
	// 			id: index3,
	// 			titulo: categs.titulo,
	// 			slug: categs.titulo.replace(/ /g, "_"),
	// 			descricao: createMarkup(categs.descricao),
	// 		};
	// 	});
	// });

	// const a = createMarkup(Regulamentos[0].descricao);

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>Regulamento - Prémio Nacional De Publicidade</title>
				<meta
					name="description"
					content={Regulamentos[0]?.titulo || " "}
				/>
			</Head>
			{/* <pre>{JSON.stringify(edicao, null, 2)}</pre> */}
			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
						<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block text-amarelo-ouro">
								{Regulamentos[0]?.titulo}
							</span>
						</h2>
					</div>
				</div>
			</div>
			<section className="text-gray-600 body-font overflow-hidden">
				<div className="container px-5 py-24 mx-auto">
					<div className="-my-8 divide-y-2 divide-gray-100">
						{/* {Categoria.map((values: any) => ( */}
						<div className="py-8 flex flex-wrap md:flex-nowrap">
							{/* <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
									<span className="font-semibold title-font text-gray-700">
										CATEGORY #{values.id}
									</span>
									<span className="mt-1 text-gray-500 text-sm">
										12 Jun 2019
									</span>
								</div> */}
							<div className="md:flex-grow">
								<div className="leading-relaxed">
									<span
										dangerouslySetInnerHTML={
											Regulamentos[0]?.descricao
										}
									/>
								</div>
							</div>
						</div>
						{/* ))} */}
					</div>
				</div>
			</section>
			{/* intro to categorias */}
			<h1 className="text-4xl font-medium text-gray-700 text-center mt-6 bg-gray-100 pt-10">
				{" "}
				Categorias de Prémios
			</h1>{" "}
			<section className="text-gray-600 body-font overflow-hidden bg-gray-100">
				<div className="container px-5 py-24 mx-auto">
					<div className="-my-8 divide-y-2 divide-gray-300">
						{Categoria.map((values: any) => (
							<div
								key={values.id}
								className="py-8 flex flex-wrap md:flex-nowrap"
							>
								{/* <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
									<span className="font-semibold title-font text-gray-700">
										CATEGORY #{values.id+1}
									</span>
									<span className="mt-1 text-gray-500 text-sm">
										12 Jun 2019
									</span>
								</div> */}
								<div className="md:flex-grow">
									<h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
										<a id={values.slug}>{values.titulo}</a>
									</h2>
									<div className="leading-relaxed">
										<span
											dangerouslySetInnerHTML={
												values.descricao
											}
										/>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</Layout>
	);
};

export default Regulamentos;

export async function getServerSideProps() {
	const query = qs.stringify(
		{ sort: ["N_Edicao:DESC"] },
		{ encodeValuesOnly: true }
	);

	const [rsocials, contato, edicaoResponse, navbarResponse] =
		await Promise.all([
			fetcher(`${api_link}/api/redes-social?populate=*`),
			fetcher(`${api_link}/api/contato`),
			fetcher(`${api_link}/api/edicoes?_limit=1&populate=deep&${query}`),
			fetcher(`${api_link}/api/menus?populate=deep`),
		]);

	const edicao = edicaoResponse?.data?.[0] || null;

	const navbar =
		navbarResponse?.data?.flatMap((menu: any) =>
			menu.attributes.items.data.map((item: any) => ({
				name: item.attributes.title,
				link: item.attributes.url,
			}))
		) || [];

	return {
		props: {
			social: rsocials,
			contato,
			edicao,
			navbar,
		},
	};
}

// This gets called on every request
// export async function getServerSideProps2() {
// 	// Fetch data from external API
// 	const query = qs.stringify(
// 		{
// 			sort: ["N_Edicao:asc"],
// 		},
// 		{
// 			encodeValuesOnly: true, // prettify URL
// 		}
// 	);

// 	// GET: links para as redes sociais
// 	const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`);
// 	// GET: dados para contatos
// 	const contato = await fetcher(`${api_link}/api/contato`);

// 	// GET: dados dos juris, categorias
// 	const edicao = await fetcher(
// 		`${api_link}/api/edicoes?_sort=id:DESC&_limit=1&populate=deep&${query}`
// 	);
// 	// GET: dados do navbar
// 	const navbar = await fetcher(`${api_link}/api/menus?populate=deep`);
// 	//get links for menu
// 	let dlink: any = [];
// 	navbar.data.map((value: any) => {
// 		value.attributes.items.data.map((value: any, index: any) => {
// 			// value.attributes.title;
// 			// value.attributes.url;
// 			// console.log(value);
// 			dlink[index] = {
// 				name: value.attributes.title,
// 				link: value.attributes.url,
// 			};
// 		});
// 	});

// 	// Pass data to the page via props
// 	return {
// 		props: {
// 			social: rsocials,
// 			contato,
// 			edicao: edicao && edicao.data && edicao.data[0],
// 			navbar: dlink,
// 		},
// 	};
// }
