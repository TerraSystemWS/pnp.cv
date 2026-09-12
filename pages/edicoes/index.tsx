import React, { useState } from "react"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Layout from "../../components/Layout"
import Head from "next/head"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"
import { getStrapiMedia } from "../../lib/utils"
import ImageLightbox from "../../components/custom/ImageLightbox"
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Tab = "jurados" | "galeria" | "videos" | "documentos"

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
  const { user } = useFetchUser()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [activeTab, setActiveTab]   = useState<Tab>("jurados")
  const [hovCard, setHovCard]       = useState<string | null>(null)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null)

  const editions: any[] = edicao?.data ?? []
  if (editions.length === 0) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div style={{ background: BG, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: INK_SOFT, fontFamily: FONT }}>Sem edições disponíveis.</p>
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
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .ed-jurado-scroll { scrollbar-width:none; }
        .ed-jurado-scroll::-webkit-scrollbar { display:none; }
        @media(max-width:640px){ .ed-pill-row{ flex-wrap:wrap !important; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          <span style={{ color: GOLD_DARK }}>{num}ª</span> Edição
        </h1>
      </div>

      {/* ── Edition selector pills ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: "0 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 0", display: "flex", gap: "0.5rem", overflowX: "auto" }} className="ed-pill-row">
          {editions.map((e: any, i: number) => (
            <button
              key={i}
              onClick={() => { setCurrentIdx(i); setActiveTab("jurados") }}
              style={{
                flexShrink: 0,
                fontFamily: FONT,
                fontSize: "0.902rem",
                padding: "7px 18px",
                borderRadius: "100px",
                border: currentIdx === i ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                background: currentIdx === i ? GOLD : "transparent",
                color: currentIdx === i ? "#fff" : INK,
                cursor: "pointer",
                fontWeight: currentIdx === i ? 700 : 600,
                transition: "all 0.2s",
              }}
            >
              {e.attributes?.N_Edicao}ª Edição
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: "68px", zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", display: "flex" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                fontFamily: FONT,
                fontSize: "0.968rem",
                fontWeight: 700,
                padding: "1rem 1.25rem",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === t.key ? `3px solid ${GOLD}` : "3px solid transparent",
                color: activeTab === t.key ? INK : INK_SOFT,
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, minHeight: "50vh", padding: "3.5rem 2rem 6rem" }}>
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
                        style={{ width: "220px", background: CARD, border: hov ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s", transform: hov ? "translateY(-4px)" : "none", boxShadow: hov ? "0 10px 26px rgba(36,31,15,0.1)" : "none", cursor: "pointer" }}
                      >
                        <div style={{ position: "relative", height: "200px", background: BG_ALT }}>
                          {imgUrl && <img src={imgUrl} alt={j.nome} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />}
                        </div>
                        <div style={{ padding: "1rem 1.1rem 1.3rem" }}>
                          <h3 style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: hov ? GOLD_DARK : INK, margin: "0 0 3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 0.25s" }}>{j.nome}</h3>
                          <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, margin: 0 }}>{j.titulo}</p>
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
                        <button key={ii}
                          onClick={() => url && setLightboxImage({ url, title: g.titulo ?? "Galeria" })}
                          onMouseEnter={() => setHovCard(`img-${ii}`)} onMouseLeave={() => setHovCard(null)}
                          style={{ position: "relative", aspectRatio: "16/10", borderRadius: "12px", overflow: "hidden", border: hov ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, transition: "border-color 0.25s, transform 0.25s", transform: hov ? "scale(1.02)" : "none", background: CARD, cursor: "zoom-in", padding: 0 }}>
                          {url && <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                          <span style={{
                            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
                            background: hov ? "rgba(20,17,10,0.35)" : "rgba(20,17,10,0)", transition: "background 0.2s",
                          }}>
                            <span style={{
                              width: "38px", height: "38px", borderRadius: "50%", background: "rgba(255,255,255,0.95)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              opacity: hov ? 1 : 0, transform: hov ? "scale(1)" : "scale(0.85)", transition: "opacity 0.2s, transform 0.2s",
                            }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#241f0f" strokeWidth="2.2" strokeLinecap="round">
                                <circle cx="11" cy="11" r="7" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                              </svg>
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {(g.imagens?.data?.length ?? 0) > 9 && (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                      <Link href={`/galeria?edicao=${num}`} style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: GOLD_DARK, borderBottom: `1px solid ${GOLD}`, paddingBottom: "2px", textDecoration: "none" }}>
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
                      style={{ background: CARD, border: hov ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: "16px", overflow: "hidden", transition: "border-color 0.25s, transform 0.25s", transform: hov ? "translateY(-3px)" : "none", position: "relative" }}>
                      {v.titulo && (
                        <div style={{ padding: "1.1rem 1.25rem 0.75rem" }}>
                          <p style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: INK, margin: 0 }}>{v.titulo}</p>
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
                      <div style={{ background: CARD, border: hov ? `1px solid ${GOLD}` : `1px solid ${BORDER}`, borderRadius: "16px", padding: "2rem 1.5rem", textAlign: "center", transition: "border-color 0.25s, transform 0.25s", transform: hov ? "translateY(-4px)" : "none", position: "relative" }}>
                        <p style={{ fontSize: "2.75rem", margin: "0 0 1rem" }}>📄</p>
                        <h3 style={{ fontFamily: FONT, fontSize: "1.155rem", fontWeight: 700, color: hov ? GOLD_DARK : INK, margin: "0 0 0.75rem" }}>{doc.titulo}</h3>
                        <span style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: hov ? GOLD_DARK : INK_SOFT, transition: "color 0.25s" }}>
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

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </Layout>
  )
}

const EmptyMsg = () => (
  <p style={{ textAlign: "center", fontFamily: FONT, color: INK_SOFT, fontSize: "1.045rem", padding: "3rem 0" }}>
    Sem conteúdo disponível para esta edição.
  </p>
)

const SectionHead = ({ title }: { title: string }) => (
  <h2 style={{ fontFamily: FONT, fontSize: "1.375rem", fontWeight: 700, color: INK, marginBottom: "1.5rem", borderLeft: `3px solid ${GOLD}`, paddingLeft: "1rem" }}>
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
