import { useState, useRef, useEffect } from "react"
import Head from "next/head"
import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import { useFetchUser } from "../../lib/authContext"
import FichaInscricaoForm from "../../components/Inscrever/FichaInscricaoForm"
import FichaTecnicaForm from "../../components/Inscrever/FichaTecnicaForm"
import EquipaForm from "../../components/Inscrever/EquipaForm"
import FileUploadSection from "../../components/Inscrever/FileUploadSection"
import { Inscricao, ParsedNavLink, FileLink, Categoria } from "../../types/strapi"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

interface Props {
  social: any
  contato: any
  edicao: { data: { attributes: { categoria: Categoria[] } }[] }
  navbar: ParsedNavLink[]
  inscricao: { data: { id: number; attributes: Inscricao & { fileLink?: FileLink[] } } | null }
  accessCode: string
}

interface FormHandle {
  validate: () => string[]
  submit: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

const STEPS = [
  { label: "Dados Pessoais", desc: "Nome, email e contacto" },
  { label: "Ficha Técnica",  desc: "Projeto e conceito" },
  { label: "Equipa",         desc: "Colaboradores e datas" },
  { label: "Documentos",     desc: "Ficheiros do trabalho" },
]

const Inscrever = ({ social, contato, edicao, navbar, inscricao, accessCode }: Props) => {
  const { user } = useFetchUser()
  const attrs = inscricao.data?.attributes
  const categorias: Categoria[] = edicao?.data?.[0]?.attributes?.categoria ?? []
  const cid = String(inscricao.data?.id ?? "")

  const [activeStep, setActiveStep] = useState(0)
  const [existingFiles, setExistingFiles] = useState<FileLink[]>(attrs?.fileLink ?? [])
  const [savedSteps, setSavedSteps] = useState([false, false, false, false])
  const [copied, setCopied] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [emptyWarning, setEmptyWarning] = useState(false)

  const ref0 = useRef<FormHandle>(null)
  const ref1 = useRef<FormHandle>(null)
  const ref2 = useRef<FormHandle>(null)

  useEffect(() => {
    setSaveStatus("idle")
    setEmptyWarning(false)
  }, [activeStep])

  const stepDone = [
    !!attrs?.nome_completo,
    !!(attrs?.categoria && attrs?.nome_projeto),
    !!attrs?.coord_prod,
    existingFiles.length > 0,
  ]

  const markSaved = (step: number) =>
    setSavedSteps((prev) => { const next = [...prev]; next[step] = true; return next })

  const currentRef = (): React.RefObject<FormHandle> | null => {
    if (activeStep === 0) return ref0
    if (activeStep === 1) return ref1
    if (activeStep === 2) return ref2
    return null
  }

  const handleSave = () => {
    const ref = currentRef()
    if (!ref?.current) return
    const empty = ref.current.validate()
    if (empty.length > 0) {
      setEmptyWarning(true)
      return
    }
    setEmptyWarning(false)
    ref.current.submit()
  }

  const handleForceSave = () => {
    const ref = currentRef()
    if (!ref?.current) return
    setEmptyWarning(false)
    ref.current.submit()
  }

  const copyCode = () => {
    navigator.clipboard.writeText(accessCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const saveLabel  = saveStatus === "saving" ? "A guardar…" : saveStatus === "saved" ? "✓ Guardado" : saveStatus === "error" ? "Erro ao guardar" : ""
  const saveLabelColor = saveStatus === "error" ? "#e74c3c" : `${GOLD_BRIGHT}88`

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição — Prémio Nacional De Publicidade</title>
        <meta name="description" content="Gerir a sua inscrição no Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .step-btn { transition: color 0.2s, border-color 0.2s, background 0.2s; cursor: pointer; }
        .step-btn:hover .step-label { color: ${GOLD} !important; }
        .nav-btn { transition: background 0.2s, color 0.2s, border-color 0.2s; }
        .nav-btn:hover { background: ${GOLD}22 !important; color: ${GOLD} !important; border-color: ${GOLD}55 !important; }
        .nav-btn-primary:hover { opacity: 0.85 !important; }
        .save-btn:hover:not(:disabled) { opacity: 0.85 !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${GOLD}0a 0%, transparent 70%)` }} />

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.06em", margin: "0 0 1.5rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          A sua Inscrição
        </h1>

        {/* Code badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: `${GOLD}12`, border: `1px solid ${GOLD}33`, borderRadius: "100px", padding: "0.6rem 1.25rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}77` }}>
            Código de acesso
          </span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, color: GOLD_BRIGHT, letterSpacing: "0.12em" }}>
            {accessCode}
          </span>
          <button
            onClick={copyCode}
            style={{ background: "none", border: `1px solid ${GOLD}33`, borderRadius: "100px", padding: "3px 12px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: copied ? GOLD_BRIGHT : `${GOLD}88`, transition: "color 0.2s" }}
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: `${GOLD}44`, marginTop: "0.75rem", animation: "fadeUp 0.9s ease 0.3s both" }}>
          Guarde este código — precisará dele para voltar à sua inscrição.
        </p>

        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.5rem auto 0" }} />
      </div>

      {/* ── Stepper ── */}
      <div style={{ background: DARK_MID, borderBottom: `1px solid ${GOLD}18`, position: "sticky", top: "68px", zIndex: 20 }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 2rem", display: "flex" }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep === i
            const isDone   = stepDone[i] || savedSteps[i]
            return (
              <button
                key={i}
                className="step-btn"
                onClick={() => setActiveStep(i)}
                style={{ flex: 1, background: "none", border: "none", padding: "1rem 0.5rem", borderBottom: isActive ? `2px solid ${GOLD}` : "2px solid transparent", textAlign: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", width: "24px", height: "24px", borderRadius: "50%", background: isActive ? GOLD : isDone ? `${GOLD}33` : `${GOLD}12`, border: `1px solid ${isActive ? GOLD : isDone ? GOLD + "55" : GOLD + "28"}`, fontSize: "0.65rem", color: isActive ? DARK : isDone ? GOLD : `${GOLD}44`, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                  {isDone && !isActive ? "✓" : i + 1}
                </div>
                <p className="step-label" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, color: isActive ? GOLD : `${GOLD}55`, transition: "color 0.2s" }}>
                  {step.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, minHeight: "60vh", padding: "3rem 2rem 5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {/* Step header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", color: `${GOLD}55`, margin: "0 0 0.3rem" }}>
              Passo {activeStep + 1} de {STEPS.length}
            </p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 300, color: GOLD_BRIGHT, letterSpacing: "0.04em", margin: "0 0 0.3rem" }}>
              {STEPS[activeStep].label}
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD}55`, margin: 0 }}>
              {STEPS[activeStep].desc}
            </p>
          </div>

          {/* Step content */}
          {activeStep === 0 && (
            <FichaInscricaoForm
              ref={ref0}
              cid={cid}
              apiLink={api_link ?? ""}
              defaults={{ nome_completo: attrs?.nome_completo, email: attrs?.email, sede: attrs?.sede, nif: attrs?.NIF as any, telefone: attrs?.telefone as any }}
              onSaved={() => markSaved(0)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 1 && (
            <FichaTecnicaForm
              ref={ref1}
              cid={cid}
              apiLink={api_link ?? ""}
              categorias={categorias}
              defaults={{ categoria: attrs?.categoria, nome_projeto: attrs?.nome_projeto, con_criativo: attrs?.con_criativo }}
              onSaved={() => markSaved(1)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 2 && (
            <EquipaForm
              ref={ref2}
              cid={cid}
              apiLink={api_link ?? ""}
              defaults={{ coord_prod: attrs?.coord_prod, dir_foto: attrs?.dir_foto, dir_art: attrs?.dir_art, realizador: attrs?.realizador, editor: attrs?.editor, autor_jingle: attrs?.autor_jingle, designer: attrs?.designer, outras_consideracoes: attrs?.outras_consideracoes, data_producao: attrs?.data_producao, data_divulgacao: attrs?.data_divulgacao, data_apresentacao_publica: attrs?.data_apresentacao_publica }}
              onSaved={() => markSaved(2)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 3 && (
            <FileUploadSection
              cid={cid}
              apiLink={api_link ?? ""}
              existingFiles={existingFiles}
              onFilesUpdated={(files) => { setExistingFiles(files); markSaved(3) }}
            />
          )}

          {/* Navigation */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${GOLD}18` }}>

            {/* Empty fields warning */}
            {emptyWarning && (
              <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.25rem", background: "#e74c3c0a", border: "1px solid #e74c3c33", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "#e74c3ccc" }}>
                  ⚠ Campos obrigatórios por preencher — estão marcados a vermelho.
                </span>
                <button
                  onClick={handleForceSave}
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#e74c3c", background: "none", border: "1px solid #e74c3c55", borderRadius: "100px", padding: "6px 16px", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}
                >
                  Guardar mesmo assim
                </button>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Back */}
              <div>
                {activeStep > 0 && (
                  <button
                    className="nav-btn"
                    onClick={() => setActiveStep((s) => s - 1)}
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}77`, background: "none", border: `1px solid ${GOLD}28`, borderRadius: "100px", padding: "9px 22px", cursor: "pointer" }}
                  >
                    ← Anterior
                  </button>
                )}
              </div>

              {/* Save */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {saveLabel && (
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: saveLabelColor }}>
                    {saveLabel}
                  </span>
                )}
                {activeStep < 3 && (
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: saveStatus === "saving" ? `${GOLD}44` : DARK, background: saveStatus === "saving" ? `${GOLD}33` : `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", borderRadius: "100px", padding: "10px 28px", cursor: saveStatus === "saving" ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}
                  >
                    Guardar
                  </button>
                )}
              </div>

              {/* Next */}
              <div>
                {activeStep < STEPS.length - 1 && (
                  <button
                    className="nav-btn-primary"
                    onClick={() => setActiveStep((s) => s + 1)}
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: DARK, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", borderRadius: "100px", padding: "10px 24px", cursor: "pointer" }}
                  >
                    Próximo →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Inscrever

export async function getServerSideProps({ query }: { query: Record<string, string> }) {
  const { cid, cd } = query

  if (!cid || isNaN(Number(cid))) return { notFound: true }

  const queri = qs.stringify({ sort: ["N_Edicao:desc"] }, { encodeValuesOnly: true })

  try {
    const inscricao = await fetcher(`${api_link}/api/inscricoes/${cid}?populate=deep`)
    if (!inscricao.data) return { notFound: true }

    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?populate=deep&${queri}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, edicao, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: {
        social:     parseNavbar(menus, "redes-social"),
        contato:    contato ?? null,
        edicao:     edicao ?? null,
        navbar:     parseNavbar(menus, "menus"),
        inscricao,
        accessCode: cd ?? "",
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return { notFound: true }
  }
}
