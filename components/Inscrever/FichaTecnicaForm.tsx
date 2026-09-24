import { useState, forwardRef, useImperativeHandle } from "react"
import { useForm } from "react-hook-form"
import { getStrapiURL } from "../../lib/api"
import { getTokenFromLocalCookie } from "../../lib/auth"
import { Categoria } from "../../types/strapi"
import { MEIOS_DIVULGACAO, MAX_PALAVRAS_DESCRICAO, contarPalavras } from "../../lib/inscricaoStatus"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BORDER } from "../../lib/theme"

interface Inputs {
  categoria: string
  nome_projeto: string
  data_divulgacao: string
  meios_divulgacao: string[]
  con_criativo: string
}

interface Props {
  url: string
  defaults: Partial<Inputs>
  categorias: Categoria[]
  onSaved?: (data: Inputs) => void
  onSaveStatusChange?: (status: "idle" | "saving" | "saved" | "error") => void
}

export interface FormHandle {
  validate: () => string[]
  submit: () => void
}

const REQUIRED: (keyof Inputs)[] = ["categoria", "nome_projeto", "meios_divulgacao", "con_criativo"]

// Checkboxes do react-hook-form devolvem false/string quando há 0/1 marcados.
const asArray = (v: unknown): string[] => (Array.isArray(v) ? v : typeof v === "string" && v ? [v] : [])

const FichaTecnicaForm = forwardRef<FormHandle, Props>(
  ({ url, defaults, categorias, onSaved, onSaveStatusChange }, ref) => {
    const { register, handleSubmit, reset, getValues, watch } = useForm<Inputs>({
      defaultValues: { ...defaults, meios_divulgacao: defaults.meios_divulgacao ?? [] },
    })
    const palavras = contarPalavras(watch("con_criativo"))
    const [highlighted, setHighlighted] = useState<Set<string>>(new Set())

    const doSave = handleSubmit(async (raw) => {
      const data = { ...raw, meios_divulgacao: asArray(raw.meios_divulgacao), data_divulgacao: raw.data_divulgacao || null } as Inputs
      onSaveStatusChange?.("saving")
      try {
        const res = await fetch(`${getStrapiURL()}/api/inscricoes/mine/${url}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${getTokenFromLocalCookie()}` },
          body: JSON.stringify({
            data: {
              categoria: data.categoria,
              nome_projeto: data.nome_projeto,
              data_divulgacao: data.data_divulgacao,
              meios_divulgacao: data.meios_divulgacao,
              con_criativo: data.con_criativo,
            },
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
        const empty = REQUIRED.filter(f =>
          f === "meios_divulgacao" ? asArray(vals[f]).length === 0 : !String(vals[f] ?? "").trim()
        )
        if (contarPalavras(vals.con_criativo) > MAX_PALAVRAS_DESCRICAO && !empty.includes("con_criativo")) empty.push("con_criativo")
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
          .pnp-ft-input { background:${BG}; border:1px solid ${BORDER}; color:${INK}; border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.92rem; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
          .pnp-ft-input:focus { border-color:${GOLD}; }
          .pnp-ft-input::placeholder { color:${INK_SOFT}88; }
          .pnp-ft-select { appearance:none; background:${BG} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%232f270c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 1rem center; border:1px solid ${BORDER}; color:${INK}; border-radius:8px; padding:0.72rem 1rem; width:100%; font-family:'DM Sans',sans-serif; font-size:0.92rem; outline:none; transition:border-color 0.2s; cursor:pointer; box-sizing:border-box; }
          .pnp-ft-select:focus { border-color:${GOLD}; }
          .pnp-ft-err { border-color:#c0392b !important; background:#c0392b0a !important; }
          .pnp-ft-err:focus { border-color:#c0392b !important; }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Categoria */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: err("categoria") ? "#c0392b" : INK, marginBottom: "0.4rem", transition: "color 0.2s" }}>
              Categoria de Prémio
              <span style={{ color: err("categoria") ? "#c0392b" : GOLD_DARK }}>*</span>
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

          {/* Título da peça */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: err("nome_projeto") ? "#c0392b" : INK, marginBottom: "0.4rem", transition: "color 0.2s" }}>
              Título da peça / campanha
              <span style={{ color: err("nome_projeto") ? "#c0392b" : GOLD_DARK }}>*</span>
            </label>
            <input
              type="text"
              className={`pnp-ft-input${err("nome_projeto") ? " pnp-ft-err" : ""}`}
              placeholder="Título do trabalho a concurso"
              {...register("nome_projeto", { onChange: clearIf("nome_projeto") as any })}
            />
          </div>

          {/* Data de veiculação */}
          <div style={{ maxWidth: "320px" }}>
            <label style={{ display: "block", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "0.4rem" }}>
              Data de veiculação
            </label>
            <input type="date" className="pnp-ft-input" {...register("data_divulgacao")} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: INK_SOFT, margin: "0.35rem 0 0" }}>
              Entre 1 de janeiro e 31 de dezembro dos dois anos anteriores à edição.
            </p>
          </div>

          {/* Meios de divulgação */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: err("meios_divulgacao") ? "#c0392b" : INK, marginBottom: "0.6rem", transition: "color 0.2s" }}>
              Meios de divulgação utilizados
              <span style={{ color: err("meios_divulgacao") ? "#c0392b" : GOLD_DARK }}>*</span>
            </label>
            <div
              className={err("meios_divulgacao") ? "pnp-ft-err" : undefined}
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.5rem 1rem", border: "1px solid transparent", borderRadius: "8px", padding: "0.25rem" }}
            >
              {MEIOS_DIVULGACAO.map((meio) => (
                <label key={meio} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: INK, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    value={meio}
                    style={{ accentColor: GOLD, width: "16px", height: "16px" }}
                    {...register("meios_divulgacao", { onChange: clearIf("meios_divulgacao") as any })}
                  />
                  {meio}
                </label>
              ))}
            </div>
          </div>

          {/* Breve descrição */}
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "3px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: err("con_criativo") ? "#c0392b" : INK, marginBottom: "0.4rem", transition: "color 0.2s" }}>
              Breve descrição
              <span style={{ color: err("con_criativo") ? "#c0392b" : GOLD_DARK }}>*</span>
            </label>
            <textarea
              rows={6}
              className={`pnp-ft-input${err("con_criativo") ? " pnp-ft-err" : ""}`}
              style={{ resize: "vertical" }}
              placeholder="Descreva a peça: conceito, objetivo e público…"
              {...register("con_criativo", { onChange: clearIf("con_criativo") as any })}
            />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", fontWeight: 700, color: palavras > MAX_PALAVRAS_DESCRICAO ? "#c0392b" : INK_SOFT, margin: "0.35rem 0 0", textAlign: "right" }}>
              {palavras} / {MAX_PALAVRAS_DESCRICAO} palavras
            </p>
          </div>
        </div>
      </div>
    )
  }
)

FichaTecnicaForm.displayName = "FichaTecnicaForm"
export default FichaTecnicaForm
