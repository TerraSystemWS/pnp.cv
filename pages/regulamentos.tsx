import Layout from "../components/Layout";
import { fetcher } from "../lib/api";
import showdown from "showdown";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Regulamentos = ({ social, contato, edicao }: any) => {
	const createMarkup = (values: any) => {
		// const values =
		const converter = new showdown.Converter();
		const html = converter.makeHtml(values);
		return { __html: html };
	};

	let Categoria: any = [];
	let Regulamentos: any = [];
	// create Juris objetct
	edicao.data.map((value: any, index: any) => {
		value.attributes.regulamentos.map((value2: any, index2: any) => {
			// console.log(value2.foto.data?.attributes.url);
			Regulamentos[index2] = {
				id: index2,
				titulo: value2.titulo,
				descricao: createMarkup(value2.descricao),
			};
		});
		// get dados da categoria
		value.attributes.categoria.map((categs: any, index3: any) => {
			Categoria[index3] = {
				id: index3,
				titulo: categs.titulo,
				descricao: categs.descricao,
			};
		});
	});

	// const a = createMarkup(Regulamentos[0].descricao);

	return (
		<Layout rsocial={social} contato={contato}>
			{/* <pre>{JSON.stringify(edicao, null, 2)}</pre> */}
			<h1 className="text-4xl font-medium text-gray-700 text-center mt-6">
				{" "}
				{Regulamentos[0].titulo}
			</h1>{" "}
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
								<h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
									values.titulo
								</h2>
								<div className="leading-relaxed">
									<span
										className="text-justify"
										dangerouslySetInnerHTML={Regulamentos[0].descricao}
									/>
								</div>
							</div>
						</div>
						{/* ))} */}
					</div>
				</div>
			</section>
			{/* intro to categorias */}
			<h1 className="text-4xl font-medium text-gray-700 text-center mt-6">
				{" "}
				Categorias de Prémios
			</h1>{" "}
			<section className="text-gray-600 body-font overflow-hidden">
				<div className="container px-5 py-24 mx-auto">
					<div className="-my-8 divide-y-2 divide-gray-100">
						{Categoria.map((values: any) => (
							<div
								key={values.id}
								className="py-8 flex flex-wrap md:flex-nowrap"
							>
								<div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
									<span className="font-semibold title-font text-gray-700">
										CATEGORY #{values.id}
									</span>
									<span className="mt-1 text-gray-500 text-sm">
										12 Jun 2019
									</span>
								</div>
								<div className="md:flex-grow">
									<h2 className="text-2xl font-medium text-gray-900 title-font mb-2">
										{values.titulo}
									</h2>
									<p className="leading-relaxed">{values.descricao}</p>
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

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);

	// GET: dados dos juris, categorias
	const edicao = await fetcher(`${api_link}/edicoes?populate=deep`);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, edicao } };
}