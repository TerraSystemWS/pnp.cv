import Link from "next/link"
import { GOLD, INK, INK_SOFT, BG, CARD, BORDER, FONT } from "../../lib/theme"

// Faixa de etiquetas pra trocar de edição — só aparece quando há mais de
// uma edição cadastrada. `basePath` é a página atual (ex: "/perfil/avaliacao").
// `variant="bleed"` (padrão) é a barra cheia usada sob um hero de página;
// `variant="inline"` é só a fileira de etiquetas, pra usar dentro de um card.
const EdicaoPicker = ({
  edicoes,
  selecionada,
  basePath,
  variant = "bleed",
}: {
  edicoes: number[]
  selecionada: number | null
  basePath: string
  variant?: "bleed" | "inline"
}) => {
  if (!edicoes || edicoes.length <= 1) return null

  const pills = (
    <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
      {edicoes.map((n) => {
        const active = n === selecionada
        return (
          <Link key={n} href={`${basePath}?edicao=${n}`} style={{ textDecoration: "none" }}>
            <span
              style={{
                display: "inline-block",
                flexShrink: 0,
                fontFamily: FONT,
                fontSize: "0.91rem",
                fontWeight: 700,
                padding: "0.55rem 1.1rem",
                borderRadius: "100px",
                border: active ? `1px solid ${GOLD}` : `1px solid ${BORDER}`,
                background: active ? GOLD : CARD,
                color: active ? INK : INK_SOFT,
                whiteSpace: "nowrap",
              }}
            >
              {n}ª Edição
            </span>
          </Link>
        )
      })}
    </div>
  )

  if (variant === "inline") {
    return <div style={{ marginBottom: "1.25rem" }}>{pills}</div>
  }

  return (
    <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: "0 2rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem 0" }}>{pills}</div>
    </div>
  )
}

export default EdicaoPicker
