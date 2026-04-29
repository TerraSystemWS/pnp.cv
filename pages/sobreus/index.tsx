import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import Link from "next/link"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"

const Sobreus = ({ social, contato, navbar, sobreus }: any) => {
  const { user } = useFetchUser()
  const converter = new showdown.Converter()
  const html = converter.makeHtml(sobreus?.data?.attributes?.sobrepnp ?? "")

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Sobre Nós - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Sobre o Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .sob-content h1,.sob-content h2,.sob-content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          letter-spacing: 0.03em;
          margin: 2.5rem 0 1rem;
        }
        .sob-content h1 { font-size: 2rem;   color: ${GOLD_BRIGHT}; }
        .sob-content h2 { font-size: 1.5rem; color: ${GOLD_BRIGHT}cc; }
        .sob-content h3 { font-size: 1.2rem; color: ${GOLD}; }
        .sob-content p  {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          line-height: 2;
          color: rgba(240,216,144,0.55);
          margin-bottom: 1.1rem;
        }
        .sob-content ul,.sob-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .sob-content li {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          line-height: 1.9;
          color: rgba(240,216,144,0.5);
          margin-bottom: 0.3rem;
        }
        .sob-content strong { color: ${GOLD}cc; font-weight: 500; }
        .sob-content a     { color: ${GOLD}; text-decoration: underline; }
        .sob-content hr    { border: none; border-top: 1px solid ${GOLD}22; margin: 2.5rem 0; }
        .sob-content blockquote {
          border-left: 2px solid ${GOLD};
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-style: italic;
          color: ${GOLD_BRIGHT}88;
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Sobre Nós
        </h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD_BRIGHT}45`, marginTop: "0.9rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          Conheça o propósito e a missão por detrás do PNP.
        </p>
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>

          {html ? (
            <div className="sob-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{ textAlign: "center", color: `${GOLD}44`, fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem" }}>
              Conteúdo não disponível.
            </p>
          )}

          {/* Quick links */}
          <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: `1px solid ${GOLD}18`, display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "Termos de Serviço",       href: "/sobreus/terms" },
              { label: "Política de Privacidade", href: "/sobreus/policy" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: `${GOLD}88`,
                border: `1px solid ${GOLD}30`,
                borderRadius: "100px",
                padding: "8px 20px",
                textDecoration: "none",
                transition: "color 0.25s, border-color 0.25s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = `${GOLD}88`; (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}30` }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Sobreus

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
