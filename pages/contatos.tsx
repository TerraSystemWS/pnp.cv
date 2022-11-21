import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const CONTATOS = ({ social, contato, banners }: any) => {
	return (
		<Layout rsocial={social} contato={contato}>
			<section className="bg-white dark:bg-gray-900">
				<div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
					<h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
						Contate-Nos
					</h2>
					<p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
						Teve um problema com o site? Deseja comentar sobre o PNP ou o
						Website? Precisa de mais detalhes sobre o PNP? Informe-Nos.
					</p>
					<form action="#" className="space-y-8">
						<div>
							<label
								htmlFor="email"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Seu Email
							</label>
							<input
								type="email"
								id="email"
								className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
								placeholder="seu_email@dominio.com"
								required
							/>
						</div>
						<div>
							<label
								htmlFor="subject"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Assunto
							</label>
							<input
								type="text"
								id="subject"
								className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
								placeholder="Deixe-nos saber como podemos ajudá-lo"
								required
							/>
						</div>
						<div className="sm:col-span-2">
							<label
								htmlFor="message"
								className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
							>
								Sua mensagem
							</label>
							<textarea
								id="message"
								rows={6}
								className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
								placeholder="Deixe um comentario..."
							></textarea>
						</div>
						<button
							type="submit"
							className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-amarelo-ouro sm:w-fit hover:bg-castanho-claro focus:ring-4 focus:outline-none focus:ring-amarelo-ouro"
						>
							enviar a mensagem
						</button>
					</form>
				</div>
			</section>
		</Layout>
	);
};

export default CONTATOS;

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
