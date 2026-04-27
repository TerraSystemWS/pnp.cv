export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
}

export async function fetcher(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    try {
      const err = await response.json()
      message = err?.error?.message ?? err?.message ?? message
    } catch {}
    throw new ApiError(message, response.status)
  }

  return response.json()
}

export const apiClient = {
  get: (path: string, options: RequestInit = {}) =>
    fetcher(`${getStrapiURL()}${path}`, options),

  getWithAuth: (path: string, jwt: string, options: RequestInit = {}) =>
    fetcher(`${getStrapiURL()}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
        ...(options.headers ?? {}),
      },
    }),

  post: (path: string, body: unknown, jwt?: string, options: RequestInit = {}) =>
    fetcher(`${getStrapiURL()}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: JSON.stringify(body),
      ...options,
    }),
}
