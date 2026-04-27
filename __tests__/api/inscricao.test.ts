/**
 * Tests for pages/api/inscricao.ts
 *
 * This route validates a Cloudflare Turnstile CAPTCHA token and, on success,
 * returns a UUID-based inscription ID. It must:
 *   - reject non-POST methods with 405
 *   - return 500 when CLOUDFLARE_SECRET_KEY is not configured
 *   - return 400 when the CAPTCHA is invalid
 *   - return 200 with a UUID id when the CAPTCHA is valid
 *   - return 500 on network error to Cloudflare
 */

import { createMocks } from "node-mocks-http"
import handler from "../../pages/api/inscricao"

// ── helpers ───────────────────────────────────────────────────────────────────

function mockCaptcha(success: boolean) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: jest.fn().mockResolvedValue({ success }),
  } as unknown as Response)
}

function mockCaptchaNetworkError() {
  global.fetch = jest.fn().mockRejectedValue(new TypeError("Network error"))
}

const validBody = {
  data: {
    ncode: "PNP-TEST",
    turnstileResponse: "mock-captcha-token",
  },
}

afterEach(() => {
  jest.restoreAllMocks()
  delete process.env.CLOUDFLARE_SECRET_KEY
})

// ── method guard ──────────────────────────────────────────────────────────────

it("returns 405 for GET requests", async () => {
  const { req, res } = createMocks({ method: "GET" })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(405)
})

it("returns 405 for PUT requests", async () => {
  const { req, res } = createMocks({ method: "PUT" })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(405)
})

// ── missing env var ───────────────────────────────────────────────────────────

it("returns 500 when CLOUDFLARE_SECRET_KEY is not set", async () => {
  delete process.env.CLOUDFLARE_SECRET_KEY
  const { req, res } = createMocks({ method: "POST", body: validBody })
  await handler(req as any, res as any)
  expect(res._getStatusCode()).toBe(500)
  expect(res._getJSONData()).toMatchObject({
    error: { message: expect.stringContaining("Configuração") },
  })
})

// ── CAPTCHA validation ────────────────────────────────────────────────────────

it("returns 200 with a UUID id when CAPTCHA is valid", async () => {
  process.env.CLOUDFLARE_SECRET_KEY = "test-secret"
  mockCaptcha(true)

  const { req, res } = createMocks({ method: "POST", body: validBody })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(200)
  const body = res._getJSONData()
  expect(body.data.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  )
  expect(body.data.message).toContain("sucesso")
})

it("returns 200 with a different UUID on each call (no collisions)", async () => {
  process.env.CLOUDFLARE_SECRET_KEY = "test-secret"
  mockCaptcha(true)

  const { req: req1, res: res1 } = createMocks({ method: "POST", body: validBody })
  const { req: req2, res: res2 } = createMocks({ method: "POST", body: validBody })
  await handler(req1 as any, res1 as any)
  await handler(req2 as any, res2 as any)

  const id1 = res1._getJSONData().data.id
  const id2 = res2._getJSONData().data.id
  expect(id1).not.toBe(id2)
})

it("returns 400 when CAPTCHA verification fails", async () => {
  process.env.CLOUDFLARE_SECRET_KEY = "test-secret"
  mockCaptcha(false)

  const { req, res } = createMocks({ method: "POST", body: validBody })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(400)
  expect(res._getJSONData()).toMatchObject({
    error: { message: expect.stringContaining("CAPTCHA") },
  })
})

it("sends the CAPTCHA token to Cloudflare's siteverify endpoint", async () => {
  process.env.CLOUDFLARE_SECRET_KEY = "cf-secret"
  mockCaptcha(true)

  const { req, res } = createMocks({ method: "POST", body: validBody })
  await handler(req as any, res as any)

  expect(global.fetch).toHaveBeenCalledWith(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    expect.objectContaining({ method: "POST" })
  )
})

// ── network errors ────────────────────────────────────────────────────────────

it("returns 500 on network error reaching Cloudflare", async () => {
  process.env.CLOUDFLARE_SECRET_KEY = "test-secret"
  mockCaptchaNetworkError()

  const { req, res } = createMocks({ method: "POST", body: validBody })
  await handler(req as any, res as any)

  expect(res._getStatusCode()).toBe(500)
  expect(res._getJSONData()).toMatchObject({
    error: { message: expect.stringContaining("servidor") },
  })
})
