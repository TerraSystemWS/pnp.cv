import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
const qs = require("qs");
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
import { useRouter } from "next/router";
import Gallery from "../../components/Galeria";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Galeria = ({ social, contato, edicao, navbar }: any) => {
	const { user, loading } = useFetchUser();
	const router = useRouter();

	const id = router.query.edicao;
	// console.log("router");
	// console.log(router.query.edicao);
	// const images = [
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg",
	// 	"https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg",
	// ];

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>Galeria - Prémio Nacional De Publicidade</title>
				<meta
					name="description"
					content="Para aceder a sua inscrição introduza o codigo que foi criado
          como participante do PNP, use esse codigo para verificar a sua
          inscrição e ou fazer alterações"
				/>
			</Head>
			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
						<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block text-amarelo-ouro">
								Galeria da {id}ª Edição
							</span>
							{/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> */}
						</h2>
					</div>
				</div>
			</div>
			{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="grid gap-4">
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg"
							alt=""
						/>
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg"
							alt=""
						/>
					</div>
					<div>
						<img
							className="h-auto max-w-full rounded-lg"
							src="https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg"
							alt=" "
						/>
					</div>
				</div>
			</div> */}

			{/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4"> */}
			{edicao.data.map((value: any, index: any) =>
				value.attributes.galeria.map((item: any) => (
					<Gallery
						images={item.imagens.data.map(
							(img: any) => img.attributes.url
						)}
					/>
				))
			)}
			{/* </div> */}
		</Layout>
	);
};

export default Galeria;

export async function getServerSideProps({ params, query }: any) {
	// console.log("params");
	// console.log(params);

	// console.log("query");
	const edicao_id = query.edicao;
	// console.log(edicao_id);

	const queries = new URLSearchParams({ sort: "N_Edicao:desc" });

	const [rsocials, contato, edicao, navbar] = await Promise.all([
		fetcher(`${api_link}/api/redes-social?populate=*`),
		fetcher(`${api_link}/api/contato`),
		fetcher(
			`${api_link}/api/edicoes?populate=deep&${queries.toString()}&filters[N_Edicao][$eq]=${edicao_id}`
		),
		fetcher(`${api_link}/api/menus?populate=deep`),
	]);

	// console.log(`${api_link}/api/edicoes?populate=deep&${queries.toString()}`);

	// console.log(
	// 	`${api_link}/api/edicoes?populate=deep&${queries.toString()}&filters[N_Edicao][$eq]=${edicao_id}`
	// );

	const dlink = navbar.data.flatMap((value: any) =>
		value.attributes.items.data.map((item: any) => ({
			name: item.attributes.title,
			link: item.attributes.url,
		}))
	);

	return { props: { social: rsocials, contato, edicao, navbar: dlink } };
}
