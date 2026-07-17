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
import {
  GOLD,
  GOLD_DARK,
  GOLD_BRIGHT,
  INK,
  INK_SOFT,
  BG,
  BG_ALT,
  CARD,
  BORDER,
  FONT,
  FONT_IMPORT,
} from "../lib/theme"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
  const UNDER_CONSTRUCTION = false

  const router = useRouter()

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
    Juris.forEach((j) => {
      if (j.j_descricao) map[j.idd] = stripHtml(j.j_descricao)
    })
    setJuriDescs(map)
  }, [Juris.length])

  // Hero slide state
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (bannerData.length < 2) return
    const t = setInterval(
      () => setSlide((s) => (s + 1) % bannerData.length),
      5000
    )
    return () => clearInterval(t)
  }, [bannerData.length])

  // Hovered card
  const [hovCat, setHovCat] = useState<number | null>(null)
  const [hovJuri, setHovJuri] = useState<number | null>(null)

  if (error) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div
          style={{
            background: BG,
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: INK_SOFT, fontFamily: FONT }}>
            Erro ao carregar. Tente mais tarde.
          </p>
        </div>
      </Layout>
    )
  }

  if (UNDER_CONSTRUCTION) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">🚧 Em Construção</h1>
          <p className="text-gray-400">Voltaremos em breve.</p>
        </div>
      </main>
    )
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da atividade publicitária em Cabo Verde."
        />
      </Head>

      {/* ── Global keyframes ── */}
      <style>{`
        ${FONT_IMPORT}

        @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes scrollBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(7px); } }

        .hp-cat-card:hover { border-color: ${GOLD} !important; transform: translateY(-3px); box-shadow: 0 10px 26px rgba(36,31,15,0.1); }
        .hp-cat-card:hover .hp-cat-title { color: ${GOLD_DARK} !important; }
        .hp-jury-scroll { scrollbar-width:none; }
        .hp-jury-scroll::-webkit-scrollbar { display:none; }
        .hp-btn-outline:hover { background: ${GOLD}10 !important; border-color: ${GOLD} !important; }
        .hp-btn-solid:hover  { background: ${GOLD_BRIGHT} !important; box-shadow: 0 6px 22px rgba(194,161,43,0.3) !important; }
      `}</style>

      {/* ══════════════════════════════════════════
          §1  HERO
      ══════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          width: "100%",
          // Banner artwork is a wide letterbox graphic (~1983×793). Sizing the
          // section to that ratio instead of a fixed 100vh means object-fit:
          // cover never has to crop the sides/top to fill the box.
          aspectRatio: "1983 / 793",
          maxHeight: "70vh",
          overflow: "hidden",
          background: INK,
        }}
      >
        {/* Slides */}
        {bannerData.map((b, i) => (
          <div
            key={b.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: i === slide ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          >
            <img
              src={getStrapiMedia(b.url) ?? ""}
              alt={b.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ))}

        {/* Overlay gradient — kept only over the photo, for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(20,16,6,0.55) 0%, rgba(20,16,6,0.25) 40%, rgba(20,16,6,0.8) 100%)",
          }}
        />

        {/* Gold top accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, transparent, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD}, transparent)`,
            pointerEvents: "none",
          }}
        />

        {/* Slide dots */}
        {bannerData.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {bannerData.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "100px",
                  background: i === slide ? GOLD : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "width 0.4s, background 0.4s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Scroll hint */}
        <div
          style={{
            position: "absolute",
            bottom: "2.2rem",
            right: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            animation: "scrollBob 2s ease-in-out infinite",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: "0.715rem",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "28px",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.7), transparent)",
            }}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §2  MANIFESTO / ABOUT
      ══════════════════════════════════════════ */}
      <div style={{ background: BG }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "5rem 2rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="hp-manifesto-grid"
        >
          <style>{`@media(max-width:768px){.hp-manifesto-grid{grid-template-columns:1fr !important; gap:2rem !important;}}`}</style>

          {/* Left — quote */}
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: "0.88rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: GOLD_DARK,
                marginBottom: "1.2rem",
              }}
            >
              A Nossa Missão
            </p>
            <blockquote
              style={{
                fontFamily: FONT,
                fontSize: "clamp(1.65rem, 3vw, 2.2rem)",
                fontWeight: 700,
                lineHeight: 1.35,
                color: INK,
                margin: 0,
                borderLeft: `3px solid ${GOLD}`,
                paddingLeft: "1.5rem",
              }}
            >
              Reconhecer a excelência que move o mercado publicitário de Cabo
              Verde.
            </blockquote>
          </div>

          {/* Right — body text + stats */}
          <div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: "1.1rem",
                lineHeight: 1.8,
                color: INK_SOFT,
                marginBottom: "2.5rem",
              }}
            >
              O{" "}
              <strong style={{ color: INK, fontWeight: 700 }}>
                Prémio Nacional de Publicidade
              </strong>{" "}
              tem como objetivo promover a atividade publicitária através do
              reconhecimento da qualidade dos trabalhos publicitários e
              institucionais veiculados, galardoando aqueles que, com
              criatividade e originalidade, contribuem para o desenvolvimento do
              mercado em Cabo Verde.
            </p>

            {edicaoNum && (
              <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap" }}>
                {[
                  { num: edicaoNum, label: "Edições" },
                  { num: Categoria.length || "—", label: "Categorias" },
                  { num: Juris.length || "—", label: "Jurados" },
                ].map(({ num, label }) => (
                  <div key={label}>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: "2.42rem",
                        fontWeight: 700,
                        color: GOLD_DARK,
                        lineHeight: 1,
                        marginBottom: "4px",
                      }}
                    >
                      {num}
                    </p>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: "0.858rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: INK_SOFT,
                      }}
                    >
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
          §3  CATEGORIAS — compact icon grid
      ══════════════════════════════════════════ */}
      {Categoria.length > 0 && (
        <div
          style={{
            background: BG_ALT,
            padding: "5rem 0",
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}
          >
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "0.88rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: GOLD_DARK,
                  marginBottom: "0.8rem",
                }}
              >
                Competição
              </p>
              <h2
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(1.98rem, 4vw, 2.86rem)",
                  fontWeight: 700,
                  color: INK,
                  margin: 0,
                }}
              >
                Categorias de Prémio
              </h2>
            </div>

            {/* Cards grid — small icon + title, no oversized artwork */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "1rem",
              }}
            >
              {Categoria.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/regulamentos#${cat.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="hp-cat-card"
                    onMouseEnter={() => setHovCat(i)}
                    onMouseLeave={() => setHovCat(null)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      gap: "0.75rem",
                      padding: "1.5rem 1rem",
                      borderRadius: "14px",
                      border: `1px solid ${BORDER}`,
                      background: CARD,
                      cursor: "pointer",
                      transition:
                        "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                    }}
                  >
                    {/* Small icon */}
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: BG_ALT,
                        border: `1px solid ${BORDER}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {cat.url ? (
                        <img
                          src={cat.url}
                          alt={cat.titulo}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            color: GOLD_DARK,
                            fontSize: "1.1rem",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    <p
                      className="hp-cat-title"
                      style={{
                        fontFamily: FONT,
                        fontSize: "0.99rem",
                        fontWeight: 700,
                        color: INK,
                        lineHeight: 1.3,
                        transition: "color 0.25s",
                        margin: 0,
                      }}
                    >
                      {cat.titulo}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          §4  PRÉMIO PÚBLICO
      ══════════════════════════════════════════ */}
      <div style={{ background: BG }}>
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "5rem 2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: FONT,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: GOLD_DARK,
              marginBottom: "1rem",
            }}
          >
            Voto Popular
          </p>
          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(1.98rem, 4vw, 2.86rem)",
              fontWeight: 700,
              color: INK,
              marginBottom: "1.25rem",
            }}
          >
            Prémio Público de Publicidade
          </h2>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: INK_SOFT,
              maxWidth: "640px",
              margin: "0 auto 2rem",
            }}
          >
            Uma categoria onde a votação é feita exclusivamente pelo público,
            através da internet — sem avaliação do júri, baseado unicamente na
            popularidade e no impacto.
          </p>

          {/* Notice */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              border: `1px solid ${BORDER}`,
              borderRadius: "10px",
              padding: "10px 20px",
              background: BG_ALT,
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: "0.935rem",
                fontWeight: 700,
                color: INK_SOFT,
              }}
            >
              ⏳ Disponível apenas durante o período de votação
            </span>
          </div>

          <br />
          <Link
            href="/projetos"
            className="hp-btn-solid"
            style={{
              background: GOLD,
              border: "none",
              borderRadius: "100px",
              padding: "14px 36px",
              fontFamily: FONT,
              fontSize: "0.99rem",
              color: INK,
              fontWeight: 700,
              cursor: "pointer",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              transition: "background 0.3s, box-shadow 0.3s",
            }}
          >
            Ver Projetos em Competição
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          §5  JÚRI — horizontal scroll strip
      ══════════════════════════════════════════ */}
      {Juris.length > 0 && (
        <div
          style={{
            background: BG_ALT,
            padding: "5rem 0",
            borderTop: `1px solid ${BORDER}`,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto 2.5rem",
              padding: "0 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: FONT,
                    fontSize: "0.88rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    color: GOLD_DARK,
                    marginBottom: "0.6rem",
                  }}
                >
                  Avaliação
                </p>
                <h2
                  style={{
                    fontFamily: FONT,
                    fontSize: "clamp(1.98rem, 4vw, 2.86rem)",
                    fontWeight: 700,
                    color: INK,
                    margin: 0,
                  }}
                >
                  Júri da {Juris[0]?.edicao}ª Edição
                </h2>
              </div>
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
              <Link
                key={j.idd}
                href={`/juris/${j.idd}?edicao=${j.edicao}`}
                style={{
                  textDecoration: "none",
                  flexShrink: 0,
                  scrollSnapAlign: "start",
                }}
              >
                <div
                  onMouseEnter={() => setHovJuri(i)}
                  onMouseLeave={() => setHovJuri(null)}
                  style={{
                    width: "240px",
                    background: CARD,
                    border:
                      hovJuri === i
                        ? `1px solid ${GOLD}`
                        : `1px solid ${BORDER}`,
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition:
                      "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                    transform: hovJuri === i ? "translateY(-4px)" : "none",
                    boxShadow:
                      hovJuri === i ? "0 10px 26px rgba(36,31,15,0.1)" : "none",
                    cursor: "pointer",
                  }}
                >
                  {/* Portrait */}
                  <div
                    style={{
                      position: "relative",
                      height: "220px",
                      background: BG_ALT,
                    }}
                  >
                    <img
                      src={getStrapiMedia(j.j_foto) ?? ""}
                      alt={j.j_nome}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "top",
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ padding: "1.1rem 1.25rem 1.4rem" }}>
                    <h3
                      style={{
                        fontFamily: FONT,
                        fontSize: "1.155rem",
                        fontWeight: 700,
                        color: hovJuri === i ? GOLD_DARK : INK,
                        margin: "0 0 4px",
                        transition: "color 0.25s",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {j.j_nome}
                    </h3>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: "0.825rem",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: GOLD_DARK,
                        margin: "0 0 0.75rem",
                      }}
                    >
                      {j.j_titulo}
                    </p>
                    {juriDescs[j.idd] && (
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: "0.935rem",
                          color: INK_SOFT,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
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
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background: INK,
          padding: "6rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <p
            style={{
              fontFamily: FONT,
              fontSize: "0.88rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: GOLD_BRIGHT,
              marginBottom: "1.2rem",
            }}
          >
            Participe
          </p>

          <h2
            style={{
              fontFamily: FONT,
              fontSize: "clamp(2.2rem, 5vw, 3.52rem)",
              fontWeight: 700,
              lineHeight: 1.15,
              color: "#ffffff",
              marginBottom: "0.5rem",
            }}
          >
            Pronto para se
            <br />
            <span style={{ color: GOLD_BRIGHT }}>inscrever?</span>
          </h2>

          <p
            style={{
              fontFamily: FONT,
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.75)",
              marginTop: "1.5rem",
              marginBottom: "2.5rem",
            }}
          >
            Submeta o seu trabalho e faça parte da história da publicidade
            cabo-verdiana.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/inscricao"
              className="hp-btn-solid"
              style={{
                background: GOLD,
                border: "none",
                borderRadius: "100px",
                padding: "14px 40px",
                fontFamily: FONT,
                fontSize: "0.99rem",
                color: INK,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
            >
              Inscrever Agora
            </Link>
            <Link
              href="/regulamentos"
              className="hp-btn-outline"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.5)",
                borderRadius: "100px",
                padding: "14px 40px",
                fontFamily: FONT,
                fontSize: "0.99rem",
                color: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                transition: "background 0.3s, border-color 0.3s",
              }}
            >
              Ver Regulamento
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const query = qs.stringify(
    { sort: ["N_Edicao:DESC"] },
    { encodeValuesOnly: true }
  )
  const queryBanner = qs.stringify(
    { sort: ["id:desc"] },
    { encodeValuesOnly: true }
  )

  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(
        `${api_link}/api/banners?populate[0]=banners&populate[1]=banners.image&${queryBanner}`
      ),
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
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        banners: banners ?? null,
        edicao: edicao?.data?.[0] ?? null,
        navbar: parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      props: {
        error: "Failed to fetch data",
        social: [],
        contato: null,
        navbar: [],
      },
    }
  }
}

export default Home
