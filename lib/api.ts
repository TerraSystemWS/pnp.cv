export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
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
