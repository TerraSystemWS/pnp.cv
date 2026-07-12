import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const SobreusTerms = ({ social, contato, navbar, sobreus }: any) => {
  const { user } = useFetchUser()
  const converter = new showdown.Converter()
  const html = converter.makeHtml(sobreus?.data?.attributes?.termo_uso ?? "")

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Termos de Serviço - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Termos de Serviço do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .legal-content h1, .legal-content h2, .legal-content h3, .legal-content h4 {
          font-family: ${FONT};
          font-weight: 700;
          margin: 2.2rem 0 1rem;
        }
        .legal-content h1 { font-size: 1.5rem; color: ${INK}; }
        .legal-content h2 {
          font-size: 1.25rem;
          color: ${INK};
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${BORDER};
        }
        .legal-content h3 { font-size: 1.05rem; color: ${GOLD_DARK}; }
        .legal-content h4 { font-size: 0.95rem; color: ${GOLD_DARK}; }
        .legal-content p {
          font-family: ${FONT};
          font-size: 0.96rem;
          line-height: 1.8;
          color: ${INK_SOFT};
          margin-bottom: 1.1rem;
        }
        .legal-content ul, .legal-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .legal-content li {
          font-family: ${FONT};
          font-size: 0.94rem;
          line-height: 1.75;
          color: ${INK_SOFT};
          margin-bottom: 0.3rem;
        }
        .legal-content li::marker { color: ${GOLD_DARK}; }
        .legal-content strong { color: ${INK}; font-weight: 700; }
        .legal-content em { color: ${GOLD_DARK}; font-style: italic; }
        .legal-content a { color: ${GOLD_DARK}; text-decoration: underline; text-underline-offset: 3px; }
        .legal-content hr { border: none; border-top: 1px solid ${BORDER}; margin: 2.5rem 0; }
        .legal-content blockquote {
          border-left: 3px solid ${GOLD};
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          background: ${BG_ALT};
          border-radius: 0 8px 8px 0;
          font-family: ${FONT};
          font-size: 1.05rem;
          font-weight: 600;
          color: ${INK};
        }
        .legal-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-family: ${FONT};
          font-size: 0.88rem;
        }
        .legal-content th {
          color: ${INK};
          font-weight: 700;
          padding: 0.6rem 1rem;
          border-bottom: 1px solid ${BORDER};
          text-align: left;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        .legal-content td {
          color: ${INK_SOFT};
          padding: 0.5rem 1rem;
          border-bottom: 1px solid ${BORDER};
        }

        .back-link:hover { color: ${GOLD_DARK} !important; }
        .section-pill { transition: background 0.2s, color 0.2s; }
        .section-pill:hover { background: ${GOLD}18 !important; color: ${GOLD_DARK} !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: BG_ALT,
        paddingTop: "6rem",
        paddingBottom: "3rem",
        textAlign: "center",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        {/* Breadcrumb */}
        <div style={{ animation: "fadeUp 0.5s ease both", marginBottom: "1.25rem" }}>
          <Link href="/sobreus" className="back-link" style={{
            fontFamily: FONT,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: INK_SOFT,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}>
            ← Sobre Nós
          </Link>
        </div>

        <p style={{
          fontFamily: FONT,
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: GOLD_DARK,
          marginBottom: "1rem",
          animation: "fadeUp 0.6s ease 0.05s both",
        }}>
          Prémio Nacional de Publicidade
        </p>

        <h1 style={{
          fontFamily: FONT,
          fontSize: "clamp(2rem,5vw,3rem)",
          fontWeight: 700,
          color: INK,
          margin: "0 0 0.4rem",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          Termos de Serviço
        </h1>

        <p style={{
          fontFamily: FONT,
          fontSize: "0.95rem",
          color: INK_SOFT,
          animation: "fadeUp 0.8s ease 0.2s both",
          marginTop: "0.5rem",
        }}>
          Leia atentamente antes de utilizar os nossos serviços.
        </p>
      </div>

      {/* ── Document label bar ── */}
      <div style={{
        background: BG,
        borderBottom: `1px solid ${BORDER}`,
        padding: "0.75rem 2rem",
      }}>
        <div style={{
          maxWidth: "820px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          <span style={{
            fontFamily: FONT,
            fontSize: "0.78rem",
            fontWeight: 600,
            color: INK_SOFT,
          }}>
            Documento legal
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["Uso", "Responsabilidades", "Privacidade", "Contacto"].map((tag) => (
              <span key={tag} className="section-pill" style={{
                fontFamily: FONT,
                fontSize: "0.72rem",
                fontWeight: 600,
                color: INK_SOFT,
                border: `1px solid ${BORDER}`,
                borderRadius: "100px",
                padding: "3px 10px",
                cursor: "default",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, padding: "4rem 2rem 6rem", minHeight: "60vh" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>

          {html ? (
            <div className="legal-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{
              textAlign: "center",
              color: INK_SOFT,
              fontFamily: FONT,
              fontSize: "0.95rem",
              padding: "4rem 0",
            }}>
              Conteúdo não disponível.
            </p>
          )}

          {/* Footer nav */}
          <div style={{
            marginTop: "4rem",
            paddingTop: "2.5rem",
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <Link href="/sobreus" style={{
              fontFamily: FONT,
              fontSize: "0.85rem",
              fontWeight: 600,
              color: INK_SOFT,
              textDecoration: "none",
            }}>
              ← Voltar a Sobre Nós
            </Link>

            <Link href="/sobreus/policy" style={{
              fontFamily: FONT,
              fontSize: "0.85rem",
              fontWeight: 700,
              color: INK,
              border: `1px solid ${BORDER}`,
              borderRadius: "100px",
              padding: "8px 20px",
              textDecoration: "none",
            }}>
              Política de Privacidade →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SobreusTerms

export async function getServerSideProps() {
  const results = await Promise.allSettled([
    fetcher(`${api_link}/api/contato`),
    fetcher(`${api_link}/api/menus?populate=deep`),
    fetcher(`${api_link}/api/sobre-pnp?populate=deep`),
  ])
  const [contato, menus, sobreus] = results.map((r: any) => {
    if (r.status === "fulfilled") return r.value
    console.error("Endpoint failed:", r.reason)
    return null
  })

  return {
    props: {
      social:  parseNavbar(menus, "redes-social"),
      contato: contato ?? null,
      navbar:  parseNavbar(menus, "menus"),
      sobreus: sobreus ?? null,
    },
  }
}
