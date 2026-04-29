import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { formatDateTime } from "../../lib/utils"
import { getStrapiMedia } from "../../lib/utils"
import { useState } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

const PostList = ({ social, contato, posts, navbar }: any) => {
  const { user } = useFetchUser()
  const [currentPage, setCurrentPage] = useState(1)
  const [hovMain, setHovMain]         = useState<number | null>(null)
  const [hovSide, setHovSide]         = useState<number | null>(null)
  const [hovPage, setHovPage]         = useState<string | null>(null)

  const postsPerPage = 4
  const allPosts     = posts?.data ?? []
  const totalPages   = Math.max(1, Math.ceil(Math.max(0, allPosts.length - 6) / postsPerPage))

  const paginated = allPosts.slice(
    6 + (currentPage - 1) * postsPerPage,
    6 + currentPage * postsPerPage,
  )

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Blog - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Notícias e actualizações do Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media(max-width:900px){ .pl-main-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "4rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.2rem", animation: "fadeUp 0.6s ease both" }}>✦ &nbsp; Notícias &amp; Actualizações</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,7vw,5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Blog</h1>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD_BRIGHT}45`, marginTop: "0.9rem", animation: "fadeUp 0.8s ease 0.2s both" }}>Fique por dentro das últimas novidades do PNP.</p>
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0" }} />
      </div>

      <div style={{ background: DARK, padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {allPosts.length === 0 && (
            <p style={{ textAlign: "center", fontFamily: "'DM Sans',sans-serif", color: `${GOLD}44`, fontSize: "0.85rem" }}>
              Sem publicações disponíveis.
            </p>
          )}

          {/* ── Main grid: featured (2 posts) + sidebar (4 posts) ── */}
          {allPosts.length > 0 && (
            <div className="pl-main-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", marginBottom: "3rem" }}>

              {/* Featured posts */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {allPosts.slice(0, 2).map((post: any, i: number) => {
                  const imgUrl = getStrapiMedia(post.attributes.capa?.data?.attributes?.url)
                  return (
                    <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}
                      onMouseEnter={() => setHovMain(i)} onMouseLeave={() => setHovMain(null)}>
                      <article style={{
                        background: DARK_CARD,
                        border: hovMain === i ? `1px solid ${GOLD}55` : `1px solid ${GOLD}18`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        display: "flex",
                        transition: "border-color 0.3s, transform 0.3s",
                        transform: hovMain === i ? "translateY(-3px)" : "none",
                        position: "relative",
                      }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: hovMain === i ? `linear-gradient(90deg,${GOLD},${GOLD_BRIGHT})` : `${GOLD}28`, transition: "background 0.3s" }} />
                        {/* Image */}
                        {imgUrl && (
                          <div style={{ width: "200px", flexShrink: 0 }}>
                            <img src={imgUrl} alt={post.attributes.Titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        {/* Content */}
                        <div style={{ padding: "1.5rem", flex: 1 }}>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.6rem" }}>
                            {formatDateTime(post.attributes.publishedAt)}
                          </p>
                          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 400, color: hovMain === i ? GOLD_BRIGHT : "#f5e8b8", letterSpacing: "0.02em", marginBottom: "0.75rem", lineHeight: 1.3, transition: "color 0.3s" }}>
                            {post.attributes.Titulo}
                          </h2>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.76rem", color: `${GOLD_BRIGHT}40`, lineHeight: 1.7, marginBottom: "1rem" }}>
                            <span dangerouslySetInnerHTML={{ __html: (post.attributes.descricao ?? "").substring(0, 180) }} />
                          </p>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD, borderBottom: `1px solid ${GOLD}55`, paddingBottom: "2px" }}>
                            Ler mais →
                          </span>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>

              {/* Sidebar */}
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1.25rem" }}>
                  ✦ &nbsp; Outras Notícias
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {allPosts.slice(2, 6).map((post: any, i: number) => (
                    <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}
                      onMouseEnter={() => setHovSide(i)} onMouseLeave={() => setHovSide(null)}>
                      <article style={{
                        padding: "1rem 0",
                        borderBottom: `1px solid ${GOLD}15`,
                        transition: "padding-left 0.25s",
                        paddingLeft: hovSide === i ? "10px" : "0",
                      }}>
                        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: `${GOLD}55`, marginBottom: "0.4rem" }}>
                          {formatDateTime(post.attributes.publishedAt)}
                        </p>
                        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", fontWeight: 400, color: hovSide === i ? GOLD_BRIGHT : "#f0dfa0cc", letterSpacing: "0.02em", lineHeight: 1.35, marginBottom: "0.3rem", transition: "color 0.25s" }}>
                          {post.attributes.Titulo}
                        </h4>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", color: `${GOLD}66`, letterSpacing: "0.1em" }}>Ler mais →</span>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Remaining paginated posts ── */}
          {paginated.length > 0 && (
            <>
              <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}30, transparent)`, margin: "0 0 2.5rem" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
                {paginated.map((post: any) => {
                  const imgUrl = getStrapiMedia(post.attributes.capa?.data?.attributes?.url)
                  return (
                    <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                      <article style={{
                        background: DARK_CARD,
                        border: `1px solid ${GOLD}18`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        transition: "border-color 0.3s, transform 0.3s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}55`; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}18`; (e.currentTarget as HTMLElement).style.transform = "none" }}
                      >
                        {imgUrl && <img src={imgUrl} alt={post.attributes.Titulo} style={{ width: "100%", height: "160px", objectFit: "cover" }} />}
                        <div style={{ padding: "1.25rem" }}>
                          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${GOLD}55`, marginBottom: "0.5rem" }}>
                            {formatDateTime(post.attributes.publishedAt)}
                          </p>
                          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 400, color: "#f0dfa0cc", letterSpacing: "0.02em", lineHeight: 1.35, marginBottom: "0.5rem" }}>
                            {post.attributes.Titulo}
                          </h3>
                          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", color: `${GOLD}77`, letterSpacing: "0.12em" }}>Ler mais →</span>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      onMouseEnter={() => setHovPage(String(p))}
                      onMouseLeave={() => setHovPage(null)}
                      style={{
                        width: "36px", height: "36px",
                        borderRadius: "50%",
                        border: p === currentPage ? `1px solid ${GOLD}` : `1px solid ${GOLD}28`,
                        background: p === currentPage ? GOLD : hovPage === String(p) ? `${GOLD}15` : "transparent",
                        color: p === currentPage ? "#0f0a02" : `${GOLD}88`,
                        fontFamily: "'DM Sans',sans-serif",
                        fontSize: "0.72rem",
                        cursor: "pointer",
                        transition: "background 0.25s, border-color 0.25s, color 0.25s",
                        fontWeight: p === currentPage ? 600 : 400,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default PostList

export async function getServerSideProps() {
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/noticias?sort[0]=publishedAt:desc&populate[0]=noticias&populate[1]=capa`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, posts, menus] = results.map((r) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", (r as PromiseRejectedResult).reason)
      return null
    })

    return { props: { social: parseNavbar(menus, "redes-social"), contato: contato ?? null, posts: posts ?? null, navbar: parseNavbar(menus, "menus") } }
  } catch (error) {
    console.error("Error fetching posts data:", error)
    return { props: { social: [], contato: null, posts: null, navbar: [] } }
  }
}
