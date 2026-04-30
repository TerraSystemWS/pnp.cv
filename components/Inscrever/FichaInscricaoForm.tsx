import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"

const GOLD      = "#c2a12b"
const DARK_CARD = "#100d07"

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
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

const REQUIRED: (keyof Inputs)[] = ["nome_completo", "email"]

const FIELDS = [
  { label: "Nome Completo", name: "nome_completo" as const, type: "text",   span: 2, required: true  },
  { label: "NIF",           name: "nif"           as const, type: "number", span: 1, required: false },
  { label: "Email",         name: "email"         as const, type: "email",  span: 1, required: true  },
  { label: "Sede ou Local de Residência", name: "sede" as const, type: "text", span: 2, required: false },
  { label: "Telefone",      name: "telefone"      as const, type: "tel",    span: 1, required: false },
]

const FichaInscricaoForm = forwardRef<FormHandle, Props>(
  ({ cid, apiLink, defaults, onSaved, onSaveStatusChange }, ref) => {
    const { register, handleSubmit, reset, getValues } = useForm<Inputs>({ defaultValues: defaults })
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

    const doSave = handleSubmit(async (data) => {
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { nome_completo: data.nome_completo, NIF: data.nif || 0, email: data.email, sede: data.sede, telefone: data.telefone || 0 },
          }),
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

    return (
      <div>
        <style>{`
          .pnp-fi-input { background:${DARK_CARD}; border:1px solid ${GOLD}28; color:rgba(240,216,144,0.82); border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.875rem; outline:none; transition:border-color 0.2s,background 0.2s; box-sizing:border-box; }
          .pnp-fi-input:focus { border-color:${GOLD}66; }
          .pnp-fi-input::placeholder { color:${GOLD}30; }
          .pnp-fi-err { border-color:#e74c3c88 !important; background:#e74c3c08 !important; }
          .pnp-fi-err:focus { border-color:#e74c3cbb !important; }
        `}</style>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {FIELDS.map((f) => (
            <div key={f.name} style={{ gridColumn: `span ${f.span}` }}>
              <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: highlighted.has(f.name) ? "#e74c3ccc" : `${GOLD}66`, marginBottom: "0.4rem", transition: "color 0.2s" }}>
                {f.label}
                {f.required && <span style={{ color: highlighted.has(f.name) ? "#e74c3c" : `${GOLD}44`, lineHeight: 1 }}>*</span>}
              </label>
              <input
                type={f.type}
                className={`pnp-fi-input${highlighted.has(f.name) ? " pnp-fi-err" : ""}`}
                {...register(f.name, {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (String(e.target.value).trim()) {
                      setHighlighted(prev => { if (!prev.has(f.name)) return prev; const n = new Set(prev); n.delete(f.name); return n })
                    }
                  },
                })}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

FichaInscricaoForm.displayName = "FichaInscricaoForm"
export default FichaInscricaoForm
