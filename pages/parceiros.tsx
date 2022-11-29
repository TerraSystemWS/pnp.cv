import Layout from "../components/Layout";
import { fetcher } from "../lib/api";
import Link from "next/link";
import Image from "next/image";
// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Parceiros = ({ social, contato, parceiros }: any) => {
	//dados do grupo de parceiros
	let parceirosOrganizacao: any = [];
	let parceirosPadrinho: any = [];
	let parceirosPatrocinadores: any = [];
	let parceirosMedia: any = [];
	let cor: string;

	parceiros.data.map((value: any, index: any) => {
		value.attributes.organizacao.map((value2: any, index2: any) => {
			parceirosOrganizacao[index2] = {
				id: index2,
				link: value2.link,
				title: value2.titulo,
				foto: value2.logo.data.attributes.url,
			};
		});
		value.attributes.parceiros_padrinhos.map((value2: any, index2: any) => {
			parceirosPadrinho[index2] = {
				id: index2,
				link: value2.link,
				title: value2.titulo,
				foto: value2.logo.data.attributes.url,
			};
		});
		value.attributes.patrocinadores.map((value2: any, index2: any) => {
			if (value2.tipo == "Ouro") cor = "#FFD700";
			if (value2.tipo == "Bronze") cor = "#CD7F32";
			if (value2.tipo == "Prata") cor = "#C0C0C0";
			parceirosPatrocinadores[index2] = {
				id: index2,
				link: value2.link,
				title: value2.titulo,
				foto: value2.logo.data.attributes.url,
				tipo: value2.tipo,
				cor: cor,
			};
		});
		value.attributes.media_parteners.map((value2: any, index2: any) => {
			parceirosMedia[index2] = {
				id: index2,
				link: value2.link,
				title: value2.titulo,
				foto: value2.logo.data.attributes.url,
			};
		});
	});

	let heading: string;
	if (parceirosOrganizacao.length > 1) {
		heading = "Organizadores";
	} else {
		heading = "Organizador";
	}

	return (
		<Layout rsocial={social} contato={contato}>
			{/* <pre>{JSON.stringify(parceirosOrganizacao, null, 2)}</pre> */}
			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto">
					<div className="flex flex-col text-center w-full mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
							{heading}
						</h1>
					</div>
					<div className="flex flex-wrap -m-2">
						{parceirosOrganizacao.map((value: any, index: number) => {
							if (index != 0) {
								return (
									<div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
										<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
											<Link href={value.link || "#"}>
												<Image
													alt="team"
													className="w-32 h-32 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
													src={value.foto}
													width={100}
													height={100}
												/>
											</Link>
											<div className="flex-grow">
												<Link href={value.link || "#"}>
													<h2 className="text-gray-900 title-font font-medium">
														{value.title}

														{/* <span
												className={`text-white px-3 py-1 tracking-widest text-xs rounded-bl`}
												style={{ backgroundColor: value.cor }}
											>
												Patrocidador {value.tipo}
											</span> */}
													</h2>
												</Link>
											</div>
										</div>
									</div>
								);
							} else {
								return (
									<div
										key={index}
										className="container px-5 py-24 mx-auto flex flex-wrap flex-col"
									>
										<Link href={value.link || "#"}>
											<Image
												className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-2/3 block mx-auto object-cover object-center rounded"
												alt="hero"
												src={value.foto}
												width={150}
												height={150}
											/>
										</Link>
									</div>
								);
							}
						})}
					</div>
				</div>
			</section>
			{/* patrocinador padrinho */}
			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto justify-content">
					<div className="flex flex-col text-center w-full mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
							Parceiro Institucional
						</h1>
					</div>
					<div className="flex flex-wrap -m-2">
						{parceirosPadrinho.map((value: any, index: number) => {
							if (index != 0) {
								return (
									<div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
										<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
											<Link href={value.link || "#"}>
												<Image
													alt="team"
													className="w-32 h-32 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
													src={value.foto}
													width={100}
													height={100}
												/>
											</Link>
											<div className="flex-grow">
												<Link href={value.link || "#"}>
													<h2 className="text-gray-900 title-font font-medium">
														{value.title}

														{/* <span
													className={`text-white px-3 py-1 tracking-widest text-xs rounded-bl`}
													style={{ backgroundColor: value.cor }}
												>
													Patrocidador {value.tipo}
												</span> */}
													</h2>
												</Link>
											</div>
										</div>
									</div>
								);
							} else {
								return (
									<div
										key={index}
										className="container px-5 py-24 mx-auto flex flex-wrap flex-col"
									>
										<Link href={value.link || "#"}>
											<Image
												className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-2/3 block mx-auto  object-cover object-center rounded"
												alt="hero"
												src={value.foto}
												width={150}
												height={150}
											/>
										</Link>
									</div>
								);
							}
						})}
					</div>
				</div>
			</section>
			{/* patrocidores */}
			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto">
					<div className="flex flex-col text-center w-full mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
							Patrocinadores
						</h1>
					</div>
					<div className="flex flex-wrap -m-2">
						{parceirosPatrocinadores.map((value: any, index: number) => {
							// let a = (
							// 	<span
							// 		className={`text-white px-3 py-1 tracking-widest text-xs rounded-bl`}
							// 		style={{ backgroundColor: value.cor }}
							// 	>
							// 		Patrocidador {value.tipo}
							// 	</span>
							// );
							// if (value.tipo == "Ouro" && index == 0) {
							return (
								// <div key={index} className="">
								// 	<div>{a}</div>
								<div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
									<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
										<Link href={value.link || "#"}>
											<Image
												alt="team"
												className="w-32 h-32 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
												src={value.foto}
												width={100}
												height={100}
											/>
										</Link>
										<div className="flex-grow">
											<Link href={value.link || "#"}>
												<h2 className="text-gray-900 title-font font-medium">
													{value.title}
													{"  "}
												</h2>
												<span
													className={`text-white px-3 py-1 tracking-widest text-xs rounded-bl`}
													style={{ backgroundColor: value.cor }}
												>
													Patrocinador {value.tipo}
												</span>
											</Link>
										</div>
									</div>
								</div>
								// </div>
							);
							// }
						})}
					</div>
				</div>
			</section>
			{/* media */}
			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto">
					<div className="flex flex-col text-center w-full mb-20">
						<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
							Media Partners
						</h1>
					</div>
					<div className="flex flex-wrap -m-2">
						{parceirosMedia.map((value: any, index: number) => (
							<div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
								<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
									<Link href={value.link || " "}>
										<Image
											alt="team"
											className="w-32 h-32 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
											src={value.foto}
											width={100}
											height={100}
										/>
									</Link>
									<div className="flex-grow">
										<Link href={value.link || "#"}>
											<h2 className="text-gray-900 title-font font-medium">
												{value.title}
											</h2>
										</Link>
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

export default Parceiros;

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);

	// GET: dados dos juris, categorias
	const edicao = await fetcher(`${api_link}/edicoes?populate=deep`);
	// GET: dados dos parceiros
	const parceiros = await fetcher(`${api_link}/parceiros?populate=deep`);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, edicao, parceiros } };
}
