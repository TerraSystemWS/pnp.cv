import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK_CARD   = "#100d07"

interface Inputs {
  nome_completo: string
  email: string
  sede: string
  nif: number
  telefone: number
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
  onSaved?: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function FichaInscricaoForm({ cid, apiLink, defaults, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<Inputs>({ defaultValues: defaults })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSaveStatus("saving")
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: { nome_completo: data.nome_completo, NIF: data.nif || 0, email: data.email, sede: data.sede, telefone: data.telefone || 0 },
        }),
      })
      if (res.ok) {
        setSaveStatus("saved")
        reset(data)
        onSaved?.()
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    }
  }

  const statusLabel = saveStatus === "saving"
    ? "A guardar…"
    : saveStatus === "error"
    ? "Erro ao guardar"
    : isDirty
    ? "· Alterações não guardadas"
    : saveStatus === "saved"
    ? "✓ Guardado"
    : ""

  const statusColor = saveStatus === "error"
    ? "#e74c3c"
    : isDirty
    ? `${GOLD}99`
    : `${GOLD_BRIGHT}88`

  const fields = [
    { label: "Nome Completo", name: "nome_completo" as const, type: "text", span: 2 },
    { label: "NIF", name: "nif" as const, type: "number", span: 1 },
    { label: "Email", name: "email" as const, type: "email", span: 1 },
    { label: "Sede ou Local de Residência", name: "sede" as const, type: "text", span: 2 },
    { label: "Telefone", name: "telefone" as const, type: "tel", span: 1 },
  ]

  return (
    <div>
      <style>{`
        .pnp-fi-input {
          background: ${DARK_CARD};
          border: 1px solid ${GOLD}28;
          color: rgba(240,216,144,0.82);
          border-radius: 8px;
          padding: 0.72rem 1rem;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .pnp-fi-input:focus { border-color: ${GOLD}66; }
        .pnp-fi-input::placeholder { color: ${GOLD}30; }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {fields.map((f) => (
            <div key={f.name} style={{ gridColumn: `span ${f.span}` }}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
                {f.label}
              </label>
              <input type={f.type} className="pnp-fi-input" {...register(f.name)} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
          {statusLabel && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: statusColor, letterSpacing: "0.04em" }}>
              {statusLabel}
            </span>
          )}
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: "0.68rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: saveStatus === "saving" ? `${GOLD}44` : "#080604",
              background: saveStatus === "saving" ? `${GOLD}33` : `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`,
              border: "none",
              borderRadius: "100px",
              padding: "10px 28px",
              cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
              transition: "opacity 0.2s",
            }}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
