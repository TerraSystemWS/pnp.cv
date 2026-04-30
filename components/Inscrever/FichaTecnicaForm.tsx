import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { Categoria } from "../../types/strapi"

const GOLD      = "#c2a12b"
const DARK_CARD = "#100d07"

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
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

const REQUIRED: (keyof Inputs)[] = ["categoria", "nome_projeto"]

const FichaTecnicaForm = forwardRef<FormHandle, Props>(
  ({ cid, apiLink, defaults, categorias, onSaved, onSaveStatusChange }, ref) => {
    const { register, handleSubmit, reset, getValues } = useForm<Inputs>({ defaultValues: defaults })
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

    const doSave = handleSubmit(async (data) => {
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: { categoria: data.categoria, nome_projeto: data.nome_projeto, con_criativo: data.con_criativo } }),
        })
        if (res.ok) {
          onSaveStatusChange?.("saved")
          reset(data)
          setHighlighted(new Set())
          onSaved?.()
        } else {
          onSaveStatusChange?.("error")
        }
      } catch {
        onSaveStatusChange?.("error")
      }
    })

    useImperativeHandle(ref, () => ({
      validate: () => {
        const vals = getValues()
        const empty = REQUIRED.filter(f => !String(vals[f] ?? "").trim())
        setHighlighted(new Set(empty))
        return empty
      },
      submit: () => {
        setHighlighted(new Set())
        doSave()
      },
    }))

    const clearIf = (name: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (String(e.target.value).trim()) {
        setHighlighted(prev => { if (!prev.has(name)) return prev; const n = new Set(prev); n.delete(name); return n })
      }
    }

    const err = (name: string) => highlighted.has(name)

    return (
      <div>
        <style>{`
          .pnp-ft-input { background:${DARK_CARD}; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,background 0.2s; box-sizing:border-box; }
          .pnp-ft-input:focus { border-color:${GOLD}66; }
          .pnp-ft-input::placeholder { color:${GOLD}30; }
          .pnp-ft-select { appearance:none; background:${DARK_CARD} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23c2a12b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 1rem center; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s; cursor:pointer; box-sizing:border-box; }
          .pnp-ft-select:focus { border-color:${GOLD}66; }
          .pnp-ft-select option { background:#100d07; }
          .pnp-ft-err { border-color:#e74c3c88 !important; background:#e74c3c08 !important; }
          .pnp-ft-err:focus { border-color:#e74c3cbb !important; }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Categoria */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: err("categoria") ? "#e74c3ccc" : `${GOLD}66`, marginBottom: "0.4rem", transition: "color 0.2s" }}>
              Categoria de Prémio
              <span style={{ color: err("categoria") ? "#e74c3c" : `${GOLD}44` }}>*</span>
            </label>
            <select
              className={`pnp-ft-select${err("categoria") ? " pnp-ft-err" : ""}`}
              {...register("categoria", { onChange: clearIf("categoria") })}
            >
              <option value="">Escolha uma categoria…</option>
              {categorias.map((cat, i) => (
                <option key={i} value={cat.titulo}>{cat.titulo}</option>
              ))}
            </select>
          </div>

          {/* Nome do Projeto */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: err("nome_projeto") ? "#e74c3ccc" : `${GOLD}66`, marginBottom: "0.4rem", transition: "color 0.2s" }}>
              Nome do Projeto
              <span style={{ color: err("nome_projeto") ? "#e74c3c" : `${GOLD}44` }}>*</span>
            </label>
            <input
              type="text"
              className={`pnp-ft-input${err("nome_projeto") ? " pnp-ft-err" : ""}`}
              placeholder="Título do trabalho a concurso"
              {...register("nome_projeto", { onChange: clearIf("nome_projeto") as any })}
            />
          </div>

          {/* Conceito Criativo */}
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
      </div>
    )
  }
)

FichaTecnicaForm.displayName = "FichaTecnicaForm"
export default FichaTecnicaForm
