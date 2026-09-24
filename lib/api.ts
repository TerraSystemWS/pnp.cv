export class ApiError extends Error {
  status: number
  details?: any
  constructor(message: string, status: number, details?: any) {
    super(message)
    this.status = status
    this.details = details
  }
}

export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
}

export async function fetcher(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`
    let details
    try {
      const err = await response.json()
      message = err?.error?.message ?? err?.message ?? message
      details = err?.error?.details
    } catch {}
    throw new ApiError(message, response.status, details)
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

  putWithAuth: (path: string, body: unknown, jwt: string) =>
    fetcher(`${getStrapiURL()}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(body),
    }),

  deleteWithAuth: (path: string, jwt: string) =>
    fetcher(`${getStrapiURL()}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${jwt}` },
    }),
}
