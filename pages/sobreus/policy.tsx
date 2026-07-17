import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const SobreusPolicy = ({ social, contato, navbar, sobreus }: any) => {
  const { user } = useFetchUser()
  const converter = new showdown.Converter()
  const html = converter.makeHtml(sobreus?.data?.attributes?.politica ?? "")

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Política de Privacidade - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Política de Privacidade do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .policy-content h1, .policy-content h2, .policy-content h3, .policy-content h4 {
          font-family: ${FONT};
          font-weight: 700;
          margin: 2.2rem 0 1rem;
        }
        .policy-content h1 { font-size: 1.5rem; color: ${INK}; }
        .policy-content h2 {
          font-size: 1.25rem;
          color: ${INK};
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${BORDER};
        }
        .policy-content h3 { font-size: 1.05rem; color: ${GOLD_DARK}; }
        .policy-content h4 { font-size: 0.95rem; color: ${GOLD_DARK}; }
        .policy-content p {
          font-family: ${FONT};
          font-size: 0.96rem;
          line-height: 1.8;
          color: ${INK_SOFT};
          margin-bottom: 1.1rem;
        }
        .policy-content ul, .policy-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-content li {
          font-family: ${FONT};
          font-size: 0.94rem;
          line-height: 1.75;
          color: ${INK_SOFT};
          margin-bottom: 0.3rem;
        }
        .policy-content li::marker { color: ${GOLD_DARK}; }
        .policy-content strong { color: ${INK}; font-weight: 700; }
        .policy-content em { color: ${GOLD_DARK}; font-style: italic; }
        .policy-content a { color: ${GOLD_DARK}; text-decoration: underline; text-underline-offset: 3px; }
        .policy-content hr { border: none; border-top: 1px solid ${BORDER}; margin: 2.5rem 0; }
        .policy-content blockquote {
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
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-family: ${FONT};
          font-size: 0.88rem;
        }
        .policy-content th {
          color: ${INK};
          font-weight: 700;
          padding: 0.6rem 1rem;
          border-bottom: 1px solid ${BORDER};
          text-align: left;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        .policy-content td {
          color: ${INK_SOFT};
          padding: 0.5rem 1rem;
          border-bottom: 1px solid ${BORDER};
        }

        .back-link:hover { color: ${GOLD_DARK} !important; }
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
            fontSize: "0.88rem",
            fontWeight: 700,
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
          fontSize: "0.88rem",
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
          fontSize: "clamp(2.2rem,5vw,3.3rem)",
          fontWeight: 700,
          color: INK,
          margin: "0 0 0.4rem",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          Política de Privacidade
        </h1>

        <p style={{
          fontFamily: FONT,
          fontSize: "1.045rem",
          color: INK_SOFT,
          animation: "fadeUp 0.8s ease 0.2s both",
          marginTop: "0.5rem",
        }}>
          Como tratamos e protegemos os seus dados pessoais.
        </p>

        {/* Shield icon */}
        <div style={{ marginTop: "1.4rem", animation: "fadeUp 0.6s ease 0.35s both" }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block" }}>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── RGPD notice bar ── */}
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
            fontSize: "0.858rem",
            fontWeight: 700,
            color: INK_SOFT,
          }}>
            Documento legal · Proteção de dados
          </span>
          <span style={{
            fontFamily: FONT,
            fontSize: "0.858rem",
            fontWeight: 700,
            color: INK_SOFT,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke={GOLD_DARK} strokeWidth="1.5" />
            </svg>
            Em conformidade com o RGPD
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, padding: "4rem 2rem 6rem", minHeight: "60vh" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>

          {html ? (
            <div className="policy-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{
              textAlign: "center",
              color: INK_SOFT,
              fontFamily: FONT,
              fontSize: "1.045rem",
              padding: "4rem 0",
            }}>
              Conteúdo não disponível.
            </p>
          )}

          {/* Data highlight card */}
          <div style={{
            marginTop: "3rem",
            padding: "1.75rem 2rem",
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "3px",
              background: GOLD,
            }} />
            <p style={{
              fontFamily: FONT,
              fontSize: "0.935rem",
              fontWeight: 700,
              color: GOLD_DARK,
              marginBottom: "0.6rem",
            }}>
              Dúvidas sobre os seus dados?
            </p>
            <p style={{
              fontFamily: FONT,
              fontSize: "1.012rem",
              color: INK_SOFT,
              lineHeight: "1.7",
              margin: 0,
            }}>
              Para exercer os seus direitos de acesso, rectificação ou eliminação de dados pessoais, contacte-nos através da{" "}
              <Link href="/contatos" style={{ color: GOLD_DARK, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                página de contactos
              </Link>.
            </p>
          </div>

          {/* Footer nav */}
          <div style={{
            marginTop: "3rem",
            paddingTop: "2.5rem",
            borderTop: `1px solid ${BORDER}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <Link href="/sobreus/terms" style={{
              fontFamily: FONT,
              fontSize: "0.935rem",
              fontWeight: 700,
              color: INK,
              border: `1px solid ${BORDER}`,
              borderRadius: "100px",
              padding: "8px 20px",
              textDecoration: "none",
            }}>
              ← Termos de Serviço
            </Link>

            <Link href="/sobreus" style={{
              fontFamily: FONT,
              fontSize: "0.935rem",
              fontWeight: 700,
              color: INK_SOFT,
              textDecoration: "none",
            }}>
              Voltar a Sobre Nós →
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SobreusPolicy

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
