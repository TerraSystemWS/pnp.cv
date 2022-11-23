import Layout from "../components/Layout";
import { fetcher } from "../lib/api";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const CONTATOS = ({ social, contato, banners }: any) => {
	return (
		<Layout rsocial={social} contato={contato}>
			<section className="text-gray-600 body-font relative">
				<div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
					<div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
						<iframe
							width="100%"
							height="100%"
							className="absolute inset-0 "
							frameBorder="0"
							title="map"
							marginHeight={0}
							marginWidth={0}
							scrolling="no"
							src={contato.data.attributes.mapa}
							// style={{filter: grayscale(1) contrast(1.2) opacity(0.4)}}
						></iframe>
						{/* {contato.data.attributes.mapa} */}
						<div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
							<div className="lg:w-1/2 px-6">
								<h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
									ENDEREÇO
								</h2>
								<p className="mt-1">{contato.data.attributes.Local}</p>
							</div>
							<div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
								<h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
									EMAIL
								</h2>
								<a className="text-indigo-500 leading-relaxed">
									{contato.data.attributes.email}
								</a>
								<h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
									Contato
								</h2>
								<p className="leading-relaxed">
									{contato.data.attributes.phone}
								</p>
							</div>
						</div>
					</div>
					<div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
						<h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
							Contate-nos
						</h2>
						<p className="leading-relaxed mb-5 text-gray-600">
							Post-ironic portland shabby chic echo park, banjo fashion axe
						</p>
						<div className="relative mb-4">
							<label htmlFor="name" className="leading-7 text-sm text-gray-600">
								Nome
							</label>
							<input
								type="text"
								id="name"
								name="name"
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							/>
						</div>
						<div className="relative mb-4">
							<label
								htmlFor="email"
								className="leading-7 text-sm text-gray-600"
							>
								Email
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							/>
						</div>
						<div className="relative mb-4">
							<label
								htmlFor="message"
								className="leading-7 text-sm text-gray-600"
							>
								Mensagem
							</label>
							<textarea
								id="message"
								name="message"
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
							></textarea>
						</div>
						<button className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
							Enviar
						</button>
						<p className="text-xs text-gray-500 mt-3">
							Chicharrones blog helvetica normcore iceland tousled brook viral
							artisan.
						</p>
					</div>
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
