import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import { parseNavbar } from "../../lib/parseNavbar";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
import Gallery from "../../components/Galeria";

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Galeria = ({ social, contato, navbar, edicaoNum, galeriaGroups }: any) => {
	const { user } = useFetchUser();

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>Galeria - Prémio Nacional De Publicidade</title>
				<meta name="description" content="Galeria de imagens do Prémio Nacional de Publicidade" />
			</Head>

			<div className="bg-gray-50">
				<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
					<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
						<span className="block text-amarelo-ouro">
							{edicaoNum ? `Galeria da ${edicaoNum}ª Edição` : "Galeria"}
						</span>
					</h2>
				</div>
			</div>

			{galeriaGroups.length > 0 ? (
				galeriaGroups.map((group: any, i: number) => (
					<Gallery key={i} images={group.images} />
				))
			) : (
				<p className="text-center text-gray-500 py-16">Sem imagens disponíveis.</p>
			)}
		</Layout>
	);
};

export default Galeria;

export async function getServerSideProps({ query }: any) {
	const edicao_id = query.edicao;
	const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "";

	// When no edition is specified, fetch the most recent one
	const edicaoUrl = edicao_id
		? `${api_link}/api/edicoes?populate=deep&sort=N_Edicao:desc&filters[N_Edicao][$eq]=${edicao_id}`
		: `${api_link}/api/edicoes?populate=deep&sort=N_Edicao:desc&pagination[limit]=1`;

	try {
		const results = await Promise.allSettled([
			fetcher(`${api_link}/api/contato`),
			fetcher(edicaoUrl),
			fetcher(`${api_link}/api/menus?populate=deep`),
		]);
		const [contato, edicao, menus] = results.map((r: any) => {
			if (r.status === "fulfilled") return r.value;
			console.error("Endpoint failed:", r.reason);
			return null;
		});

		const edicaoEntry = edicao?.data?.[0] ?? null;
		const edicaoNum = edicaoEntry?.attributes?.N_Edicao ?? null;

		// Build full image URLs server-side so the client receives absolute URLs
		const galeriaGroups = (edicaoEntry?.attributes?.galeria ?? []).map((item: any) => ({
			titulo: item.titulo ?? "",
			images: (item.imagens?.data ?? []).map((img: any) => {
				const url: string = img.attributes?.url ?? "";
				if (!url) return null;
				if (url.startsWith("http") || url.startsWith("//")) return url;
				return `${strapiUrl}${url}`;
			}).filter(Boolean),
		}));

		return {
			props: {
				social: parseNavbar(menus, "redes-social"),
				contato: contato ?? null,
				navbar: parseNavbar(menus, "menus"),
				edicaoNum,
				galeriaGroups,
			},
		};
	} catch (error) {
		console.error("Error fetching galeria data:", error);
		return {
			props: {
				social: [],
				contato: null,
				navbar: [],
				edicaoNum: null,
				galeriaGroups: [],
			},
		};
	}
}
