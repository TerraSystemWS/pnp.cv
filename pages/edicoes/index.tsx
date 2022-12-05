import { Timeline } from "flowbite-react";
import { HiCalendar } from "react-icons/hi";
import { Button } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Image from "next/image";
const qs = require("qs");

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Edicoes = ({ social, contato, edicao }: any) => {
	return (
		<Layout rsocial={social} contato={contato}>
			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
						<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block text-amarelo-ouro">
								EDIÇOES DO PRÉMIO NACIONAL DE PUBLICIDADE
							</span>
							{/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> */}
						</h2>
						<div className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
							Fotografias, videos, regulamento, os vencedores dos Prémios
							Palmeira e respetivos discursos de vitória… Aqui encontra tudo
							sobre as anteriores edições do PNP.
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto">
				<Timeline>
					{edicao.data.map((value: any, index: any) => (
						<Timeline.Item key={index}>
							<Timeline.Point icon={HiCalendar} />
							<Timeline.Content>
								<Timeline.Time>{value.attributes.publishedAt}</Timeline.Time>
								<Timeline.Title>
									PNP {value.attributes.N_Edicao}ª Edição
								</Timeline.Title>
								<Timeline.Body>
									<div key={index} id="juri">
										<section className="text-gray-600 body-font">
											<div className="container px-5 py-24 mx-auto">
												<div className="flex flex-col text-center w-full mb-20">
													<h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
														Juri
													</h1>
													{/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
														Whatever cardigan tote bag tumblr hexagon brooklyn
														asymmetrical gentrify, subway tile poke
														farm-to-table. Franzen you probably havent heard of
														them.
													</p> */}
												</div>
												<div className="flex flex-wrap -m-2">
													{value.attributes.juri.map(
														(value: any, index: any) => (
															<div
																key={index}
																className="p-2 lg:w-1/3 md:w-1/2 w-full"
															>
																<div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
																	<Image
																		alt="team"
																		className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
																		src={
																			value.foto.data?.attributes.formats
																				.thumbnail.url || "/"
																		}
																		width={50}
																		height={50}
																	/>
																	<div className="flex-grow">
																		<h2 className="text-gray-900 title-font font-medium">
																			{value.nome}
																		</h2>
																	</div>
																</div>
															</div>
														)
													)}
												</div>
											</div>
										</section>
									</div>

									<div id="videos">
										Videos
										<Button color="gray">
											Saber Mais
											<HiArrowNarrowRight className="ml-2 h-3 w-3" />
										</Button>
									</div>
									<div id="catalogos">
										Catalogos
										<Button color="gray">
											Saber Mais
											<HiArrowNarrowRight className="ml-2 h-3 w-3" />
										</Button>
									</div>
									<div id="catalogos">
										Mostra
										<Button color="gray">
											Saber Mais
											<HiArrowNarrowRight className="ml-2 h-3 w-3" />
										</Button>
									</div>
								</Timeline.Body>
							</Timeline.Content>
						</Timeline.Item>
					))}
				</Timeline>
			</div>
		</Layout>
	);
};

export default Edicoes;

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API
	const query = qs.stringify(
		{
			sort: ["N_Edicao:desc"],
		},
		{
			encodeValuesOnly: true, // prettify URL
		}
	);

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);

	// GET: dados dos juris, categorias
	const edicao = await fetcher(`${api_link}/edicoes?populate=deep&${query}`);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, edicao } };
}
