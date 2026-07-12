import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .proj-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .proj-card:hover {
          border-color: ${GOLD} !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 26px rgba(36,31,15,0.1);
        }
        .proj-card:hover .proj-card-arrow { opacity: 1 !important; transform: translateX(0) !important; }
        .pag-btn { transition: background 0.2s, color 0.2s, border-color 0.2s; }
        .pag-btn:hover { background: ${GOLD}14 !important; color: ${GOLD_DARK} !important; border-color: ${GOLD} !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.2rem,5vw,3.52rem)", fontWeight: 700, color: INK, margin: "0 0 0.5rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          Trabalhos Concorrentes
        </h1>
        {edicaoMaisRecente && (
          <p style={{ fontFamily: FONT, fontSize: "1.045rem", color: INK_SOFT, animation: "fadeUp 0.8s ease 0.2s both" }}>
            {edicaoMaisRecente.N_Edicao}ª Edição
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, minHeight: "60vh", padding: "3rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {!edicaoMaisRecente ? (
            <p style={{ textAlign: "center", fontFamily: FONT, color: INK_SOFT, fontSize: "1.045rem", padding: "4rem 0" }}>
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
                    <div style={{ width: "4px", height: "1.4rem", background: GOLD, borderRadius: "2px", flexShrink: 0 }} />
                    <h2 style={{ fontFamily: FONT, fontSize: "1.375rem", fontWeight: 700, color: INK, margin: 0 }}>
                      {categoria.titulo}
                    </h2>
                    {inscricoesCategoria.length > 0 && (
                      <span style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, color: GOLD_DARK, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "2px 10px" }}>
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
                            background: CARD,
                            border: `1px solid ${BORDER}`,
                            borderRadius: "12px",
                            padding: "1.5rem",
                            textDecoration: "none",
                            position: "relative",
                          }}
                        >
                          <h3 style={{ fontFamily: FONT, fontSize: "1.21rem", fontWeight: 700, color: INK, margin: "0 0 0.75rem", lineHeight: 1.4 }}>
                            {inscricao.attributes.nome_projeto || "Sem título"}
                          </h3>
                          <p style={{ fontFamily: FONT, fontSize: "0.902rem", fontWeight: 700, color: INK_SOFT, margin: 0 }}>
                            {inscricao.attributes.sede || "—"}
                          </p>
                          <div className="proj-card-arrow" style={{ position: "absolute", bottom: "1.25rem", right: "1.25rem", color: GOLD_DARK, fontSize: "1.1rem", opacity: 0, transform: "translateX(-6px)", transition: "opacity 0.2s, transform 0.2s" }}>
                            →
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontFamily: FONT, fontSize: "0.968rem", color: INK_SOFT, paddingLeft: "1rem", borderLeft: `1px solid ${BORDER}` }}>
                      Nenhum trabalho inscrito nesta categoria.
                    </p>
                  )}
                </div>
              )
            })
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                {currentPage < totalPages && (
                  <Link
                    href={`?page=${currentPage + 1}`}
                    className="pag-btn"
                    style={{
                      fontFamily: FONT,
                      fontSize: "0.935rem",
                      fontWeight: 700,
                      color: INK,
                      border: `1px solid ${BORDER}`,
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

              <span style={{ fontFamily: FONT, fontSize: "0.902rem", fontWeight: 700, color: INK_SOFT }}>
                Edição {currentPage} / {totalPages}
              </span>

              <div>
                {currentPage > 1 && (
                  <Link
                    href={`?page=${currentPage - 1}`}
                    className="pag-btn"
                    style={{
                      fontFamily: FONT,
                      fontSize: "0.935rem",
                      fontWeight: 700,
                      color: INK,
                      border: `1px solid ${BORDER}`,
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
