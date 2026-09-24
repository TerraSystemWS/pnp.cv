import { fetcher } from "./api"
import { parseNavbar } from "./parseNavbar"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// Props que o <Layout> precisa (navbar, redes sociais, contacto) — para
// páginas que não buscam mais nada no servidor.
export async function getLayoutProps() {
  const results = await Promise.allSettled([
    fetcher(`${api_link}/api/contato`),
    fetcher(`${api_link}/api/menus?populate=deep`),
  ])
  const [contato, menus] = results.map((r) => {
    if (r.status === "fulfilled") return r.value
    console.error("Endpoint failed:", r.reason)
    return null
  })
  return {
    social: parseNavbar(menus, "redes-social"),
    contato: contato ?? null,
    navbar: parseNavbar(menus, "menus"),
  }
}
