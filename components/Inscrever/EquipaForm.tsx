import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK_CARD   = "#100d07"

interface Inputs {
  coord_prod: string
  dir_foto: string
  dir_art: string
  realizador: string
  editor: string
  autor_jingle: string
  designer: string
  outras_consideracoes: string
  data_producao: string
  data_divulgacao: string
  data_apresentacao_publica: string
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
  onSaved?: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

const TEAM_FIELDS: { name: keyof Inputs; label: string }[] = [
  { name: "coord_prod",    label: "Coordenador / Produtor" },
  { name: "dir_foto",      label: "Diretor de Fotografia" },
  { name: "dir_art",       label: "Diretor de Arte" },
  { name: "realizador",    label: "Realizador" },
  { name: "editor",        label: "Editor" },
  { name: "autor_jingle",  label: "Autor do Jingle" },
  { name: "designer",      label: "Designer" },
]

const DATE_FIELDS: { name: keyof Inputs; label: string }[] = [
  { name: "data_producao",              label: "Data de Produção" },
  { name: "data_divulgacao",            label: "Data de Divulgação" },
  { name: "data_apresentacao_publica",  label: "Data de Apresentação Pública (se universitário)" },
]

export default function EquipaForm({ cid, apiLink, defaults, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<Inputs>({ defaultValues: defaults })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSaveStatus("saving")
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
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

  const statusLabel = saveStatus === "saving" ? "A guardar…" : saveStatus === "error" ? "Erro ao guardar" : isDirty ? "· Alterações não guardadas" : saveStatus === "saved" ? "✓ Guardado" : ""
  const statusColor = saveStatus === "error" ? "#e74c3c" : isDirty ? `${GOLD}99` : `${GOLD_BRIGHT}88`

  return (
    <div>
      <style>{`
        .pnp-eq-input { background:${DARK_CARD}; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s; }
        .pnp-eq-input:focus { border-color:${GOLD}66; }
        .pnp-eq-input::placeholder { color:${GOLD}30; }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {TEAM_FIELDS.map((f) => (
            <div key={f.name}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
                {f.label}
              </label>
              <input type="text" className="pnp-eq-input" {...register(f.name)} />
            </div>
          ))}

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
              Considerações Adicionais
            </label>
            <textarea rows={3} className="pnp-eq-input" style={{ resize: "vertical" }} {...register("outras_consideracoes")} />
          </div>

          {DATE_FIELDS.map((f) => (
            <div key={f.name}>
              <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
                {f.label}
              </label>
              <input type="date" className="pnp-eq-input" style={{ colorScheme: "dark" }} {...register(f.name)} />
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem" }}>
          {statusLabel && (
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: statusColor }}>{statusLabel}</span>
          )}
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: saveStatus === "saving" ? `${GOLD}44` : "#080604", background: saveStatus === "saving" ? `${GOLD}33` : `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", borderRadius: "100px", padding: "10px 28px", cursor: saveStatus === "saving" ? "not-allowed" : "pointer" }}
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
