import { getStrapiURL, apiClient } from "./api"

export { getStrapiURL }

export function getStrapiMedia(url: string | null) {
  if (url == null) return null
  if (url.startsWith("data:")) return url
  if (url.startsWith("http") || url.startsWith("//")) return url
  return `${getStrapiURL()}${url}`
}

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}-${month}-${year}`
}

export async function verificarEmail(email: string): Promise<unknown | null> {
  try {
    const response = await fetch(`/api/validate-email?email=${encodeURIComponent(email)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.data ?? null
  } catch (error) {
    console.error("Erro na verificação de email:", error)
    return null
  }
}

export async function getAvaliacaos(inscricaoId: number, userId: number) {
  try {
    const data = await apiClient.get(
      `/api/avaliacaos?populate[user_id][fields]=id&populate[inscricoe][fields]=id&filters[user_id][id][$eq]=${userId}&filters[inscricoe][id][$eq]=${inscricaoId}&pagination[pageSize]=1`
    )

    const avaliacao = data.data?.[0]
    if (!avaliacao) return null

    return {
      sim: true,
      notas: avaliacao.attributes.notas,
      comentario: avaliacao.attributes.comentario,
    }
  } catch (error) {
    console.error("Erro na requisição:", error)
    return null
  }
}
