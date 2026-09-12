import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { hasJuryAccess } from "../../lib/roles"
import { GOLD, GOLD_DARK, INK, INK_SOFT, CARD, BG_ALT, BORDER, FONT } from "../../lib/theme"

interface UserProfileCardProps {
  user: string
  role?: string | null
}

type AccessLink = {
  href: string
  label: string
}

const UserProfileCard = ({ user, role }: UserProfileCardProps) => {
  const router = useRouter()
  const isActive = (path: string) => router.pathname === path
  const initial = (user || "?").trim().charAt(0).toUpperCase()

  const accessLinks: (AccessLink | null)[] = [
    { href: "/perfil", label: "Perfil" },
    hasJuryAccess(role) ? { href: "/perfil/avaliacao", label: "Avaliar Projetos" } : null,
    hasJuryAccess(role) ? { href: "/perfil/votacaopublicaStatus", label: "Resultado da Votação Pública" } : null,
    hasJuryAccess(role) ? { href: "/perfil/avaliacaoStatus", label: "Resultado da Avaliação dos Jurados" } : null,
  ]
  const filteredLinks = accessLinks.filter((link): link is AccessLink => link !== null)

  return (
    <div className="col-span-4 sm:col-span-3">
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "16px", padding: "2rem 1.5rem", fontFamily: FONT }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "76px", height: "76px", borderRadius: "50%",
            background: GOLD, color: INK,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", fontWeight: 700, marginBottom: "1rem",
            border: `3px solid ${BG_ALT}`, boxShadow: `0 0 0 1px ${BORDER}`,
          }}>
            {initial}
          </div>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 700, color: INK, margin: 0, textAlign: "center" }}>{user}</h1>
        </div>

        <div style={{ height: "1px", background: BORDER, margin: "0 0 1.5rem" }} />

        <p style={{ fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem" }}>
          Links de Acesso
        </p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {filteredLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  style={{
                    display: "block",
                    padding: "0.7rem 0.9rem",
                    borderRadius: "9px",
                    fontSize: "0.87rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    color: active ? INK : INK_SOFT,
                    background: active ? GOLD : "transparent",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = `${GOLD}18` }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent" }}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default UserProfileCard
