// Estado de uma candidatura do ponto de vista do dono, e contagem do prazo
// para submeter/confirmar (as não confirmadas a tempo são eliminadas).

interface EstadoInput {
  publishedAt?: string | null
  submetida_em?: string | null
  confirmada_em?: string | null
  expira_em?: string | null
}

export type Estado = "preparacao" | "aguarda" | "confirmada" | "aceite"

export const ESTADO_LABEL: Record<Estado, string> = {
  preparacao: "Em preparação",
  aguarda: "Aguarda confirmação",
  confirmada: "Confirmada",
  aceite: "Aceite",
}

export function getEstado(i: EstadoInput): Estado {
  if (i.publishedAt) return "aceite"
  if (i.confirmada_em) return "confirmada"
  if (i.submetida_em) return "aguarda"
  return "preparacao"
}

// Dias que faltam até ao prazo, ou null se não houver prazo (já confirmada,
// ou candidatura anterior a esta regra).
export function diasRestantes(i: EstadoInput): number | null {
  if (i.confirmada_em || i.publishedAt || !i.expira_em) return null
  return Math.max(0, Math.ceil((new Date(i.expira_em).getTime() - Date.now()) / 86400000))
}

export function formatPrazo(expira_em: string) {
  return new Date(expira_em).toLocaleDateString("pt-PT", { day: "numeric", month: "long" })
}
