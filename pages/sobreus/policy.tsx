import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .policy-content h1, .policy-content h2, .policy-content h3, .policy-content h4 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.03em;
          margin: 2.5rem 0 1rem;
        }
        .policy-content h1 { font-size: 1.9rem; color: ${GOLD_BRIGHT}; }
        .policy-content h2 {
          font-size: 1.3rem;
          color: ${GOLD_BRIGHT}cc;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid ${GOLD}22;
        }
        .policy-content h3 { font-size: 1.05rem; color: ${GOLD}; }
        .policy-content h4 { font-size: 0.95rem; color: ${GOLD}99; }
        .policy-content p {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          line-height: 2;
          color: rgba(240,216,144,0.52);
          margin-bottom: 1.1rem;
        }
        .policy-content ul, .policy-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .policy-content li {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.855rem;
          line-height: 1.95;
          color: rgba(240,216,144,0.48);
          margin-bottom: 0.3rem;
        }
        .policy-content li::marker { color: ${GOLD}66; }
        .policy-content strong { color: ${GOLD}cc; font-weight: 500; }
        .policy-content em { color: ${GOLD_BRIGHT}88; font-style: italic; }
        .policy-content a { color: ${GOLD}; text-decoration: underline; text-underline-offset: 3px; }
        .policy-content a:hover { color: ${GOLD_BRIGHT}; }
        .policy-content hr { border: none; border-top: 1px solid ${GOLD}18; margin: 2.5rem 0; }
        .policy-content blockquote {
          border-left: 2px solid ${GOLD}55;
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          background: ${GOLD}08;
          border-radius: 0 8px 8px 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-style: italic;
          color: ${GOLD_BRIGHT}77;
        }
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
        }
        .policy-content th {
          color: ${GOLD};
          font-weight: 500;
          padding: 0.6rem 1rem;
          border-bottom: 1px solid ${GOLD}33;
          text-align: left;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 0.72rem;
        }
        .policy-content td {
          color: rgba(240,216,144,0.45);
          padding: 0.5rem 1rem;
          border-bottom: 1px solid ${GOLD}11;
        }

        .back-link:hover { color: ${GOLD} !important; }
        .shield-badge { animation: fadeUp 0.6s ease 0.35s both; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: DARK,
        paddingTop: "7rem",
        paddingBottom: "3.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Noise texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${GOLD}0a 0%, transparent 70%)`,
        }} />

        {/* Breadcrumb */}
        <div style={{ animation: "fadeUp 0.5s ease both", marginBottom: "1.5rem" }}>
          <Link href="/sobreus" className="back-link" style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: `${GOLD}55`,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}>
            ← &nbsp;Sobre Nós
          </Link>
        </div>

        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "0.52rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: `${GOLD}66`,
          marginBottom: "1.2rem",
          animation: "fadeUp 0.6s ease 0.05s both",
        }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "clamp(2.2rem,6vw,4.2rem)",
          fontWeight: 300,
          color: "#f5e8b8",
          letterSpacing: "0.06em",
          margin: "0 0 0.4rem",
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          Política de Privacidade
        </h1>

        <p style={{
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "0.75rem",
          color: `${GOLD_BRIGHT}40`,
          animation: "fadeUp 0.8s ease 0.2s both",
          marginTop: "0.5rem",
        }}>
          Como tratamos e protegemos os seus dados pessoais.
        </p>

        {/* Shield icon */}
        <div className="shield-badge" style={{ marginTop: "1.6rem" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ display: "inline-block", opacity: 0.35 }}>
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke={GOLD} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{
          width: "48px", height: "1px",
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: "1.4rem auto 0",
          animation: "fadeUp 0.9s ease 0.3s both",
        }} />
      </div>

      {/* ── RGPD notice bar ── */}
      <div style={{
        background: DARK_MID,
        borderBottom: `1px solid ${GOLD}18`,
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
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: `${GOLD}55`,
          }}>
            Documento legal · Proteção de dados
          </span>
          <span style={{
            fontFamily: "'DM Sans',sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: `${GOLD}44`,
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke={GOLD} strokeWidth="1.5" />
            </svg>
            Em conformidade com o RGPD
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, padding: "4rem 2rem 6rem", minHeight: "60vh" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>

          {html ? (
            <div className="policy-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{
              textAlign: "center",
              color: `${GOLD}44`,
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.85rem",
              padding: "4rem 0",
            }}>
              Conteúdo não disponível.
            </p>
          )}

          {/* Data highlight card */}
          <div style={{
            marginTop: "3rem",
            padding: "1.75rem 2rem",
            background: DARK_CARD,
            border: `1px solid ${GOLD}22`,
            borderRadius: "16px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "2px",
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD})`,
            }} />
            <p style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: `${GOLD}88`,
              marginBottom: "0.6rem",
            }}>
              Dúvidas sobre os seus dados?
            </p>
            <p style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.85rem",
              color: `${GOLD_BRIGHT}50`,
              lineHeight: "1.7",
              margin: 0,
            }}>
              Para exercer os seus direitos de acesso, rectificação ou eliminação de dados pessoais, contacte-nos através da{" "}
              <Link href="/contatos" style={{ color: GOLD, textDecoration: "underline", textUnderlineOffset: "3px" }}>
                página de contactos
              </Link>.
            </p>
          </div>

          {/* Footer nav */}
          <div style={{
            marginTop: "3rem",
            paddingTop: "2.5rem",
            borderTop: `1px solid ${GOLD}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}>
            <Link href="/sobreus/terms" style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: `${GOLD}88`,
              border: `1px solid ${GOLD}30`,
              borderRadius: "100px",
              padding: "8px 20px",
              textDecoration: "none",
            }}>
              ← Termos de Serviço
            </Link>

            <Link href="/sobreus" style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: `${GOLD}66`,
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
