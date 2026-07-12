import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import Link from "next/link"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .sob-content h1,.sob-content h2,.sob-content h3 {
          font-family: ${FONT};
          font-weight: 700;
          margin: 2.2rem 0 1rem;
        }
        .sob-content h1 { font-size: 1.6rem; color: ${INK}; }
        .sob-content h2 { font-size: 1.35rem; color: ${INK}; }
        .sob-content h3 { font-size: 1.1rem; color: ${GOLD_DARK}; }
        .sob-content p  {
          font-family: ${FONT};
          font-size: 1rem;
          line-height: 1.8;
          color: ${INK_SOFT};
          margin-bottom: 1.1rem;
        }
        .sob-content ul,.sob-content ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .sob-content li {
          font-family: ${FONT};
          font-size: 0.96rem;
          line-height: 1.7;
          color: ${INK_SOFT};
          margin-bottom: 0.3rem;
        }
        .sob-content strong { color: ${INK}; font-weight: 700; }
        .sob-content a     { color: ${GOLD_DARK}; text-decoration: underline; }
        .sob-content hr    { border: none; border-top: 1px solid ${BORDER}; margin: 2.5rem 0; }
        .sob-content blockquote {
          border-left: 3px solid ${GOLD};
          padding-left: 1.25rem;
          margin: 2rem 0;
          font-family: ${FONT};
          font-size: 1.15rem;
          font-weight: 600;
          color: ${INK};
        }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Sobre Nós
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          Conheça o propósito e a missão por detrás do PNP.
        </p>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>

          {html ? (
            <div className="sob-content" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <p style={{ textAlign: "center", color: INK_SOFT, fontFamily: FONT, fontSize: "1.045rem" }}>
              Conteúdo não disponível.
            </p>
          )}

          {/* Quick links */}
          <div style={{ marginTop: "4rem", paddingTop: "2.5rem", borderTop: `1px solid ${BORDER}`, display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "Termos de Serviço",       href: "/sobreus/terms" },
              { label: "Política de Privacidade", href: "/sobreus/policy" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{
                fontFamily: FONT,
                fontSize: "0.935rem",
                fontWeight: 700,
                color: INK,
                border: `1px solid ${BORDER}`,
                borderRadius: "100px",
                padding: "8px 20px",
                textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD_DARK; (e.currentTarget as HTMLElement).style.borderColor = GOLD }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = INK; (e.currentTarget as HTMLElement).style.borderColor = BORDER }}
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
