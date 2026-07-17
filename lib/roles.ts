// Fonte única de verdade para quem tem acesso às áreas de jurado/responsável.
// Evita comparações repetidas (e inconsistentes) espalhadas por várias páginas.
export const JURY_ROLES = ["jurado", "responsavel"]

export const hasJuryAccess = (role?: string | null): boolean =>
  !!role && JURY_ROLES.includes(role.toLowerCase())
