import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"

const GOLD      = "#c2a12b"
const DARK_CARD = "#100d07"

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
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

const REQUIRED: (keyof Inputs)[] = ["coord_prod"]

const TEAM_FIELDS: { name: keyof Inputs; label: string; required?: boolean }[] = [
  { name: "coord_prod",   label: "Coordenador / Produtor", required: true },
  { name: "dir_foto",     label: "Diretor de Fotografia" },
  { name: "dir_art",      label: "Diretor de Arte" },
  { name: "realizador",   label: "Realizador" },
  { name: "editor",       label: "Editor" },
  { name: "autor_jingle", label: "Autor do Jingle" },
  { name: "designer",     label: "Designer" },
]

const DATE_FIELDS: { name: keyof Inputs; label: string }[] = [
  { name: "data_producao",             label: "Data de Produção" },
  { name: "data_divulgacao",           label: "Data de Divulgação" },
  { name: "data_apresentacao_publica", label: "Data de Apresentação Pública (se universitário)" },
]

const EquipaForm = forwardRef<FormHandle, Props>(
  ({ cid, apiLink, defaults, onSaved, onSaveStatusChange }, ref) => {
    const { register, handleSubmit, reset, getValues } = useForm<Inputs>({ defaultValues: defaults })
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

    const doSave = handleSubmit(async (data) => {
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data }),
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

    const clearIf = (name: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (String(e.target.value).trim()) {
        setHighlighted(prev => { if (!prev.has(name)) return prev; const n = new Set(prev); n.delete(name); return n })
      }
    }

    return (
      <div>
        <style>{`
          .pnp-eq-input { background:${DARK_CARD}; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,background 0.2s; box-sizing:border-box; }
          .pnp-eq-input:focus { border-color:${GOLD}66; }
          .pnp-eq-input::placeholder { color:${GOLD}30; }
          .pnp-eq-err { border-color:#e74c3c88 !important; background:#e74c3c08 !important; }
          .pnp-eq-err:focus { border-color:#e74c3cbb !important; }
        `}</style>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {TEAM_FIELDS.map((f) => (
            <div key={f.name}>
              <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: highlighted.has(f.name) ? "#e74c3ccc" : `${GOLD}66`, marginBottom: "0.4rem", transition: "color 0.2s" }}>
                {f.label}
                {f.required && <span style={{ color: highlighted.has(f.name) ? "#e74c3c" : `${GOLD}44` }}>*</span>}
              </label>
              <input
                type="text"
                className={`pnp-eq-input${highlighted.has(f.name) ? " pnp-eq-err" : ""}`}
                {...register(f.name, { onChange: clearIf(f.name) })}
              />
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
      </div>
    )
  }
)

EquipaForm.displayName = "EquipaForm"
export default EquipaForm
