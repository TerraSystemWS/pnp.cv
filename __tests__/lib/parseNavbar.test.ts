import { parseNavbar } from "../../lib/parseNavbar"

// Helper to build the shape the Strapi menus API returns
function makeMenu(items: { title: string; url: string }[]) {
  return {
    attributes: {
      items: {
        data: items.map((i) => ({
          attributes: { title: i.title, url: i.url },
        })),
      },
    },
  }
}

describe("parseNavbar", () => {
  // ── crash-reproduction cases ────────────────────────────────────────────────
  // Each of these caused the production crash before the fix. They must all
  // return [] and never throw.

  it("returns [] for null (API completely down)", () => {
    expect(parseNavbar(null)).toEqual([])
  })

  it("returns [] for undefined", () => {
    expect(parseNavbar(undefined)).toEqual([])
  })

  it("returns [] when data is null — Strapi { data: null }", () => {
    // Strapi sometimes returns { data: null } for empty single-type endpoints
    expect(parseNavbar({ data: null })).toEqual([])
  })

  it("returns [] when data is missing entirely", () => {
    expect(parseNavbar({})).toEqual([])
  })

  it("returns [] when data is a non-array scalar", () => {
    expect(parseNavbar({ data: "unexpected string" })).toEqual([])
    expect(parseNavbar({ data: 42 })).toEqual([])
  })

  it("returns [] for a non-object primitive", () => {
    expect(parseNavbar("bad")).toEqual([])
    expect(parseNavbar(0)).toEqual([])
    expect(parseNavbar(false)).toEqual([])
  })

  // ── current live API response ───────────────────────────────────────────────
  // GET https://api.pnp.cv/api/menus?populate=deep returns { data: [], meta: {...} }

  it("returns [] for empty data array — current live API state", () => {
    const liveResponse = {
      data: [],
      meta: { page: 1, pageSize: 25, pageCount: 0, total: 0 },
    }
    expect(parseNavbar(liveResponse)).toEqual([])
  })

  // ── happy-path cases ────────────────────────────────────────────────────────

  it("parses a single menu with multiple items", () => {
    const raw = {
      data: [makeMenu([
        { title: "Início", url: "/" },
        { title: "Projectos", url: "/projectos" },
        { title: "Contacto", url: "/contacto" },
      ])],
    }
    expect(parseNavbar(raw)).toEqual([
      { name: "Início", link: "/" },
      { name: "Projectos", link: "/projectos" },
      { name: "Contacto", link: "/contacto" },
    ])
  })

  it("flattens items from multiple menus", () => {
    const raw = {
      data: [
        makeMenu([{ title: "Home", url: "/" }]),
        makeMenu([{ title: "Blog", url: "/blog" }]),
      ],
    }
    expect(parseNavbar(raw)).toEqual([
      { name: "Home", link: "/" },
      { name: "Blog", link: "/blog" },
    ])
  })

  it("uses empty string for missing title and # for missing url", () => {
    const raw = {
      data: [{ attributes: { items: { data: [{ attributes: {} }] } } }],
    }
    expect(parseNavbar(raw)).toEqual([{ name: "", link: "#" }])
  })

  it("skips menu entries where items.data is missing or non-array", () => {
    const raw = {
      data: [
        { attributes: { items: null } },
        { attributes: {} },
        null,
        makeMenu([{ title: "OK", url: "/ok" }]),
      ],
    }
    expect(parseNavbar(raw)).toEqual([{ name: "OK", link: "/ok" }])
  })
})
