import qs from "qs"
import { fetcher } from "./api"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// Lista de números de edição existentes, do mais recente para o mais antigo.
// Usado para montar o seletor de edição e decidir o padrão (a mais recente).
export async function getEdicoesDisponiveis(): Promise<number[]> {
  try {
    const query = qs.stringify(
      { fields: ["N_Edicao"], sort: ["N_Edicao:desc"], pagination: { pageSize: 100 } },
      { encodeValuesOnly: true }
    )
    const res = await fetcher(`${api_link}/api/edicoes?${query}`)
    return (res?.data ?? [])
      .map((e: any) => e.attributes?.N_Edicao)
      .filter((n: any) => n !== undefined && n !== null)
  } catch {
    return []
  }
}

// Resolve qual edição mostrar: a pedida por ?edicao=N se existir na lista,
// senão a mais recente (primeira, já que `disponiveis` vem ordenada desc).
export function resolveEdicaoSelecionada(
  queryEdicao: unknown,
  disponiveis: number[]
): number | null {
  const requested = Number(queryEdicao)
  if (requested && disponiveis.includes(requested)) return requested
  return disponiveis[0] ?? null
}
