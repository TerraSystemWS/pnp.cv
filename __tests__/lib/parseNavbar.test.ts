import { parseNavbar } from "../../lib/parseNavbar"

// Helper that builds a menu entry matching the Strapi plugin-menus JSON shape
function makeMenu(
  slug: string,
  items: { title: string; url: string; target?: string; order?: number }[]
) {
  return {
    attributes: {
      slug,
      items: {
        data: items.map((i, idx) => ({
          attributes: {
            title: i.title,
            url: i.url,
            target: i.target ?? "_self",
            order: i.order ?? idx,
          },
        })),
      },
    },
  }
}

// Real API response shape (from api.pnp.cv/api/menus?populate=deep)
const liveApiResponse = {
  data: [
    makeMenu("redes-social", [
      { title: "Facebook", url: "/facebook", target: "_blank", order: 0 },
      { title: "youtube", url: "/youtube", target: "_blank", order: 1 },
    ]),
    makeMenu("menus", [
      { title: "Inicio", url: "/", target: "_self", order: 0 },
      { title: "Edições", url: "/edicoes", target: "_self", order: 1 },
      { title: "Projectos", url: "/projetos", target: "_self", order: 2 },
    ]),
  ],
  meta: { page: 1, pageSize: 25, pageCount: 1, total: 2 },
}

describe("parseNavbar", () => {
  // ── crash-reproduction cases ────────────────────────────────────────────────

  it("returns [] for null", () => {
    expect(parseNavbar(null)).toEqual([])
  })

  it("returns [] for undefined", () => {
    expect(parseNavbar(undefined)).toEqual([])
  })

  it("returns [] when data is null — Strapi { data: null }", () => {
    expect(parseNavbar({ data: null })).toEqual([])
  })

  it("returns [] when data is missing entirely", () => {
    expect(parseNavbar({})).toEqual([])
  })

  it("returns [] when data is a non-array scalar", () => {
    expect(parseNavbar({ data: "unexpected string" })).toEqual([])
  })

  it("returns [] for a non-object primitive", () => {
    expect(parseNavbar("bad")).toEqual([])
    expect(parseNavbar(0)).toEqual([])
  })

  it("returns [] for the empty live API response — { data: [] }", () => {
    expect(parseNavbar({ data: [], meta: {} })).toEqual([])
  })

  // ── slug filtering ────────────────────────────────────────────────────────

  it("returns [] when the requested slug does not exist", () => {
    expect(parseNavbar(liveApiResponse, "nao-existe")).toEqual([])
  })

  it("returns only items from the 'menus' slug", () => {
    const result = parseNavbar(liveApiResponse, "menus")
    expect(result.map((l) => l.name)).toEqual(["Inicio", "Edições", "Projectos"])
  })

  it("returns only items from the 'redes-social' slug", () => {
    const result = parseNavbar(liveApiResponse, "redes-social")
    expect(result.map((l) => l.name)).toEqual(["Facebook", "youtube"])
  })

  it("defaults to slug 'menus' when no slug is provided", () => {
    const result = parseNavbar(liveApiResponse)
    expect(result.map((l) => l.name)).toEqual(["Inicio", "Edições", "Projectos"])
  })

  // ── target field ─────────────────────────────────────────────────────────

  it("sets target _blank for social links", () => {
    const result = parseNavbar(liveApiResponse, "redes-social")
    expect(result.every((l) => l.target === "_blank")).toBe(true)
  })

  it("sets target _self for nav links", () => {
    const result = parseNavbar(liveApiResponse, "menus")
    expect(result.every((l) => l.target === "_self")).toBe(true)
  })

  it("defaults to _self when target is missing", () => {
    const raw = {
      data: [
        {
          attributes: {
            slug: "menus",
            items: { data: [{ attributes: { title: "X", url: "/x" } }] },
          },
        },
      ],
    }
    expect(parseNavbar(raw, "menus")[0].target).toBe("_self")
  })

  // ── order sorting ─────────────────────────────────────────────────────────

  it("sorts items by the order field", () => {
    const raw = {
      data: [
        makeMenu("menus", [
          { title: "C", url: "/c", order: 2 },
          { title: "A", url: "/a", order: 0 },
          { title: "B", url: "/b", order: 1 },
        ]),
      ],
    }
    expect(parseNavbar(raw, "menus").map((l) => l.name)).toEqual(["A", "B", "C"])
  })

  // ── fallbacks ─────────────────────────────────────────────────────────────

  it("uses empty string for missing title and # for missing url", () => {
    const raw = {
      data: [
        {
          attributes: {
            slug: "menus",
            items: { data: [{ attributes: { order: 0 } }] },
          },
        },
      ],
    }
    expect(parseNavbar(raw, "menus")).toEqual([{ name: "", link: "#", target: "_self" }])
  })

  it("returns [] when items.data is null or missing for the matched menu", () => {
    const raw = {
      data: [{ attributes: { slug: "menus", items: null } }],
    }
    expect(parseNavbar(raw, "menus")).toEqual([])
  })
})
