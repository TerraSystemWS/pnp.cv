import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { GOLD, INK, DARK_BG, DARK_BORDER, LIGHT_TEXT, LIGHT_TEXT_SOFT, FONT } from "../../lib/theme"

// Avatar por enquanto é só a inicial do nome — dá pra trocar por foto de
// perfil mais tarde sem mudar quem usa este componente.
const UserMenu = ({ username, onLogout }: { username: string; onLogout: () => void }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initial = username?.trim()?.charAt(0)?.toUpperCase() || "?"

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          background: "transparent",
          border: `1px solid ${DARK_BORDER}`,
          borderRadius: "100px",
          padding: "5px 14px 5px 5px",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: GOLD,
            color: INK,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: "0.78rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {initial}
        </span>
        <span style={{ fontFamily: FONT, fontSize: "0.85rem", fontWeight: 600, color: LIGHT_TEXT }}>
          {username}
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={LIGHT_TEXT_SOFT} strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: "180px",
            background: DARK_BG,
            border: `1px solid ${DARK_BORDER}`,
            borderRadius: "10px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            overflow: "hidden",
            zIndex: 200,
          }}
        >
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            style={{ display: "block", padding: "11px 16px", color: LIGHT_TEXT, textDecoration: "none", fontFamily: FONT, fontSize: "0.85rem", fontWeight: 600 }}
          >
            Meu Perfil
          </Link>
          <button
            onClick={() => { setOpen(false); onLogout() }}
            style={{ display: "block", width: "100%", textAlign: "left", padding: "11px 16px", background: "transparent", border: "none", borderTop: `1px solid ${DARK_BORDER}`, color: LIGHT_TEXT_SOFT, fontFamily: FONT, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}
          >
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
