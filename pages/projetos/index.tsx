import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

const Vpublica = ({ edicoes, social, contato, navbar, inscritos, totalPages, currentPage }: any) => {
  const { user } = useFetchUser()

  const edicaoMaisRecente = edicoes[0]?.attributes

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Trabalhos Concorrentes - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Projetos concorrentes ao Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .proj-card { transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; }
        .proj-card:hover {
          border-color: ${GOLD}88 !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 40px ${GOLD}15;
        }
        .proj-card:hover .proj-card-arrow { opacity: 1 !important; transform: translateX(0) !important; }
        .pag-btn { transition: background 0.2s, color 0.2s, border-color 0.2s; }
        .pag-btn:hover { background: ${GOLD}22 !important; color: ${GOLD} !important; border-color: ${GOLD}55 !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "3.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${GOLD}0a 0%, transparent 70%)` }} />

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.2rem,6vw,4.5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: "0 0 0.5rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          Trabalhos Concorrentes
        </h1>
        {edicaoMaisRecente && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD}88`, animation: "fadeUp 0.8s ease 0.2s both" }}>
            {edicaoMaisRecente.N_Edicao}ª Edição
          </p>
        )}
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0", animation: "fadeUp 0.9s ease 0.3s both" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, minHeight: "60vh", padding: "3rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {!edicaoMaisRecente ? (
            <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", color: `${GOLD}44`, fontSize: "0.9rem", padding: "4rem 0" }}>
              Sem edições disponíveis de momento.
            </p>
          ) : (
            (edicaoMaisRecente.categoria ?? []).map((categoria: any) => {
              const inscricoesCategoria = inscritos.filter(
                (inscricao: any) => inscricao.attributes.categoria === categoria.titulo
              )

              return (
                <div key={categoria.id} style={{ marginBottom: "3.5rem" }}>
                  {/* Category header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ width: "3px", height: "1.4rem", background: `linear-gradient(180deg, ${GOLD}, ${GOLD_BRIGHT})`, borderRadius: "2px", flexShrink: 0 }} />
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 300, color: GOLD_BRIGHT, letterSpacing: "0.04em", margin: 0 }}>
                      {categoria.titulo}
                    </h2>
                    {inscricoesCategoria.length > 0 && (
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", color: `${GOLD}66`, border: `1px solid ${GOLD}30`, borderRadius: "100px", padding: "2px 10px" }}>
                        {inscricoesCategoria.length} {inscricoesCategoria.length === 1 ? "trabalho" : "trabalhos"}
                      </span>
                    )}
                  </div>

                  {inscricoesCategoria.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
                      {inscricoesCategoria.map((inscricao: any) => (
                        <Link
                          key={inscricao.id}
                          href={`/projetos/${inscricao.id}`}
                          className="proj-card"
                          style={{
                            display: "block",
                            background: DARK_CARD,
                            border: `1px solid ${GOLD}22`,
                            borderRadius: "12px",
                            padding: "1.5rem",
                            textDecoration: "none",
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}44, transparent)` }} />
                          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", fontWeight: 400, color: "#f5e8b8", letterSpacing: "0.02em", margin: "0 0 0.75rem", lineHeight: 1.4 }}>
                            {inscricao.attributes.nome_projeto || "Sem título"}
                          </h3>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: `${GOLD}66`, margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            {inscricao.attributes.sede || "—"}
                          </p>
                          <div className="proj-card-arrow" style={{ position: "absolute", bottom: "1.25rem", right: "1.25rem", color: GOLD, fontSize: "1rem", opacity: 0, transform: "translateX(-6px)", transition: "opacity 0.2s, transform 0.2s" }}>
                            →
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: `${GOLD}33`, paddingLeft: "1rem", borderLeft: `1px solid ${GOLD}18` }}>
                      Nenhum trabalho inscrito nesta categoria.
                    </p>
                  )}
                </div>
              )
            })
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: `1px solid ${GOLD}18`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                {currentPage < totalPages && (
                  <Link
                    href={`?page=${currentPage + 1}`}
                    className="pag-btn"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: `${GOLD}88`,
                      border: `1px solid ${GOLD}30`,
                      borderRadius: "100px",
                      padding: "9px 22px",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    ← Edição Anterior
                  </Link>
                )}
              </div>

              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.16em", color: `${GOLD}55` }}>
                Edição {currentPage} / {totalPages}
              </span>

              <div>
                {currentPage > 1 && (
                  <Link
                    href={`?page=${currentPage - 1}`}
                    className="pag-btn"
                    style={{
                      fontFamily: "'DM Sans',sans-serif",
                      fontSize: "0.65rem",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: `${GOLD}88`,
                      border: `1px solid ${GOLD}30`,
                      borderRadius: "100px",
                      padding: "9px 22px",
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Edição Seguinte →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Vpublica

export async function getServerSideProps({ query }: any) {
  const page = query.page || 1
  const pageSize = 1

  const queri = qs.stringify(
    {
      sort: ["N_Edicao:desc"],
      pagination: { page, pageSize },
    },
    { encodeValuesOnly: true }
  )

  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&${queri}`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?populate=*`),
    ])
    const [edicoes, contato, menus, inscritos] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    const totalPages = Math.ceil((edicoes?.meta?.pagination?.total ?? 0) / pageSize)
    const currentPage = edicoes?.meta?.pagination?.page ?? 1

    return {
      props: {
        edicoes:     edicoes?.data ?? [],
        totalPages,
        currentPage,
        social:      parseNavbar(menus, "redes-social"),
        contato:     contato ?? null,
        navbar:      parseNavbar(menus, "menus"),
        inscritos:   inscritos?.data ?? [],
      },
    }
  } catch (error) {
    console.error("Error fetching projetos data:", error)
    return {
      props: { edicoes: [], social: [], contato: null, navbar: [], inscritos: [], totalPages: 1, currentPage: 1 },
    }
  }
}
