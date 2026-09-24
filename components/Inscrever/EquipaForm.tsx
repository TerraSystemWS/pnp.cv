import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { getStrapiURL } from "../../lib/api"
import { getTokenFromLocalCookie } from "../../lib/auth"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BORDER } from "../../lib/theme"

export interface Membro {
  nome: string
  funcao: string
}

interface Inputs {
  equipa: Membro[]
  outras_consideracoes: string
}

interface Props {
  url: string
  defaults: Partial<Inputs>
  onSaved?: (data: Inputs) => void
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

// Sugestões para o campo "Função" — o candidato pode escrever outra.
const FUNCOES = [
  "Direção criativa", "Direção de arte", "Produção", "Realização", "Direção de fotografia",
  "Fotografia", "Design", "Copy / Redação", "Edição", "Sonoplastia", "Autor do jingle",
  "Ilustração", "Motion design", "Estratégia", "Gestão de conta",
]

const emptyMembro = (): Membro => ({ nome: "", funcao: "" })

const EquipaForm = forwardRef<FormHandle, Props>(
  ({ url, defaults, onSaved, onSaveStatusChange }, ref) => {
    const { register, control, handleSubmit, reset, getValues } = useForm<Inputs>({
      defaultValues: {
        equipa: defaults.equipa?.length ? defaults.equipa.map(({ nome, funcao }) => ({ nome, funcao: funcao ?? "" })) : [emptyMembro()],
        outras_consideracoes: defaults.outras_consideracoes ?? "",
      },
    })
    const { fields, append, remove } = useFieldArray({ control, name: "equipa" })
    const [missingTeam, setMissingTeam] = useState(false)

    // Linhas sem nome não contam (nem são gravadas).
    const membrosValidos = (equipa: Membro[]) =>
      equipa.map((m) => ({ nome: m.nome.trim(), funcao: m.funcao.trim() })).filter((m) => m.nome)

    const doSave = handleSubmit(async (raw) => {
      const data = { equipa: membrosValidos(raw.equipa), outras_consideracoes: raw.outras_consideracoes }
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${getStrapiURL()}/api/inscricoes/mine/${url}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getTokenFromLocalCookie()}` },
          body: JSON.stringify({ data }),
        })
        if (res.ok) {
          onSaveStatusChange?.("saved")
          reset({ ...data, equipa: data.equipa.length ? data.equipa : [emptyMembro()] })
          setMissingTeam(false)
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
        const empty = membrosValidos(getValues("equipa")).length === 0 ? ["equipa"] : []
        setMissingTeam(empty.length > 0)
        return empty
      },
      submit: () => {
        setMissingTeam(false)
        doSave()
      },
    }))

    const labelStyle = { display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "0.4rem" } as const

    return (
      <div>
        <style>{`
          .pnp-eq-input { background:${BG}; border:1px solid ${BORDER}; color:${INK}; border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.92rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
          .pnp-eq-input:focus { border-color:${GOLD}; }
          .pnp-eq-input::placeholder { color:${INK_SOFT}88; }
          .pnp-eq-err { border-color:#c0392b !important; background:#c0392b0a !important; }
          .pnp-eq-row { display:grid; grid-template-columns: 1fr 1fr auto; gap:0.75rem; align-items:center; }
          @media (max-width: 600px) { .pnp-eq-row { grid-template-columns: 1fr auto; } .pnp-eq-row .pnp-eq-funcao { grid-column: 1; } }
          .pnp-eq-remove { background:none; border:1px solid ${BORDER}; color:${INK_SOFT}; border-radius:8px; width:40px; height:40px; cursor:pointer; font-size:1.1rem; transition:color 0.2s, border-color 0.2s; }
          .pnp-eq-remove:hover { color:#c0392b; border-color:#c0392b55; }
          .pnp-eq-add { background:none; border:1px dashed ${GOLD}; color:${GOLD_DARK}; border-radius:100px; padding:8px 18px; font-family:'DM Sans',sans-serif; font-size:0.88rem; font-weight:700; cursor:pointer; transition:background 0.2s; }
          .pnp-eq-add:hover { background:${GOLD}14; }
        `}</style>

        <datalist id="pnp-funcoes">
          {FUNCOES.map((f) => <option key={f} value={f} />)}
        </datalist>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ ...labelStyle, display: "flex", gap: "3px", color: missingTeam ? "#c0392b" : INK }}>
              Equipa técnica
              <span style={{ color: missingTeam ? "#c0392b" : GOLD_DARK }}>*</span>
            </label>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: INK_SOFT, margin: "0 0 0.9rem" }}>
              Indique o(s) criador(es) e a equipa envolvida, com a função de cada um (direção criativa, produção, design, copy, etc.).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {fields.map((field, i) => (
                <div key={field.id} className="pnp-eq-row">
                  <input
                    type="text"
                    placeholder="Nome"
                    className={`pnp-eq-input${missingTeam && i === 0 ? " pnp-eq-err" : ""}`}
                    {...register(`equipa.${i}.nome` as const, { onChange: () => setMissingTeam(false) })}
                  />
                  <input
                    type="text"
                    placeholder="Função"
                    list="pnp-funcoes"
                    className="pnp-eq-input pnp-eq-funcao"
                    {...register(`equipa.${i}.funcao` as const)}
                  />
                  <button
                    type="button"
                    className="pnp-eq-remove"
                    aria-label="Remover membro"
                    onClick={() => (fields.length > 1 ? remove(i) : reset({ ...getValues(), equipa: [emptyMembro()] }))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="pnp-eq-add" style={{ marginTop: "0.9rem" }} onClick={() => append(emptyMembro())}>
              + Adicionar membro
            </button>
          </div>

          <div>
            <label style={labelStyle}>Considerações Adicionais</label>
            <textarea rows={3} className="pnp-eq-input" style={{ resize: "vertical" }} {...register("outras_consideracoes")} />
          </div>
        </div>
      </div>
    )
  }
)

EquipaForm.displayName = "EquipaForm"
export default EquipaForm
