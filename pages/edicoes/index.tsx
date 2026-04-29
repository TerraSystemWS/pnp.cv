import React, { useState } from "react"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Layout from "../../components/Layout"
import Head from "next/head"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"
import { getStrapiMedia } from "../../lib/utils"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

type Tab = "jurados" | "galeria" | "videos" | "documentos"

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
  const { user } = useFetchUser()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [activeTab, setActiveTab]   = useState<Tab>("jurados")
  const [hovCard, setHovCard]       = useState<string | null>(null)

  const editions: any[] = edicao?.data ?? []
  if (editions.length === 0) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div style={{ background: DARK, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: `${GOLD}55`, fontFamily: "'DM Sans',sans-serif" }}>Sem edições disponíveis.</p>
        </div>
      </Layout>
    )
  }

  const ed    = editions[currentIdx]
  const attrs = ed?.attributes ?? {}
  const num   = attrs.N_Edicao ?? ""

  const jurados   = (attrs.juri        ?? [])
  const galerias  = (attrs.galeria     ?? [])
  const videos    = (attrs.videos      ?? [])
  const documents = (attrs.documents   ?? [])

  const tabs: { key: Tab; label: string }[] = [
    { key: "jurados",    label: "Júri" },
    { key: "galeria",    label: "Galeria" },
    { key: "videos",     label: "Vídeos" },
    { key: "documentos", label: "Documentos" },
  ]

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Edições - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Todas as edições do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .ed-jurado-scroll { scrollbar-width:none; }
        .ed-jurado-scroll::-webkit-scrollbar { display:none; }
        @media(max-width:640px){ .ed-pill-row{ flex-wrap:wrap !important; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "3.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>✦ &nbsp; Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          <em style={{ fontStyle: "italic", color: GOLD_BRIGHT }}>{num}ª</em> Edição
        </h1>
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0" }} />
      </div>

      {/* ── Edition selector pills ── */}
      <div style={{ background: DARK_MID, borderBottom: `1px solid ${GOLD}18`, padding: "0 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 0", display: "flex", gap: "0.5rem", overflowX: "auto" }} className="ed-pill-row">
          {editions.map((e: any, i: number) => (
            <button
              key={i}
              onClick={() => { setCurrentIdx(i); setActiveTab("jurados") }}
              style={{
                flexShrink: 0,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "6px 18px",
                borderRadius: "100px",
                border: currentIdx === i ? `1px solid ${GOLD}` : `1px solid ${GOLD}28`,
                background: currentIdx === i ? GOLD : "transparent",
                color: currentIdx === i ? "#0f0a02" : `${GOLD}88`,
                cursor: "pointer",
                fontWeight: currentIdx === i ? 600 : 400,
                transition: "all 0.25s",
              }}
            >
              {e.attributes?.N_Edicao}ª Edição
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ background: DARK_MID, borderBottom: `1px solid ${GOLD}15`, position: "sticky", top: "68px", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.63rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                padding: "1rem 1.25rem",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === t.key ? `2px solid ${GOLD}` : "2px solid transparent",
                color: activeTab === t.key ? GOLD : `${GOLD}50`,
                cursor: "pointer",
                transition: "color 0.25s, border-color 0.25s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, minHeight: "50vh", padding: "3.5rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", animation: "fadeIn 0.4s ease" }}>

          {/* JURADOS */}
          {activeTab === "jurados" && (
            <>
              {jurados.length === 0 && <EmptyMsg />}
              <div className="ed-jurado-scroll" style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "0.5rem", scrollSnapType: "x mandatory" }}>
                {jurados.map((j: any) => {
                  const imgUrl = getStrapiMedia(j.foto.data?.attributes.formats.small?.url ?? null)
                  const hov    = hovCard === `j-${j.id}`
                  return (
                    <Link key={j.id} href={`/juris/${j.id}?edicao=${num}`} style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start" }}>
                      <div
                        onMouseEnter={() => setHovCard(`j-${j.id}`)}
                        onMouseLeave={() => setHovCard(null)}
                        style={{ width: "220px", background: DARK_CARD, border: hov ? `1px solid ${GOLD}55` : `1px solid ${GOLD}18`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.3s, transform 0.3s", transform: hov ? "translateY(-5px)" : "none", cursor: "pointer" }}
                      >
                        <div style={{ position: "relative", height: "200px", background: DARK }}>
                          {imgUrl && <img src={imgUrl} alt={j.nome} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />}
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,13,7,0.9) 0%, transparent 50%)" }} />
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : `${GOLD}35`, transition: "background 0.3s" }} />
                        </div>
                        <div style={{ padding: "1rem 1.1rem 1.3rem" }}>
                          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.05rem", fontWeight: 400, color: hov ? GOLD_BRIGHT : "#f5e8b8", margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.3s" }}>{j.nome}</h3>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD, margin: 0 }}>{j.titulo}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}

          {/* GALERIA */}
          {activeTab === "galeria" && (
            <>
              {galerias.length === 0 && <EmptyMsg />}
              {galerias.slice(0, 1).map((g: any, gi: number) => (
                <div key={gi}>
                  {g.titulo && <SectionHead title={g.titulo} />}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                    {(g.imagens?.data ?? []).slice(0, 9).map((img: any, ii: number) => {
                      const url = getStrapiMedia(img.attributes.formats?.medium?.url ?? null)
                      const hov = hovCard === `img-${ii}`
                      return (
                        <div key={ii}
                          onMouseEnter={() => setHovCard(`img-${ii}`)} onMouseLeave={() => setHovCard(null)}
                          style={{ position: "relative", aspectRatio: "16/10", borderRadius: "12px", overflow: "hidden", border: hov ? `1px solid ${GOLD}55` : `1px solid ${GOLD}15`, transition: "border-color 0.3s, transform 0.3s", transform: hov ? "scale(1.02)" : "none", background: DARK_CARD, cursor: "pointer" }}>
                          {url && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.3s", opacity: hov ? 1 : 0.85 }} />}
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : "transparent" }} />
                        </div>
                      )
                    })}
                  </div>
                  {(g.imagens?.data?.length ?? 0) > 9 && (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                      <Link href={`/galeria?edicao=${num}`} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, borderBottom: `1px solid ${GOLD}55`, paddingBottom: "2px", textDecoration: "none" }}>
                        Ver galeria completa →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          {/* VIDEOS */}
          {activeTab === "videos" && (
            <>
              {videos.length === 0 && <EmptyMsg />}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
                {videos.slice(0, 6).map((v: any, vi: number) => {
                  const hov = hovCard === `v-${vi}`
                  return (
                    <div key={vi}
                      onMouseEnter={() => setHovCard(`v-${vi}`)} onMouseLeave={() => setHovCard(null)}
                      style={{ background: DARK_CARD, border: hov ? `1px solid ${GOLD}55` : `1px solid ${GOLD}18`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.3s, transform 0.3s", transform: hov ? "translateY(-4px)" : "none", position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : `${GOLD}28`, transition: "background 0.3s" }} />
                      {v.titulo && (
                        <div style={{ padding: "1.1rem 1.25rem 0.75rem" }}>
                          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "#f0dfa0cc", margin: 0, letterSpacing: "0.02em" }}>{v.titulo}</p>
                        </div>
                      )}
                      <div style={{ padding: "0 1.25rem 1.25rem" }}>
                        <video controls style={{ width: "100%", borderRadius: "8px", background: "#000" }}>
                          <source src={`${api_link}${v.video?.data?.attributes?.url}`} type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* DOCUMENTOS */}
          {activeTab === "documentos" && (
            <>
              {documents.length === 0 && <EmptyMsg />}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
                {documents.map((doc: any, di: number) => {
                  const hov = hovCard === `d-${di}`
                  const url = doc.ficheiro?.data?.attributes?.url
                  return (
                    <a key={di} href={url ? `${api_link}${url}` : "#"} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}
                      onMouseEnter={() => setHovCard(`d-${di}`)} onMouseLeave={() => setHovCard(null)}>
                      <div style={{ background: DARK_CARD, border: hov ? `1px solid ${GOLD}55` : `1px solid ${GOLD}18`, borderRadius: "16px", padding: "2rem 1.5rem", textAlign: "center", transition: "border-color 0.3s, transform 0.3s", transform: hov ? "translateY(-5px)" : "none", position: "relative" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hov ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : `${GOLD}28` }} />
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "3rem", margin: "0 0 1rem", color: `${GOLD}66` }}>📄</p>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 400, color: hov ? GOLD_BRIGHT : "#f5e8b8", margin: "0 0 0.75rem", letterSpacing: "0.02em" }}>{doc.titulo}</h3>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: hov ? GOLD : `${GOLD}66`, transition: "color 0.3s" }}>
                          Abrir documento →
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

const EmptyMsg = () => (
  <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", color: `rgba(194,161,43,0.35)`, fontSize: "0.82rem", padding: "3rem 0" }}>
    Sem conteúdo disponível para esta edição.
  </p>
)

const SectionHead = ({ title }: { title: string }) => (
  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.04em", marginBottom: "1.5rem", borderLeft: `2px solid #c2a12b`, paddingLeft: "1rem" }}>
    {title}
  </h2>
)

export default Edicoes

export async function getServerSideProps() {
  const query = new URLSearchParams({ sort: "N_Edicao:desc" })
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?populate=deep&${query.toString()}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, edicao, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return { props: { social: parseNavbar(menus, "redes-social"), contato: contato ?? null, edicao: edicao ?? null, navbar: parseNavbar(menus, "menus") } }
  } catch (error) {
    console.error("Error fetching edicoes data:", error)
    return { props: { social: [], contato: null, edicao: null, navbar: [] } }
  }
}
