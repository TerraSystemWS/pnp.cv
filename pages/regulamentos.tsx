import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import qs from "qs"
import { useState } from "react"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .reg-content h1,.reg-content h2,.reg-content h3 {
          font-family: ${FONT};
          color: ${INK};
          font-weight: 700;
          margin: 1.75rem 0 1rem;
        }
        .reg-content h1 { font-size: 1.6rem; }
        .reg-content h2 { font-size: 1.35rem; }
        .reg-content h3 { font-size: 1.1rem; color: ${GOLD_DARK}; }
        .reg-content p  { font-family: ${FONT}; font-size: 0.98rem; line-height: 1.8; color: ${INK_SOFT}; margin-bottom: 1rem; }
        .reg-content ul,.reg-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .reg-content li { font-family: ${FONT}; font-size: 0.96rem; line-height: 1.7; color: ${INK_SOFT}; margin-bottom: 0.25rem; }
        .reg-content strong { color: ${INK}; font-weight: 700; }
        .reg-content a { color: ${GOLD_DARK}; text-decoration: underline; }
        .reg-content hr { border: none; border-top: 1px solid ${BORDER}; margin: 2rem 0; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center" }}>
        <p style={{ fontFamily: FONT, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>Prémio Nacional de Publicidade</p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Regulamento</h1>
        {edicaoNum && <p style={{ fontFamily: FONT, fontSize: "0.95rem", color: INK_SOFT, marginTop: "0.8rem", animation: "fadeUp 0.8s ease 0.2s both" }}>{edicaoNum}ª Edição</p>}
      </div>

      {/* ── Tab selector ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: "68px", zIndex: 10 }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem", display: "flex", gap: "0" }}>
          {(["regulamentos", "categorias"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontFamily: FONT,
                fontSize: "0.9rem",
                fontWeight: 700,
                padding: "1rem 1.5rem",
                background: "transparent",
                border: "none",
                borderBottom: activeTab === tab ? `3px solid ${GOLD}` : "3px solid transparent",
                color: activeTab === tab ? INK : INK_SOFT,
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              {tab === "regulamentos" ? "Regulamentos" : "Categorias"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, minHeight: "60vh", padding: "3.5rem 2rem 5rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Regulamentos tab */}
          {activeTab === "regulamentos" && RegulamentosData.map((r: any) => (
            <div key={r.id}>
              {r.titulo && (
                <h2 style={{ fontFamily: FONT, fontSize: "1.4rem", fontWeight: 700, color: INK, marginBottom: "1.5rem", borderLeft: `3px solid ${GOLD}`, paddingLeft: "1rem" }}>
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
                <div key={cat.id} id={cat.slug} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "2rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: GOLD }} />
                  <h2 style={{ fontFamily: FONT, fontSize: "1.25rem", fontWeight: 700, color: INK, marginBottom: "1.1rem" }}>
                    {cat.titulo}
                  </h2>
                  <div className="reg-content" dangerouslySetInnerHTML={{ __html: cat.html }} />
                </div>
              ))}
            </div>
          )}

          {!edicao && (
            <p style={{ fontFamily: FONT, color: INK_SOFT, textAlign: "center", fontSize: "0.95rem" }}>
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
