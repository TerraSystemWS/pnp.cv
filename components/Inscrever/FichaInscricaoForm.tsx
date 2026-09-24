import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { getStrapiURL } from "../../lib/api"
import { getTokenFromLocalCookie } from "../../lib/auth"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, BORDER } from "../../lib/theme"

interface Inputs {
  nome_completo: string
  responsavel: string
  sede: string
  nif: number
  telefone: number
}

interface Props {
  url: string
  // Email da conta — não é editável aqui (vem do perfil).
  email: string
  defaults: Partial<Inputs>
  onSaved?: (data: Inputs) => void
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

const REQUIRED: (keyof Inputs)[] = ["nome_completo", "responsavel"]

// Campos da "Identificação do Concorrente" da ficha de inscrição do regulamento.
const FIELDS = [
  { label: "Concorrente (Agência, Produtora, Gráfica, Media, Criativo Independente ou Estudante)", name: "nome_completo" as const, type: "text", span: 2, required: true },
  { label: "NIF (se aplicável)", name: "nif" as const, type: "number", span: 1, required: false },
  { label: "Nome do Responsável pela Inscrição", name: "responsavel" as const, type: "text", span: 2, required: true },
  { label: "Endereço completo", name: "sede" as const, type: "text", span: 2, required: false },
  { label: "Telefone", name: "telefone" as const, type: "tel", span: 1, required: false },
]

const FichaInscricaoForm = forwardRef<FormHandle, Props>(
  ({ url, email, defaults, onSaved, onSaveStatusChange }, ref) => {
    const { register, handleSubmit, reset, getValues } = useForm<Inputs>({ defaultValues: defaults })
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

    const doSave = handleSubmit(async (data) => {
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${getStrapiURL()}/api/inscricoes/mine/${url}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getTokenFromLocalCookie()}` },
          body: JSON.stringify({
            data: { nome_completo: data.nome_completo, responsavel: data.responsavel, NIF: data.nif || null, sede: data.sede, telefone: data.telefone || 0 },
          }),
        })
        if (res.ok) {
          onSaveStatusChange?.("saved")
          reset(data)
          setHighlighted(new Set())
          onSaved?.(data)
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
          .pnp-fi-input { background:${BG}; border:1px solid ${BORDER}; color:${INK}; border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.92rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
          .pnp-fi-input:focus { border-color:${GOLD}; }
          .pnp-fi-input::placeholder { color:${INK_SOFT}88; }
          .pnp-fi-err { border-color:#c0392b !important; background:#c0392b0a !important; }
          .pnp-fi-err:focus { border-color:#c0392b !important; }
        `}</style>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          {FIELDS.map((f, i) => (
            <div key={f.name} style={{ gridColumn: `span ${f.span}`, order: i * 2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: highlighted.has(f.name) ? "#c0392b" : INK, marginBottom: "0.4rem", transition: "color 0.2s" }}>
                {f.label}
                {f.required && <span style={{ color: highlighted.has(f.name) ? "#c0392b" : GOLD_DARK, lineHeight: 1 }}>*</span>}
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
          {/* order 3: logo a seguir ao NIF, como antes */}
          <div style={{ gridColumn: "span 1", order: 3 }}>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "0.4rem" }}>
              Email
            </label>
            <input type="email" className="pnp-fi-input" value={email} readOnly style={{ background: BG_ALT, color: INK_SOFT, cursor: "default" }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: INK_SOFT, margin: "0.35rem 0 0" }}>
              Vem da sua conta — é para este email que enviamos as comunicações.
            </p>
          </div>
        </div>
      </div>
    )
  }
)

FichaInscricaoForm.displayName = "FichaInscricaoForm"
export default FichaInscricaoForm
