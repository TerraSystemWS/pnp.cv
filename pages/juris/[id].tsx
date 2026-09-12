import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar";
import Image from "next/image";
import { useRouter } from "next/router";
import showdown from "showdown";
import Link from "next/link";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
import { getStrapiMedia } from "../../lib/utils";
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, GREY, FONT, FONT_IMPORT } from "../../lib/theme";

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Juris = ({ social, contato, edicao, navbar }: any) => {
	const { user } = useFetchUser();
	const router = useRouter();
	const { id } = router.query;

	const createMarkup = (values: any) => {
		const converter = new showdown.Converter();
		return { __html: converter.makeHtml(typeof values === "string" ? values : "") };
	};

	let JurisA: any[] = [];
	let JurisList: any[] = [];

	;(edicao?.data ?? []).forEach((value: any) => {
		;(value.attributes?.juri ?? []).forEach((value2: any, index2: number) => {
			const foto = getStrapiMedia(value2?.foto?.data?.attributes?.formats?.medium?.url ?? null) || null

			if (id == value2.id) {
				JurisA.push({
					id: index2,
					edicao: value.attributes?.N_Edicao || "",
					j_foto: foto,
					j_nome: value2?.nome || "",
					j_titulo: value2?.titulo || "",
					j_descricao: createMarkup(value2?.descricao),
				})
			}

			if (id != value2.id && router.query.edicao == value.attributes?.N_Edicao) {
				JurisList.push({
					id: index2,
					idd: value2?.id || "",
					edicao: value?.attributes?.N_Edicao || "",
					j_foto: foto,
					j_nome: value2?.nome || "",
					j_titulo: value2?.titulo || "",
				})
			}
		})
	})

	const jurado = JurisA[0]

	if (!jurado) {
		return (
			<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
				<div style={{ background: BG, minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<p style={{ fontFamily: FONT, color: INK_SOFT, fontSize: "1.045rem" }}>Jurado não encontrado.</p>
				</div>
			</Layout>
		)
	}

	const description = `Jurado ${jurado.j_nome} participou na ${jurado.edicao}ª Edição do Prémio Nacional De Publicidade`;

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
			<Head>
				<title>{jurado.j_nome} - Prémio Nacional De Publicidade</title>
				<meta name="description" content={description} />
			</Head>

			<style>{`
				${FONT_IMPORT}
				@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
				.juri-bio h1,.juri-bio h2,.juri-bio h3 { font-family: ${FONT}; color: ${INK}; font-weight: 700; margin: 1.25rem 0 0.75rem; }
				.juri-bio p { font-family: ${FONT}; font-size: 0.98rem; line-height: 1.8; color: ${INK_SOFT}; margin-bottom: 1rem; }
				.juri-bio ul,.juri-bio ol { padding-left: 1.4rem; margin-bottom: 1rem; }
				.juri-bio li { font-family: ${FONT}; font-size: 0.96rem; line-height: 1.7; color: ${INK_SOFT}; margin-bottom: 0.25rem; }
				.juri-bio strong { color: ${INK}; font-weight: 700; }
			`}</style>

			{/* Hero */}
			<div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
				<p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
					Júri da {jurado.edicao}ª Edição
				</p>
				<h1 style={{ fontFamily: FONT, fontSize: "clamp(2.1rem,5vw,3.3rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
					{jurado.j_nome}
				</h1>
				{jurado.j_titulo && (
					<p style={{ fontFamily: FONT, fontSize: "1.045rem", color: INK_SOFT, marginTop: "0.6rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
						{jurado.j_titulo}
					</p>
				)}
			</div>

			{/* Perfil */}
			<div style={{ background: BG, padding: "4rem 2rem" }}>
				<div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "220px 1fr", gap: "3rem" }} className="juri-grid">
					<div>
						<div style={{ width: "220px", height: "220px", borderRadius: "50%", overflow: "hidden", background: GREY, border: `3px solid ${BG_ALT}`, boxShadow: `0 0 0 1px ${BORDER}`, position: "relative" }}>
							{jurado.j_foto ? (
								<Image src={jurado.j_foto} alt={jurado.j_nome} fill style={{ objectFit: "cover" }} />
							) : (
								<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: "3rem", fontWeight: 700, color: GOLD_DARK }}>
									{jurado.j_nome.trim().charAt(0).toUpperCase() || "?"}
								</div>
							)}
						</div>
					</div>
					<div className="juri-bio" dangerouslySetInnerHTML={jurado.j_descricao} />
				</div>
			</div>

			{/* Outros jurados da edição */}
			{JurisList.length > 0 && (
				<div style={{ background: BG_ALT, borderTop: `1px solid ${BORDER}`, padding: "3.5rem 2rem 5rem" }}>
					<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
						<div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
							<h2 style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
								Outros Jurados desta Edição
							</h2>
							<div style={{ flex: 1, height: "1px", background: BORDER }} />
						</div>

						<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
							{JurisList.map((value: any, index: number) => (
								<Link
									key={index}
									href={`/juris/${value.idd}?edicao=${value.edicao}`}
									style={{
										display: "flex", alignItems: "center", gap: "1rem",
										background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px",
										padding: "1.1rem", textDecoration: "none",
										transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
									}}
									onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = GOLD; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 10px 26px rgba(36,31,15,0.1)" }}
									onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = BORDER; el.style.transform = "none"; el.style.boxShadow = "none" }}
								>
									<div style={{ width: "56px", height: "56px", borderRadius: "50%", overflow: "hidden", background: GREY, flexShrink: 0, position: "relative" }}>
										{value.j_foto ? (
											<Image src={value.j_foto} alt={value.j_nome} fill style={{ objectFit: "cover" }} />
										) : (
											<div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 700, color: GOLD_DARK }}>
												{value.j_nome?.trim()?.charAt(0)?.toUpperCase() || "?"}
											</div>
										)}
									</div>
									<div style={{ minWidth: 0 }}>
										<p style={{ fontFamily: FONT, fontSize: "0.98rem", fontWeight: 700, color: INK, margin: "0 0 0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
											{value.j_nome}
										</p>
										<p style={{ fontFamily: FONT, fontSize: "0.82rem", color: INK_SOFT, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
											{value.j_titulo}
										</p>
									</div>
								</Link>
							))}
						</div>
					</div>
				</div>
			)}

			<style>{`
				@media (max-width: 640px) {
					.juri-grid { grid-template-columns: 1fr !important; justify-items: center; text-align: center; }
				}
			`}</style>
		</Layout>
	);
};

export default Juris;

export async function getServerSideProps() {
	const results = await Promise.allSettled([
		fetcher(`${api_link}/api/contato`),
		fetcher(`${api_link}/api/banners?populate=deep`),
		fetcher(`${api_link}/api/edicoes?populate=deep`),
		fetcher(`${api_link}/api/menus?populate=deep`),
	])
	const [contato, banners, edicao, menus] = results.map((r: any) => {
		if (r.status === 'fulfilled') return r.value
		console.error('Endpoint failed:', r.reason)
		return null
	})

	return {
		props: {
			social: parseNavbar(menus, "redes-social"),
			contato: contato ?? null,
			banners: banners ?? null,
			edicao: edicao ?? null,
			navbar: parseNavbar(menus, "menus"),
		},
	};
}
