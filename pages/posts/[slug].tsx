import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import { StrapiImage } from "../../components/custom/StrapiImage";
import { formatDateTime } from "../../lib/utils";
import { useFetchUser } from "../../lib/authContext";

interface PostDetailProps {
	social: any;
	contato: any;
	post: any;
	navbar: any;
}

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const PostDetail = ({ social, contato, post, navbar }: PostDetailProps) => {
	const { user, loading } = useFetchUser();

	// console.log("post");
	// console.log(post.data.attributes);
	// return
	const { Titulo, subtitulo, publishedAt, capa, descricao } =
		post.data.attributes;

	// console.log("capa");
	// console.log(capa);

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>{Titulo}</title>
				<meta name="description" content={subtitulo} />
			</Head>
			<article className="container mx-auto px-4 py-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-3xl font-bold mb-4">{Titulo}</h1>
					<p className="text-gray-600 mb-4">
						Publicado em: {formatDateTime(publishedAt)}
					</p>
					<div className="mb-6">
						<StrapiImage
							src={capa.data?.attributes.url}
							width={800}
							alt={Titulo}
							className="w-full h-auto rounded-lg"
						/>
					</div>

					<p
						className="prose prose-lg"
						dangerouslySetInnerHTML={{ __html: descricao }}
					/>
				</div>
			</article>
		</Layout>
	);
};

export async function getServerSideProps(context: any) {
	try {
		const { slug } = context.params;
		const [rsocials, contato, post, navbar] = await Promise.all([
			fetcher(`${api_link}/api/redes-social?populate=*`),
			fetcher(`${api_link}/api/contato`),
			fetcher(
				`${api_link}/api/noticias/${slug}?populate[0]=noticias&populate[1]=capa`
			),
			fetcher(`${api_link}/api/menus?populate=deep`),
		]);

		const dlink = navbar.data?.flatMap((value: any) =>
			value.attributes.items.data.map((item: any) => ({
				name: item.attributes.title,
				link: item.attributes.url,
			}))
		);

		return { props: { social: rsocials, contato, post, navbar: dlink } };
	} catch (error) {
		console.error("Error fetching data:", error);
		return { props: { error: "Failed to fetch data" } };
	}
}

export default PostDetail;
