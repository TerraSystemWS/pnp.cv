import Head from "next/head"
import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import { useRouter } from "next/router"
import { useFetchUser } from "../lib/authContext"
import { getStrapiMedia } from "../lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

// ── helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html: string, maxLen = 110) {
  if (typeof window === "undefined") return ""
  const div = document.createElement("div")
  div.innerHTML = html
  const text = div.textContent ?? div.innerText ?? ""
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text
}

// ── home ──────────────────────────────────────────────────────────────────────

const Home = ({ social, contato, banners, edicao, navbar, error }: any) => {
  const router   = useRouter()
  const { user } = useFetchUser()

  const bannerData: { id: number; title: string; url: string }[] =
    banners?.data
      ?.filter((v: any) => v.attributes.destaque && v.attributes.banners)
      .map((v: any, i: number) => ({
        id: i,
        title: v.attributes.banners.titulo,
        url: v.attributes.banners.image.data.attributes.url,
      })) ?? []

  const Juris: any[] =
    edicao?.attributes?.juri?.map((v: any, i: number) => ({
      id: i,
      idd: v.id,
      edicao: edicao.attributes.N_Edicao,
      j_foto: v.foto.data?.attributes.formats.medium?.url ?? "/",
      j_nome: v.nome,
      j_titulo: v.titulo,
      j_descricao: v.descricao ?? "",
    })) ?? []

  const Categoria: any[] =
    edicao?.attributes?.categoria?.map((c: any, i: number) => ({
      id: i,
      titulo: c.titulo,
      url: getStrapiMedia(c.capa.data?.attributes.formats.small?.url ?? null),
      slug: c.titulo.replace(/ /g, "_"),
      descricao: c.descricao ?? "",
    })) ?? []

  const edicaoNum: number = edicao?.attributes?.N_Edicao ?? ""

  // Jury descriptions (client-side strip)
  const [juriDescs, setJuriDescs] = useState<Record<number, string>>({})
  useEffect(() => {
    const map: Record<number, string> = {}
    Juris.forEach((j) => { if (j.j_descricao) map[j.idd] = stripHtml(j.j_descricao) })
    setJuriDescs(map)
  }, [Juris.length])

  // Hero slide state
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (bannerData.length < 2) return
    const t = setInterval(() => setSlide((s) => (s + 1) % bannerData.length), 5000)
    return () => clearInterval(t)
  }, [bannerData.length])

  // Hovered card
  const [hovCat, setHovCat] = useState<number | null>(null)
  const [hovJuri, setHovJuri] = useState<number | null>(null)

  if (error) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div style={{ background: DARK, minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: `${GOLD}88`, fontFamily: "'DM Sans', sans-serif" }}>Erro ao carregar. Tente mais tarde.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Prémio Nacional De Publicidade</title>
        <meta name="description" content="O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da atividade publicitária em Cabo Verde." />
      </Head>

      {/* ── Global keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scrollBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }
        @keyframes goldLine { from { width:0; } to { width:60px; } }
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(194,161,43,0); }
          50%      { box-shadow: 0 0 22px 5px rgba(194,161,43,0.22); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .hp-cat-card:hover .hp-cat-overlay { opacity:1 !important; }
        .hp-cat-card:hover .hp-cat-title   { color: ${GOLD_BRIGHT} !important; }
        .hp-jury-scroll { scrollbar-width:none; }
        .hp-jury-scroll::-webkit-scrollbar { display:none; }
        .hp-btn-outline:hover { background: ${GOLD}18 !important; border-color: ${GOLD} !important; color: ${GOLD_BRIGHT} !important; }
        .hp-btn-solid:hover  { background-position: right center !important; box-shadow: 0 6px 26px rgba(194,161,43,0.35) !important; }
      `}</style>

      {/* ══════════════════════════════════════════
          §1  CINEMATIC HERO
      ══════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        height: "100vh",
        minHeight: "600px",
        overflow: "hidden",
        background: DARK,
        marginTop: "-69px", // bleed under navbar
      }}>
        {/* Slides */}
        {bannerData.map((b, i) => (
          <div key={b.id} style={{
            position: "absolute", inset: 0,
            opacity: i === slide ? 1 : 0,
            transition: "opacity 1.2s ease",
          }}>
            <img
              src={getStrapiMedia(b.url) ?? ""}
              alt={b.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        ))}

        {/* Dark overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(8,6,4,0.62) 0%, rgba(8,6,4,0.3) 40%, rgba(8,6,4,0.88) 100%)",
        }} />

        {/* Grain texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Gold top accent */}
        <div style={{
          position: "absolute", top: "69px", left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, transparent, ${GOLD}99, ${GOLD_BRIGHT}, ${GOLD}99, transparent)`,
          pointerEvents: "none",
        }} />

        {/* Hero content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "0 1.5rem",
          paddingTop: "69px",
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.54rem",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: `${GOLD}bb`,
            marginBottom: "1.4rem",
            animation: "fadeUp 0.7s ease 0.1s both",
          }}>
            ✦ &nbsp; Cabo Verde &nbsp; ✦
          </p>

          {edicaoNum && (
            <div style={{
              display: "inline-block",
              border: `1px solid ${GOLD}55`,
              borderRadius: "100px",
              padding: "4px 18px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: `${GOLD}cc`,
              marginBottom: "1.6rem",
              animation: "fadeUp 0.7s ease 0.2s both",
              background: `${GOLD}10`,
            }}>
              {edicaoNum}ª Edição
            </div>
          )}

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.8rem, 9vw, 7rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            color: "#f8ecc8",
            margin: "0 0 0.5rem",
            animation: "fadeUp 0.8s ease 0.3s both",
            textShadow: "0 4px 40px rgba(0,0,0,0.8)",
            maxWidth: "900px",
          }}>
            Prémio Nacional<br />
            <em style={{ color: GOLD_BRIGHT, fontStyle: "italic" }}>de Publicidade</em>
          </h1>

          <div style={{
            width: "60px", height: "1px",
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: "2rem auto",
            animation: "fadeIn 1s ease 0.6s both",
          }} />

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(0.78rem, 2vw, 0.95rem)",
            color: "rgba(240,216,160,0.55)",
            letterSpacing: "0.06em",
            maxWidth: "480px",
            lineHeight: 1.8,
            animation: "fadeUp 0.9s ease 0.5s both",
          }}>
            Reconhecendo a criatividade e excelência publicitária em Cabo Verde.
          </p>

          <div style={{
            display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap", justifyContent: "center",
            animation: "fadeUp 1s ease 0.7s both",
          }}>
            <Link href="/inscricao" className="hp-btn-solid" style={{
              background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
              backgroundSize: "200% auto",
              border: "none",
              borderRadius: "100px",
              padding: "13px 32px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0f0a02",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center",
              transition: "background-position 0.4s, box-shadow 0.3s",
              animation: "goldPulse 3.5s ease-in-out infinite",
            }}>
              Inscrever
            </Link>
            <Link href="/regulamentos" className="hp-btn-outline" style={{
              background: "transparent",
              border: `1px solid ${GOLD}55`,
              borderRadius: "100px",
              padding: "13px 32px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: `${GOLD}bb`,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center",
              transition: "background 0.3s, border-color 0.3s, color 0.3s",
            }}>
              Regulamentos
            </Link>
          </div>
        </div>

        {/* Slide dots */}
        {bannerData.length > 1 && (
          <div style={{ position: "absolute", bottom: "2.5rem", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "8px" }}>
            {bannerData.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{
                width: i === slide ? "24px" : "6px",
                height: "6px",
                borderRadius: "100px",
                background: i === slide ? GOLD : `${GOLD}40`,
                border: "none",
                cursor: "pointer",
                transition: "width 0.4s, background 0.4s",
                padding: 0,
              }} />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        <div style={{
          position: "absolute", bottom: "2.2rem", right: "2rem",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
          animation: "scrollBob 2s ease-in-out infinite",
        }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.5rem", letterSpacing: "0.2em", color: `${GOLD}60`, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: "1px", height: "28px", background: `linear-gradient(to bottom, ${GOLD}80, transparent)` }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §2  MANIFESTO / ABOUT
      ══════════════════════════════════════════ */}
      <div style={{ background: DARK_MID, borderTop: `1px solid ${GOLD}15`, borderBottom: `1px solid ${GOLD}15` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "6rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }} className="hp-manifesto-grid">
          <style>{`@media(max-width:768px){.hp-manifesto-grid{grid-template-columns:1fr !important; gap:2.5rem !important;}}`}</style>

          {/* Left — editorial quote */}
          <div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.4rem" }}>
              ✦ &nbsp; A Nossa Missão
            </p>
            <blockquote style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              lineHeight: 1.3,
              color: "#f5e8b8",
              letterSpacing: "0.02em",
              margin: 0,
              borderLeft: `2px solid ${GOLD}`,
              paddingLeft: "1.5rem",
            }}>
              Reconhecer a excelência que move o mercado publicitário de Cabo Verde.
            </blockquote>

            <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginTop: "2.5rem" }} />
          </div>

          {/* Right — body text + stats */}
          <div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.88rem",
              lineHeight: 2,
              color: `${GOLD_BRIGHT}55`,
              marginBottom: "2.5rem",
            }}>
              O <strong style={{ color: GOLD, fontWeight: 500 }}>Prémio Nacional de Publicidade</strong> tem como
              objetivo promover a atividade publicitária através do reconhecimento da qualidade
              dos trabalhos publicitários e institucionais veiculados, galardoando aqueles que,
              com criatividade e originalidade, contribuem para o desenvolvimento do mercado
              em Cabo Verde.
            </p>

            {edicaoNum && (
              <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                {[
                  { num: edicaoNum, label: "Edições" },
                  { num: Categoria.length || "—", label: "Categorias" },
                  { num: Juris.length || "—", label: "Jurados" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.8rem", fontWeight: 300, color: GOLD, lineHeight: 1, marginBottom: "4px" }}>
                      {num}
                    </p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${GOLD}60` }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §3  CATEGORIAS — dark masonry grid
      ══════════════════════════════════════════ */}
      {Categoria.length > 0 && (
        <div style={{ background: DARK, padding: "6rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1rem" }}>
                ✦ &nbsp; Competição
              </p>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                color: "#f5e8b8",
                letterSpacing: "0.05em",
                margin: "0 0 1rem",
              }}>
                Categorias de Prémio
              </h2>
              <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "0 auto" }} />
            </div>

            {/* Cards grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}>
              {Categoria.map((cat, i) => (
                <Link key={cat.id} href={`/regulamentos#${cat.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    className="hp-cat-card"
                    onMouseEnter={() => setHovCat(i)}
                    onMouseLeave={() => setHovCat(null)}
                    style={{
                      position: "relative",
                      aspectRatio: "1",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: hovCat === i ? `1px solid ${GOLD}66` : `1px solid ${GOLD}20`,
                      transition: "border-color 0.3s, transform 0.3s",
                      transform: hovCat === i ? "translateY(-4px)" : "none",
                      background: DARK_CARD,
                      cursor: "pointer",
                    }}
                  >
                    {/* Background image */}
                    {cat.url && (
                      <img
                        src={cat.url}
                        alt={cat.titulo}
                        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, transition: "opacity 0.4s" }}
                      />
                    )}

                    {/* Dark overlay */}
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "linear-gradient(to top, rgba(8,6,4,0.95) 0%, rgba(8,6,4,0.3) 100%)",
                    }} />

                    {/* Hover overlay with description */}
                    <div className="hp-cat-overlay" style={{
                      position: "absolute", inset: 0,
                      background: `linear-gradient(to top, ${DARK_CARD}fa 0%, ${DARK_CARD}cc 100%)`,
                      opacity: 0,
                      transition: "opacity 0.35s",
                      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                      padding: "1.5rem",
                      textAlign: "center",
                    }}>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: `${GOLD_BRIGHT}70`, lineHeight: 1.7 }}>
                        {cat.descricao?.slice(0, 90) || "Ver mais detalhes"}
                      </p>
                      <span style={{
                        marginTop: "1rem",
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.58rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: GOLD,
                        borderBottom: `1px solid ${GOLD}55`,
                        paddingBottom: "2px",
                      }}>Saiba Mais</span>
                    </div>

                    {/* Gold top accent */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                      background: hovCat === i ? `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})` : `${GOLD}40`,
                      transition: "background 0.3s",
                    }} />

                    {/* Category number */}
                    <div style={{
                      position: "absolute", top: "1rem", right: "1rem",
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "1.8rem",
                      fontWeight: 300,
                      color: `${GOLD}25`,
                      lineHeight: 1,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Title at bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.2rem" }}>
                      <p className="hp-cat-title" style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.05rem",
                        fontWeight: 400,
                        color: "#f5e8b8",
                        letterSpacing: "0.03em",
                        lineHeight: 1.3,
                        transition: "color 0.3s",
                        margin: 0,
                      }}>
                        {cat.titulo}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          §4  PRÉMIO PÚBLICO — dark minimal
      ══════════════════════════════════════════ */}
      <div style={{ background: DARK_MID, borderTop: `1px solid ${GOLD}15`, borderBottom: `1px solid ${GOLD}15` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem" }}>
            ✦ &nbsp; Voto Popular
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 300,
            color: "#f5e8b8",
            letterSpacing: "0.05em",
            marginBottom: "1.5rem",
          }}>
            Prémio Público de Publicidade
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.85rem",
            lineHeight: 2,
            color: `${GOLD_BRIGHT}50`,
            maxWidth: "640px",
            margin: "0 auto 2.5rem",
          }}>
            Uma categoria onde a votação é feita exclusivamente pelo público, através da internet —
            sem avaliação do júri, baseado unicamente na popularidade e no impacto.
          </p>

          {/* Notice */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            border: `1px solid ${GOLD}28`,
            borderRadius: "10px",
            padding: "10px 20px",
            background: `${GOLD}08`,
            marginBottom: "2.5rem",
          }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: `${GOLD}99`, letterSpacing: "0.06em" }}>
              ⏳ &nbsp; Disponível apenas durante o período de votação
            </span>
          </div>

          <br />
          <Link href="/projetos" className="hp-btn-solid" style={{
            background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
            backgroundSize: "200% auto",
            border: "none",
            borderRadius: "100px",
            padding: "14px 36px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0f0a02",
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            transition: "background-position 0.4s, box-shadow 0.3s",
          }}>
            Ver Projetos em Competição
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §5  JÚRI — horizontal scroll strip
      ══════════════════════════════════════════ */}
      {Juris.length > 0 && (
        <div style={{ background: DARK, padding: "6rem 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto 2.5rem", padding: "0 2rem" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.3em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.8rem" }}>
                  ✦ &nbsp; Avaliação
                </p>
                <h2 style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2rem, 5vw, 3.2rem)",
                  fontWeight: 300,
                  color: "#f5e8b8",
                  letterSpacing: "0.04em",
                  margin: 0,
                }}>
                  Júri da {Juris[0]?.edicao}ª Edição
                </h2>
              </div>
              <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, ${GOLD}, transparent)`, marginBottom: "8px" }} />
            </div>
          </div>

          {/* Horizontal scroll */}
          <div
            className="hp-jury-scroll"
            style={{
              display: "flex",
              gap: "1.25rem",
              overflowX: "auto",
              paddingLeft: "max(2rem, calc((100vw - 1200px)/2 + 2rem))",
              paddingRight: "max(2rem, calc((100vw - 1200px)/2 + 2rem))",
              paddingBottom: "0.5rem",
              scrollSnapType: "x mandatory",
            }}
          >
            {Juris.map((j, i) => (
              <Link key={j.idd} href={`/juris/${j.idd}?edicao=${j.edicao}`} style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start" }}>
                <div
                  onMouseEnter={() => setHovJuri(i)}
                  onMouseLeave={() => setHovJuri(null)}
                  style={{
                    width: "240px",
                    background: DARK_CARD,
                    border: hovJuri === i ? `1px solid ${GOLD}55` : `1px solid ${GOLD}18`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "border-color 0.3s, transform 0.3s",
                    transform: hovJuri === i ? "translateY(-5px)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Portrait */}
                  <div style={{ position: "relative", height: "220px", background: DARK }}>
                    <img
                      src={getStrapiMedia(j.j_foto) ?? ""}
                      alt={j.j_nome}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(16,13,7,0.9) 0%, transparent 50%)" }} />
                    {/* Gold top bar */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                      background: hovJuri === i ? `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})` : `${GOLD}40`,
                      transition: "background 0.3s",
                    }} />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1.1rem 1.25rem 1.4rem" }}>
                    <h3 style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.1rem",
                      fontWeight: 400,
                      color: hovJuri === i ? GOLD_BRIGHT : "#f5e8b8",
                      letterSpacing: "0.02em",
                      margin: "0 0 4px",
                      transition: "color 0.3s",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                      {j.j_nome}
                    </h3>
                    <p style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.6rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: GOLD,
                      margin: "0 0 0.75rem",
                    }}>
                      {j.j_titulo}
                    </p>
                    {juriDescs[j.idd] && (
                      <p style={{
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.72rem",
                        color: `${GOLD_BRIGHT}45`,
                        lineHeight: 1.7,
                        margin: 0,
                      }}>
                        {juriDescs[j.idd]}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          §6  CTA — INSCREVER
      ══════════════════════════════════════════ */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        background: DARK_CARD,
        borderTop: `1px solid ${GOLD}25`,
        padding: "7rem 2rem",
        textAlign: "center",
      }}>
        {/* Grain */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.035, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Radial gold glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${GOLD}0d 0%, transparent 70%)`,
        }} />

        <div style={{ position: "relative" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.4rem" }}>
            ✦ &nbsp; Participe
          </p>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            color: "#f5e8b8",
            marginBottom: "0.5rem",
          }}>
            Pronto para se<br />
            <em style={{ color: GOLD_BRIGHT, fontStyle: "italic" }}>inscrever?</em>
          </h2>

          <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "2rem auto" }} />

          <p style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.8rem",
            color: `${GOLD_BRIGHT}45`,
            letterSpacing: "0.08em",
            marginBottom: "3rem",
          }}>
            Submeta o seu trabalho e faça parte da história da publicidade cabo-verdiana.
          </p>

          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/inscricao" className="hp-btn-solid" style={{
              background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
              backgroundSize: "200% auto",
              border: "none",
              borderRadius: "100px",
              padding: "14px 40px",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0f0a02",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background-position 0.4s, box-shadow 0.3s",
              animation: "goldPulse 3.5s ease-in-out infinite",
            }}>
              Inscrever Agora
            </Link>
            <Link href="/regulamentos" className="hp-btn-outline" style={{
              background: "transparent",
              border: `1px solid ${GOLD}50`,
              borderRadius: "100px",
              padding: "14px 40px",
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: `${GOLD}bb`,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.3s, border-color 0.3s, color 0.3s",
            }}>
              Ver Regulamento
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const query       = qs.stringify({ sort: ["N_Edicao:DESC"] }, { encodeValuesOnly: true })
  const queryBanner = qs.stringify({ sort: ["id:desc"] },       { encodeValuesOnly: true })

  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/banners?populate[0]=banners&populate[1]=banners.image&${queryBanner}`),
      fetcher(`${api_link}/api/edicoes?_limit=1&populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const [contato, banners, edicao, menus] = results.map((r) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", (r as PromiseRejectedResult).reason)
      return null
    })

    return {
      props: {
        social:  parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        banners: banners ?? null,
        edicao:  edicao?.data?.[0] ?? null,
        navbar:  parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { props: { error: "Failed to fetch data", social: [], contato: null, navbar: [] } }
  }
}

export default Home
