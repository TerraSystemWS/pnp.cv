import { fetcher, ApiError, getStrapiURL, apiClient } from "../../lib/api"

// ── fetch mock helpers ────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response)
}

function mockFetchNetworkError() {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch"))
}

afterEach(() => jest.restoreAllMocks())

// ── fetcher ───────────────────────────────────────────────────────────────────

describe("fetcher", () => {
  it("returns parsed JSON on a 200 response", async () => {
    mockFetch(200, { data: [{ id: 1 }] })
    const result = await fetcher("https://api.pnp.cv/api/menus")
    expect(result).toEqual({ data: [{ id: 1 }] })
  })

  it("throws ApiError with the correct status on a 4xx response", async () => {
    mockFetch(404, { error: { message: "Not Found" } })
    await expect(fetcher("https://api.pnp.cv/api/menus")).rejects.toMatchObject({
      status: 404,
      message: "Not Found",
    })
  })

  it("throws ApiError with the correct status on a 500 response", async () => {
    mockFetch(500, { error: { message: "Internal Server Error" } })
    await expect(fetcher("https://api.pnp.cv/api/inscricoes/999")).rejects.toMatchObject({
      status: 500,
    })
  })

  it("falls back to generic message when error body has no message", async () => {
    mockFetch(503, null) // json() returns null
    await expect(fetcher("https://api.pnp.cv/api/redes-social")).rejects.toMatchObject({
      status: 503,
      message: expect.stringContaining("503"),
    })
  })

  it("propagates network errors (no response at all)", async () => {
    mockFetchNetworkError()
    await expect(fetcher("https://api.pnp.cv/api/menus")).rejects.toThrow("Failed to fetch")
  })

  it("returns an ApiError instance", async () => {
    mockFetch(401, {})
    try {
      await fetcher("https://api.pnp.cv/api/inscricoes")
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
    }
  })
})

// ── getStrapiURL ──────────────────────────────────────────────────────────────

describe("getStrapiURL", () => {
  it("returns the env variable when set", () => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "https://api.pnp.cv"
    expect(getStrapiURL()).toBe("https://api.pnp.cv")
  })

  it("falls back to localhost when env variable is not set", () => {
    delete process.env.NEXT_PUBLIC_STRAPI_URL
    expect(getStrapiURL()).toBe("http://localhost:1337")
  })
})

// ── apiClient ─────────────────────────────────────────────────────────────────

describe("apiClient", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_STRAPI_URL = "https://api.pnp.cv"
  })

  it("apiClient.get calls fetcher with the full URL", async () => {
    mockFetch(200, { data: [] })
    await apiClient.get("/api/menus?populate=deep")
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.pnp.cv/api/menus?populate=deep",
      expect.any(Object)
    )
  })

  it("apiClient.getWithAuth sends Authorization header", async () => {
    mockFetch(200, { data: [] })
    await apiClient.getWithAuth("/api/inscricoes", "my-jwt-token")
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.pnp.cv/api/inscricoes",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-jwt-token",
        }),
      })
    )
  })

  it("apiClient.post sends method POST with JSON body", async () => {
    mockFetch(200, { data: { id: 1 } })
    await apiClient.post("/api/inscricoes", { nome: "Teste" })
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.pnp.cv/api/inscricoes",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ nome: "Teste" }),
      })
    )
  })

  it("apiClient.post includes Authorization header when jwt is provided", async () => {
    mockFetch(201, { data: { id: 2 } })
    await apiClient.post("/api/inscricoes", { nome: "X" }, "jwt-abc")
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer jwt-abc",
        }),
      })
    )
  })
})
