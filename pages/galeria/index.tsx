import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import { parseNavbar } from "../../lib/parseNavbar";
import Head from "next/head";
import Link from "next/link";
import { useFetchUser } from "../../lib/authContext";
import Gallery from "../../components/Galeria";
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme";

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Galeria = ({ social, contato, navbar, edicaoNum, galeriaGroups, edicoesDisponiveis }: any) => {
	const { user } = useFetchUser();

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>Galeria - Prémio Nacional De Publicidade</title>
				<meta name="description" content="Galeria de imagens do Prémio Nacional de Publicidade" />
			</Head>

			<style>{`${FONT_IMPORT}`}</style>

			<div style={{ background: BG_ALT, borderBottom: `1px solid ${BORDER}`, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center" }}>
				<p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem" }}>
					Prémio Nacional de Publicidade
				</p>
				<h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0 }}>
					{edicaoNum ? `Galeria da ${edicaoNum}ª Edição` : "Galeria"}
				</h1>
			</div>

			{edicoesDisponiveis && edicoesDisponiveis.length > 1 && (
				<div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: "0 2rem" }}>
					<div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 0", display: "flex", gap: "0.5rem", overflowX: "auto" }}>
						{edicoesDisponiveis.map((n: number) => {
							const active = n === edicaoNum
							return (
								<Link key={n} href={`/galeria?edicao=${n}`} style={{ textDecoration: "none" }}>
									<span style={{
										display: "inline-block",
										flexShrink: 0,
										fontFamily: FONT,
										fontSize: "0.91rem",
										fontWeight: 700,
										padding: "0.55rem 1.1rem",
										borderRadius: "100px",
										border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
										background: active ? GOLD : CARD,
										color: active ? INK : INK_SOFT,
										whiteSpace: "nowrap",
									}}>
										{n}ª Edição
									</span>
								</Link>
							)
						})}
					</div>
				</div>
			)}

			<div style={{ background: BG, paddingBottom: "3rem" }}>
				{galeriaGroups.length > 0 ? (
					galeriaGroups.map((group: any, i: number) => (
						<Gallery key={i} images={group.images} />
					))
				) : (
					<p style={{ textAlign: "center", color: INK_SOFT, fontFamily: FONT, fontSize: "1.045rem", padding: "4rem 0" }}>
						Sem imagens disponíveis.
					</p>
				)}
			</div>
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
			fetcher(`${api_link}/api/edicoes?fields[0]=N_Edicao&sort=N_Edicao:desc&pagination[limit]=100`),
		]);
		const [contato, edicao, menus, todasEdicoes] = results.map((r: any) => {
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

		const edicoesDisponiveis: number[] = (todasEdicoes?.data ?? [])
			.map((e: any) => e.attributes?.N_Edicao)
			.filter((n: any) => n !== undefined && n !== null);

		return {
			props: {
				social: parseNavbar(menus, "redes-social"),
				contato: contato ?? null,
				navbar: parseNavbar(menus, "menus"),
				edicaoNum,
				galeriaGroups,
				edicoesDisponiveis,
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
				edicoesDisponiveis: [],
			},
		};
	}
}
