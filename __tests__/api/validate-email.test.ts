/**
 * Tests for pages/api/validate-email.ts
 *
 * This route is the server-side proxy that keeps the mails.so API key
 * off the client bundle. It must:
 *   - reject non-GET methods with 405
 *   - reject missing/invalid email query param with 400
 *   - return 500 when MAILS_API_KEY is not configured
 *   - forward the mails.so response on success
 *   - return 500 on network error to mails.so
 */

import { createMocks } from "node-mocks-http"
import handler from "../../pages/api/validate-email"

// ── helpers ───────────────────────────────────────────────────────────────────

function mockMailsOk(body: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as Response)
}

function mockMailsError(status: number) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: jest.fn().mockResolvedValue({ error: "bad" }),
  } as unknown as Response)
}

function mockMailsNetworkError() {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Network error"))
}

afterEach(() => {
  jest.restoreAllMocks()
  delete process.env.MAILS_API_KEY
})

// ── method guard ──────────────────────────────────────────────────────────────

it("returns 405 for POST requests", async () => {
  const { req, res } = createMocks({ method: "POST" })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(405)
})

it("returns 405 for DELETE requests", async () => {
  const { req, res } = createMocks({ method: "DELETE" })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(405)
})

// ── input validation ──────────────────────────────────────────────────────────

it("returns 400 when email query param is missing", async () => {
  const { req, res } = createMocks({ method: "GET", query: {} })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(400)
})

it("returns 400 when email query param is an array (duplicate param)", async () => {
  const { req, res } = createMocks({
    method: "GET",
    query: { email: ["a@b.com", "c@d.com"] },
  })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(400)
})

// ── missing env var ───────────────────────────────────────────────────────────

it("returns 500 when MAILS_API_KEY is not set", async () => {
  delete process.env.MAILS_API_KEY
  const { req, res } = createMocks({ method: "GET", query: { email: "test@example.com" } })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(500)
  expect(res._getJSONData()).toMatchObject({ error: expect.stringContaining("Configuração") })
})

// ── happy path ────────────────────────────────────────────────────────────────

it("returns 200 with mails.so payload on valid email", async () => {
  process.env.MAILS_API_KEY = "test-key"
  mockMailsOk({ result: "valid", score: 100 })

  const { req, res } = createMocks({ method: "GET", query: { email: "valid@example.com" } })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(200)
  expect(res._getJSONData()).toEqual({ result: "valid", score: 100 })
})

it("sends the API key in the x-mails-api-key header", async () => {
  process.env.MAILS_API_KEY = "secret-key-123"
  mockMailsOk({ result: "valid" })

  const { req, res } = createMocks({ method: "GET", query: { email: "a@b.com" } })
  await handler(req as any, res as any)

  expect(global.fetch).toHaveBeenCalledWith(
    expect.stringContaining("a%40b.com"),
    expect.objectContaining({
      headers: expect.objectContaining({ "x-mails-api-key": "secret-key-123" }),
    })
  )
})

// ── upstream errors ───────────────────────────────────────────────────────────

it("forwards mails.so 4xx status as-is", async () => {
  process.env.MAILS_API_KEY = "test-key"
  mockMailsError(422)

  const { req, res } = createMocks({ method: "GET", query: { email: "bad@example.com" } })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(422)
})

it("returns 500 on network error to mails.so", async () => {
  process.env.MAILS_API_KEY = "test-key"
  mockMailsNetworkError()

  const { req, res } = createMocks({ method: "GET", query: { email: "x@y.com" } })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(500)
})
