import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import qs from "qs"
import { useState } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

const Regulamentos = ({ social, contato, edicao, navbar }: any) => {
  const { user } = useFetchUser()
  const [activeTab, setActiveTab] = useState<"regulamentos" | "categorias">("regulamentos")

  const converter = new showdown.Converter()

  const RegulamentosData = (edicao?.attributes?.regulamentos ?? []).map(
    (r: any, i: number) => ({
      id: i,
      titulo: r.titulo,
      html: converter.makeHtml(typeof r.descricao === "string" ? r.descricao : ""),
    })
  )

  const CategoriaData = (edicao?.attributes?.categoria ?? []).map(
    (c: any, i: number) => ({
      id: i,
      titulo: c.titulo,
      slug: c.titulo.replace(/ /g, "_"),
      html: converter.makeHtml(typeof c.descricao === "string" ? c.descricao : ""),
    })
  )

  const edicaoNum = edicao?.attributes?.N_Edicao ?? ""

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Regulamento - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Regulamento do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        /* Markdown content dark styling */
        .reg-content h1,.reg-content h2,.reg-content h3 {
          font-family: 'Cormorant Garamond', serif;
          color: ${GOLD_BRIGHT};
          font-weight: 300;
          margin: 2rem 0 1rem;
          letter-spacing: 0.03em;
        }
        .reg-content h1 { font-size: 2rem; }
        .reg-content h2 { font-size: 1.5rem; }
        .reg-content h3 { font-size: 1.2rem; color: ${GOLD}; }
        .reg-content p  { font-family: 'DM Sans', sans-serif; font-size: 0.88rem; line-height: 2; color: rgba(240,216,144,0.55); margin-bottom: 1rem; }
        .reg-content ul,.reg-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .reg-content li { font-family: 'DM Sans', sans-serif; font-size: 0.86rem; line-height: 1.9; color: rgba(240,216,144,0.5); margin-bottom: 0.25rem; }
        .reg-content strong { color: ${GOLD}cc; font-weight: 500; }
        .reg-content a { color: ${GOLD}; text-decoration: underline; }
        .reg-content hr { border: none; border-top: 1px solid ${GOLD}22; margin: 2rem 0; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>✦ &nbsp; Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Regulamento</h1>
        {edicaoNum && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.74rem", color: `${GOLD}88`, marginTop: "0.8rem", animation: "fadeUp 0.8s ease 0.2s both" }}>{edicaoNum}ª Edição</p>}
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0", animation: "fadeUp 0.9s ease 0.3s both" }} />
      </div>

      {/* ── Tab selector ── */}
      <div style={{ background: DARK_MID, borderBottom: `1px solid ${GOLD}18`, position: "sticky", top: "68px", zIndex: 10 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: "0" }}>
          {(["regulamentos", "categorias"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "1rem 1.5rem",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? `2px solid ${GOLD}` : "2px solid transparent",
                color: activeTab === tab ? GOLD : `${GOLD}55`,
                cursor: "pointer",
                transition: "color 0.25s, border-color 0.25s",
              }}
            >
              {tab === "regulamentos" ? "Regulamentos" : "Categorias"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, minHeight: "60vh", padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Regulamentos tab */}
          {activeTab === "regulamentos" && RegulamentosData.map((r: any) => (
            <div key={r.id}>
              {r.titulo && (
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 300, color: GOLD_BRIGHT, letterSpacing: "0.04em", marginBottom: "2rem", borderLeft: `2px solid ${GOLD}`, paddingLeft: "1rem" }}>
                  {r.titulo}
                </h2>
              )}
              <div className="reg-content" dangerouslySetInnerHTML={{ __html: r.html }} />
            </div>
          ))}

          {/* Categorias tab */}
          {activeTab === "categorias" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1.5rem" }}>
              {CategoriaData.map((cat: any) => (
                <div key={cat.id} id={cat.slug} style={{ background: DARK_CARD, border: `1px solid ${GOLD}22`, borderRadius: "16px", padding: "2rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD})` }} />
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 400, color: GOLD_BRIGHT, letterSpacing: "0.04em", marginBottom: "1.25rem" }}>
                    {cat.titulo}
                  </h2>
                  <div className="reg-content" dangerouslySetInnerHTML={{ __html: cat.html }} />
                </div>
              ))}
            </div>
          )}

          {!edicao && (
            <p style={{ fontFamily: "'DM Sans',sans-serif", color: `${GOLD}55`, textAlign: "center", fontSize: "0.85rem" }}>
              Sem dados de regulamento disponíveis.
            </p>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Regulamentos

export async function getServerSideProps() {
  const query = qs.stringify({ sort: ["N_Edicao:DESC"] }, { encodeValuesOnly: true })

  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?_limit=1&populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, edicaoResponse, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: {
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        edicao: edicaoResponse?.data?.[0] ?? null,
        navbar: parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Error fetching regulamentos data:", error)
    return { props: { social: [], contato: null, edicao: null, navbar: [] } }
  }
}
