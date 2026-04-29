import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { getStrapiMedia } from "../lib/utils"
import { useState } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

type Partner = {
  id: number
  link: string
  title: string
  foto: string
  tipo: string | null
}

const TIER_COLORS: Record<string, string> = {
  Diamante: "#a8d8ea",
  Ouro:     GOLD,
  Prata:    "#b0bec5",
  Bronze:   "#a0785a",
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>✦ &nbsp; Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Parceiros</h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD_BRIGHT}45`, marginTop: "0.9rem", animation: "fadeUp 0.8s ease 0.2s both" }}>Aqueles que nos impulsionam a fazer mais e melhor.</p>
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0" }} />
      </div>

      {/* ── Partner groups ── */}
      <div style={{ background: DARK, padding: "4rem 2rem 6rem" }}>
        {groups.map((group, gi) => (
          <div key={group.label} style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: gi < groups.length - 1 ? "5rem" : 0 }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}30)` }} />
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 300, color: GOLD, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
                {group.label}
              </h2>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${GOLD}30, transparent)` }} />
            </div>

            {/* Cards */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", justifyContent: "center" }}>
              {group.partners.map((p) => {
                const key = `${gi}-${p.id}`
                const hov = hovCard === key
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
                      background: DARK_CARD,
                      border: hov ? `1px solid ${GOLD}66` : `1px solid ${GOLD}20`,
                      borderRadius: "14px",
                      padding: "2rem 1.75rem",
                      width: "200px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "1rem",
                      transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                      transform: hov ? "translateY(-5px)" : "none",
                      boxShadow: hov ? `0 12px 32px rgba(194,161,43,0.12)` : "none",
                      position: "relative",
                      overflow: "hidden",
                    }}>
                      {/* top accent */}
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : `${GOLD}30`, transition: "background 0.3s" }} />

                      {/* Logo */}
                      {p.foto ? (
                        <img
                          src={p.foto}
                          alt={p.title}
                          style={{ width: "130px", height: "80px", objectFit: "contain", filter: "brightness(0.9) saturate(0.8)", transition: "filter 0.3s" }}
                          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1) saturate(1)")}
                          onMouseLeave={e => (e.currentTarget.style.filter = "brightness(0.9) saturate(0.8)")}
                        />
                      ) : (
                        <div style={{ width: "130px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: `${GOLD}55` }}>{p.title}</span>
                        </div>
                      )}

                      {/* Title */}
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: hov ? `${GOLD_BRIGHT}99` : `${GOLD}55`, textAlign: "center", letterSpacing: "0.04em", margin: 0, transition: "color 0.3s" }}>
                        {p.title}
                      </p>

                      {/* Tier badge */}
                      {p.tipo && (
                        <span style={{
                          fontFamily: "'DM Sans',sans-serif",
                          fontSize: "0.54rem",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: TIER_COLORS[p.tipo] ?? GOLD,
                          border: `1px solid ${TIER_COLORS[p.tipo] ?? GOLD}44`,
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
          <p style={{ textAlign: "center", color: `${GOLD}44`, fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem" }}>
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
