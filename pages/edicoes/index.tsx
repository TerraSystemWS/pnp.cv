import { Timeline } from "flowbite-react";
import { HiCalendar } from "react-icons/hi";
import { Button } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Edicoes = ({ social, contato }: any) => {
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
							&quot;...descricao...&quot;
						</div>
					</div>
				</div>
			</div>

			<div className="container mx-auto">
				<Timeline>
					<Timeline.Item>
						<Timeline.Point icon={HiCalendar} />
						<Timeline.Content>
							<Timeline.Time>Janeiro 2023</Timeline.Time>
							<Timeline.Title>PNP 6 Edicao</Timeline.Title>
							<Timeline.Body>
								<div id="imagens">
									<h1 className="text-amarelo-ouro text-sm">Imagens</h1>
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
					<Timeline.Item>
						<Timeline.Point icon={HiCalendar} />
						<Timeline.Content>
							<Timeline.Time>March 2022</Timeline.Time>
							<Timeline.Title>PNP 5 Edicao</Timeline.Title>
							<Timeline.Body>
								<Timeline.Body>
									<div id="imagens">
										<h1 className="text-amarelo-ouro text-sm">
											Imagens
											<Button color="gray">
												Saber Mais
												<HiArrowNarrowRight className="ml-2 h-3 w-3" />
											</Button>
										</h1>
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
							</Timeline.Body>
						</Timeline.Content>
					</Timeline.Item>
					<Timeline.Item>
						<Timeline.Point icon={HiCalendar} />
						<Timeline.Content>
							<Timeline.Time>April 2021</Timeline.Time>
							<Timeline.Title>PNP 4 Edicao</Timeline.Title>
							<Timeline.Body>
								<Timeline.Body>
									<div id="imagens">
										<h1 className="text-amarelo-ouro text-sm">
											Imagens
											<Button color="gray">
												Saber Mais
												<HiArrowNarrowRight className="ml-2 h-3 w-3" />
											</Button>
										</h1>
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
							</Timeline.Body>
						</Timeline.Content>
					</Timeline.Item>
				</Timeline>
			</div>
		</Layout>
	);
};

export default Edicoes;

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
