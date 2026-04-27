export interface NavLink {
  name: string
  link: string
}

/**
 * Converts the raw Strapi menus API response into a flat list of nav links.
 * Safe against null, undefined, empty arrays, and missing nested fields —
 * all of which the live API can return depending on plugin state.
 */
export function parseNavbar(raw: unknown): NavLink[] {
  if (raw == null || typeof raw !== "object") return []
  const data = (raw as Record<string, unknown>).data
  if (!Array.isArray(data)) return []
  return data.flatMap((menu: unknown) => {
    const items = (menu as any)?.attributes?.items?.data
    if (!Array.isArray(items)) return []
    return items.map((item: unknown) => ({
      name: (item as any)?.attributes?.title ?? "",
      link: (item as any)?.attributes?.url ?? "#",
    }))
  })
}
