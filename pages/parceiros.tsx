import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { getStrapiMedia } from "../lib/utils"
import { useState } from "react"
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Partner = {
  id: number
  link: string
  title: string
  foto: string
  tipo: string | null
}

const TIER_COLORS: Record<string, string> = {
  Diamante: "#2a7fa6",
  Ouro:     GOLD_DARK,
  Prata:    "#5a6c73",
  Bronze:   "#8a5a3a",
}
const TIER_LABELS: Record<string, string> = {
  Diamante: "💎 Diamante",
  Ouro:     "✦ Ouro",
  Prata:    "◈ Prata",
  Bronze:   "◇ Bronze",
}

const processPartners = (data: any, category: string): Partner[] =>
  (data ?? [])
    .flatMap((v: any) => v.attributes?.[category] ?? [])
    .map((p: any, i: number) => ({
      id: i,
      link: p.link ?? "#",
      title: p.titulo ?? "",
      foto: getStrapiMedia(p.logo?.data?.attributes?.url) ?? "",
      tipo: p.tipo ?? null,
    }))

const ParceirosPage = ({ social, contato, parceiros, navbar }: any) => {
  const { user } = useFetchUser()
  const [hovCard, setHovCard] = useState<string | null>(null)

  const groups = [
    { label: "Organização",           partners: processPartners(parceiros?.data, "organizacao") },
    { label: "Parceiro Institucional",partners: processPartners(parceiros?.data, "parceiros_padrinhos") },
    { label: "Patrocinadores",        partners: processPartners(parceiros?.data, "patrocinadores") },
    { label: "Parceiros Operacionais",partners: processPartners(parceiros?.data, "parceiros_operacionais") },
    { label: "Media Partners",        partners: processPartners(parceiros?.data, "media_parteners") },
    { label: "Apoio",                 partners: processPartners(parceiros?.data, "parceiros_opoios") },
  ].filter((g) => g.partners.length > 0)

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Parceiros do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Parceiros</h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>Aqueles que nos impulsionam a fazer mais e melhor.</p>
      </div>

      {/* ── Partner groups ── */}
      <div style={{ background: BG, padding: "4rem 2rem 6rem" }}>
        {groups.map((group, gi) => (
          <div key={group.label} style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: gi < groups.length - 1 ? "4rem" : 0 }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: FONT, fontSize: "1.21rem", fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
                {group.label}
              </h2>
              <div style={{ flex: 1, height: "1px", background: BORDER }} />
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
              {group.partners.map((p) => {
                const key = `${gi}-${p.id}`
                const hov = hovCard === key
                const isOrg = group.label === "Organização"
                // Só um teto de largura — o logo aparece no tamanho real dele
                // (largura e altura intactas), em vez de forçado numa altura
                // igual pra todos, que espremia logos retangulares (ex:
                // wordmarks largos e baixos).
                const placeholderH = isOrg ? "120px" : "80px"
                const logoMaxW = isOrg ? "320px" : "240px"
                const cardMinW = isOrg ? "260px" : "180px"
                return (
                  <Link
                    key={key}
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                    onMouseEnter={() => setHovCard(key)}
                    onMouseLeave={() => setHovCard(null)}
                  >
                    <div style={{
                      background: CARD,
                      border: hov ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                      borderRadius: "14px",
                      padding: "2rem 1.75rem",
                      minWidth: cardMinW,
                      maxWidth: `calc(${logoMaxW} + 3.5rem)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1rem",
                      transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                      transform: hov ? "translateY(-4px)" : "none",
                      boxShadow: hov ? "0 10px 26px rgba(36,31,15,0.1)" : "none",
                    }}>
                      {/* Logo */}
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt={p.title}
                          style={{ width: "auto", height: "auto", maxWidth: logoMaxW }}
                        />
                      ) : (
                        <div style={{ height: placeholderH, minWidth: "130px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.1rem", color: INK_SOFT }}>{p.title}</span>
                        </div>
                      )}

                      {/* Title */}
                      <p style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: hov ? GOLD_DARK : INK, textAlign: "center", margin: 0, transition: "color 0.25s" }}>
                        {p.title}
                      </p>

                      {/* Tier badge */}
                      {p.tipo && (
                        <span style={{
                          fontFamily: FONT,
                          fontSize: "0.77rem",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          color: TIER_COLORS[p.tipo] ?? GOLD_DARK,
                          border: `1px solid ${TIER_COLORS[p.tipo] ?? GOLD_DARK}55`,
                          borderRadius: "100px",
                          padding: "3px 10px",
                        }}>
                          {TIER_LABELS[p.tipo] ?? p.tipo}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {groups.length === 0 && (
          <p style={{ textAlign: "center", color: INK_SOFT, fontFamily: FONT, fontSize: "1.045rem" }}>
            Sem dados de parceiros disponíveis.
          </p>
        )}
      </div>
    </Layout>
  )
}

export default ParceirosPage

export async function getServerSideProps() {
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/parceiros?populate=deep&sort[0]=id:desc&pagination[pageSize]=1`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, parceiros, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: { social: parseNavbar(menus, "redes-social"), contato: contato ?? null, parceiros: parceiros ?? null, navbar: parseNavbar(menus, "menus") },
    }
  } catch (error) {
    console.error("Error fetching parceiros data:", error)
    return { props: { social: [], contato: null, parceiros: null, navbar: [] } }
  }
}
