import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { formatDateTime } from "../../lib/utils"
import { getStrapiMedia } from "../../lib/utils"
import { useState } from "react"
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @media(max-width:900px){ .pl-main-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>Notícias &amp; Actualizações</p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.2rem,6vw,3.4rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>Blog</h1>
        <p style={{ fontFamily: FONT, fontSize: "1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>Fique por dentro das últimas novidades do PNP.</p>
      </div>

      <div style={{ background: BG, padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {allPosts.length === 0 && (
            <p style={{ textAlign: "center", fontFamily: FONT, color: INK_SOFT, fontSize: "0.95rem" }}>
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
                        background: CARD,
                        border: hovMain === i ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                        borderRadius: "16px",
                        overflow: "hidden",
                        display: "flex",
                        transition: "border-color 0.25s, transform 0.25s, box-shadow 0.25s",
                        transform: hovMain === i ? "translateY(-3px)" : "none",
                        boxShadow: hovMain === i ? "0 10px 26px rgba(36,31,15,0.08)" : "none",
                      }}>
                        {/* Image */}
                        {imgUrl && (
                          <div style={{ width: "200px", flexShrink: 0 }}>
                            <img src={imgUrl} alt={post.attributes.Titulo} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          </div>
                        )}
                        {/* Content */}
                        <div style={{ padding: "1.5rem", flex: 1 }}>
                          <p style={{ fontFamily: FONT, fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.6rem" }}>
                            {formatDateTime(post.attributes.publishedAt)}
                          </p>
                          <h2 style={{ fontFamily: FONT, fontSize: "1.25rem", fontWeight: 700, color: hovMain === i ? GOLD_DARK : INK, marginBottom: "0.75rem", lineHeight: 1.3, transition: "color 0.25s" }}>
                            {post.attributes.Titulo}
                          </h2>
                          <p style={{ fontFamily: FONT, fontSize: "0.88rem", color: INK_SOFT, lineHeight: 1.6, marginBottom: "1rem" }}>
                            <span dangerouslySetInnerHTML={{ __html: (post.attributes.descricao ?? "").substring(0, 180) }} />
                          </p>
                          <span style={{ fontFamily: FONT, fontSize: "0.8rem", fontWeight: 700, color: GOLD_DARK, borderBottom: `1px solid ${GOLD}`, paddingBottom: "2px" }}>
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
                <p style={{ fontFamily: FONT, fontSize: "0.78rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1.25rem" }}>
                  Outras Notícias
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  {allPosts.slice(2, 6).map((post: any, i: number) => (
                    <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}
                      onMouseEnter={() => setHovSide(i)} onMouseLeave={() => setHovSide(null)}>
                      <article style={{
                        padding: "1rem 0",
                        borderBottom: `1px solid ${BORDER}`,
                        transition: "padding-left 0.2s",
                        paddingLeft: hovSide === i ? "8px" : "0",
                      }}>
                        <p style={{ fontFamily: FONT, fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, color: INK_SOFT, marginBottom: "0.4rem" }}>
                          {formatDateTime(post.attributes.publishedAt)}
                        </p>
                        <h4 style={{ fontFamily: FONT, fontSize: "0.98rem", fontWeight: 700, color: hovSide === i ? GOLD_DARK : INK, lineHeight: 1.35, marginBottom: "0.3rem", transition: "color 0.2s" }}>
                          {post.attributes.Titulo}
                        </h4>
                        <span style={{ fontFamily: FONT, fontSize: "0.78rem", fontWeight: 600, color: GOLD_DARK }}>Ler mais →</span>
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
              <div style={{ height: "1px", background: BORDER, margin: "0 0 2.5rem" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
                {paginated.map((post: any) => {
                  const imgUrl = getStrapiMedia(post.attributes.capa?.data?.attributes?.url)
                  return (
                    <Link key={post.id} href={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                      <article style={{
                        background: CARD,
                        border: `1px solid ${BORDER}`,
                        borderRadius: "14px",
                        overflow: "hidden",
                        transition: "border-color 0.25s, transform 0.25s",
                      }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = GOLD; (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)" }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.transform = "none" }}
                      >
                        {imgUrl && <img src={imgUrl} alt={post.attributes.Titulo} style={{ width: "100%", height: "160px", objectFit: "cover" }} />}
                        <div style={{ padding: "1.25rem" }}>
                          <p style={{ fontFamily: FONT, fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 600, color: INK_SOFT, marginBottom: "0.5rem" }}>
                            {formatDateTime(post.attributes.publishedAt)}
                          </p>
                          <h3 style={{ fontFamily: FONT, fontSize: "1.05rem", fontWeight: 700, color: INK, lineHeight: 1.35, marginBottom: "0.5rem" }}>
                            {post.attributes.Titulo}
                          </h3>
                          <span style={{ fontFamily: FONT, fontSize: "0.78rem", fontWeight: 600, color: GOLD_DARK }}>Ler mais →</span>
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
                        border: p === currentPage ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                        background: p === currentPage ? GOLD : hovPage === String(p) ? BG_ALT : "transparent",
                        color: p === currentPage ? "#fff" : INK,
                        fontFamily: FONT,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "background 0.2s, border-color 0.2s, color 0.2s",
                        fontWeight: p === currentPage ? 700 : 500,
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
