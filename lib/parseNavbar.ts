export interface NavLink {
  name: string
  link: string
  target: "_self" | "_blank"
}

/**
 * Parses the Strapi plugin-menus API response and returns the items
 * of the menu identified by `slug`, sorted by `order`.
 * Safe against null, undefined, empty arrays, and missing nested fields.
 */
export function parseNavbar(raw: unknown, slug = "menus"): NavLink[] {
  if (raw == null || typeof raw !== "object") return []
  const data = (raw as Record<string, unknown>).data
  if (!Array.isArray(data)) return []

  const menu = data.find((m: any) => m?.attributes?.slug === slug)
  if (!menu) return []

  const items = (menu as any)?.attributes?.items?.data
  if (!Array.isArray(items)) return []

  return [...items]
    .sort((a: any, b: any) => (a?.attributes?.order ?? 0) - (b?.attributes?.order ?? 0))
    .map((item: any) => ({
      name: item?.attributes?.title ?? "",
      link: item?.attributes?.url ?? "#",
      target: item?.attributes?.target === "_blank" ? "_blank" : "_self",
    }))
}
