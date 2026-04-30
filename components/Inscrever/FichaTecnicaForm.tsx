import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Categoria } from "../../types/strapi"

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK_CARD   = "#100d07"

interface Inputs {
  categoria: string
  nome_projeto: string
  con_criativo: string
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
  categorias: Categoria[]
  onSaved?: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

export default function FichaTecnicaForm({ cid, apiLink, defaults, categorias, onSaved }: Props) {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<Inputs>({ defaultValues: defaults })
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSaveStatus("saving")
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { categoria: data.categoria, nome_projeto: data.nome_projeto, con_criativo: data.con_criativo } }),
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

  const inputStyle = { background: DARK_CARD, border: `1px solid ${GOLD}28`, color: "rgba(240,216,144,0.82)" as const, borderRadius: "8px", padding: "0.72rem 1rem", width: "100%", fontFamily: "'DM Sans',sans-serif", fontSize: "0.875rem", outline: "none" }

  return (
    <div>
      <style>{`
        .pnp-ft-input { background:${DARK_CARD}; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s; }
        .pnp-ft-input:focus { border-color:${GOLD}66; }
        .pnp-ft-input::placeholder { color:${GOLD}30; }
        .pnp-ft-select { appearance:none; background:${DARK_CARD} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c2a12b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 1rem center; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s; cursor:pointer; }
        .pnp-ft-select:focus { border-color:${GOLD}66; }
        .pnp-ft-select option { background:#100d07; }
      `}</style>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
              Categoria de Prémio
            </label>
            <select className="pnp-ft-select" {...register("categoria")}>
              <option value="">Escolha uma categoria…</option>
              {categorias.map((cat, i) => (
                <option key={i} value={cat.titulo}>{cat.titulo}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
              Nome do Projeto
            </label>
            <input type="text" className="pnp-ft-input" placeholder="Título do trabalho a concurso" {...register("nome_projeto")} />
          </div>

          <div>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.4rem" }}>
              Conceito Criativo
            </label>
            <textarea
              rows={5}
              className="pnp-ft-input"
              style={{ resize: "vertical" }}
              placeholder="Descreva o conceito criativo do seu trabalho…"
              {...register("con_criativo")}
            />
          </div>
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
