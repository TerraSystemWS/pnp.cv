import { useState, useRef, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import { useFetchUser } from "../../lib/authContext"
import FichaInscricaoForm from "../../components/Inscrever/FichaInscricaoForm"
import FichaTecnicaForm from "../../components/Inscrever/FichaTecnicaForm"
import EquipaForm from "../../components/Inscrever/EquipaForm"
import FileUploadSection from "../../components/Inscrever/FileUploadSection"
import { Inscricao, ParsedNavLink, FileLink, Categoria } from "../../types/strapi"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
  const router = useRouter()
  // Estado (não constante derivada da prop inicial) — cada painel funde aqui
  // o que acabou de gravar, para os dados não "desaparecerem" ao voltar a
  // um passo já visitado (cada passo desmonta/remonta ao trocar de separador).
  const [attrs, setAttrs] = useState(inscricao.data?.attributes)
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
  const isCurrentStepDone = stepDone[activeStep] || savedSteps[activeStep]

  const markSaved = (step: number) =>
    setSavedSteps((prev) => { const next = [...prev]; next[step] = true; return next })

  // Funde os dados que acabaram de ser gravados no estado local, para
  // ficarem visíveis mesmo depois de sair e voltar a este passo.
  const handleFormSaved = (step: number, data: any) => {
    setAttrs((prev) => ({ ...(prev as any), ...data }))
    markSaved(step)
  }

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
  const saveLabelColor = saveStatus === "error" ? "#c0392b" : GOLD_DARK

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição — Prémio Nacional De Publicidade</title>
        <meta name="description" content="Gerir a sua inscrição no Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        .step-btn { transition: color 0.2s, border-color 0.2s, background 0.2s; cursor: pointer; }
        .step-btn:hover .step-label { color: ${GOLD_DARK} !important; }
        .nav-btn { transition: background 0.2s, color 0.2s, border-color 0.2s; }
        .nav-btn:hover { background: ${GOLD}14 !important; color: ${GOLD_DARK} !important; border-color: ${GOLD} !important; }
        .nav-btn-primary:hover:not(:disabled) { opacity: 0.85 !important; }
        .save-btn:hover:not(:disabled) { opacity: 0.85 !important; }

        .pnp-reminder { display: block; }
        @media (max-width: 1180px) { .pnp-reminder { display: none; } }
      `}</style>

      {/* ── Lembrete fixo (só ecrãs largos) ── */}
      <div
        className="pnp-reminder"
        style={{
          position: "fixed",
          right: "1.5rem",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 30,
          width: "220px",
          background: CARD,
          border: `1px solid ${GOLD}55`,
          borderRadius: "12px",
          padding: "1.1rem 1.2rem",
          boxShadow: "0 8px 24px rgba(36,31,15,0.12)",
        }}
      >
        <p style={{ fontFamily: FONT, fontSize: "0.792rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: GOLD_DARK, margin: "0 0 0.5rem" }}>
          ⚠ Lembrete
        </p>
        <p style={{ fontFamily: FONT, fontSize: "0.858rem", color: INK_SOFT, margin: 0, lineHeight: 1.5 }}>
          Guarde cada passo antes de mudar de separador — os dados não são gravados automaticamente.
        </p>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "2.5rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(1.98rem,4.5vw,3.08rem)", fontWeight: 700, color: INK, margin: "0 0 1.5rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          A sua Inscrição
        </h1>

        {/* Code badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: CARD, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "0.6rem 1.25rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          <span style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, color: INK_SOFT }}>
            Código de acesso
          </span>
          <span style={{ fontFamily: FONT, fontSize: "1.1rem", fontWeight: 700, color: INK, letterSpacing: "0.04em" }}>
            {accessCode}
          </span>
          <button
            onClick={copyCode}
            style={{ background: "none", border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "3px 12px", cursor: "pointer", fontFamily: FONT, fontSize: "0.825rem", fontWeight: 700, color: copied ? GOLD_DARK : INK_SOFT, transition: "color 0.2s" }}
          >
            {copied ? "✓ Copiado" : "Copiar"}
          </button>
        </div>

        <p style={{ fontFamily: FONT, fontSize: "0.902rem", color: INK_SOFT, marginTop: "0.75rem", animation: "fadeUp 0.9s ease 0.3s both" }}>
          Guarde este código — precisará dele para voltar à sua inscrição.
        </p>
      </div>

      {/* ── Stepper ── */}
      <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, position: "sticky", top: "68px", zIndex: 20 }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 2rem", display: "flex" }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep === i
            const isDone   = stepDone[i] || savedSteps[i]
            return (
              <button
                key={i}
                className="step-btn"
                onClick={() => setActiveStep(i)}
                style={{ flex: 1, background: "none", border: "none", padding: "1rem 0.5rem", borderBottom: isActive ? `3px solid ${GOLD}` : "3px solid transparent", textAlign: "center" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.4rem", width: "24px", height: "24px", borderRadius: "50%", background: isActive ? GOLD : isDone ? `${GOLD}22` : BG_ALT, border: `1px solid ${isActive ? GOLD : isDone ? GOLD : BORDER}`, fontSize: "0.792rem", color: isActive ? "#fff" : isDone ? GOLD_DARK : INK_SOFT, fontFamily: FONT, fontWeight: 700 }}>
                  {isDone && !isActive ? "✓" : i + 1}
                </div>
                <p className="step-label" style={{ fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, margin: 0, color: isActive ? INK : INK_SOFT, transition: "color 0.2s" }}>
                  {step.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, minHeight: "60vh", padding: "3rem 2rem 5rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>

          {/* Step header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: INK_SOFT, margin: "0 0 0.3rem" }}>
              Passo {activeStep + 1} de {STEPS.length}
            </p>
            <h2 style={{ fontFamily: FONT, fontSize: "1.54rem", fontWeight: 700, color: INK, margin: "0 0 0.3rem" }}>
              {STEPS[activeStep].label}
            </h2>
            <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK_SOFT, margin: 0 }}>
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
              onSaved={(data) => handleFormSaved(0, data)}
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
              onSaved={(data) => handleFormSaved(1, data)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 2 && (
            <EquipaForm
              ref={ref2}
              cid={cid}
              apiLink={api_link ?? ""}
              defaults={{ coord_prod: attrs?.coord_prod, dir_foto: attrs?.dir_foto, dir_art: attrs?.dir_art, realizador: attrs?.realizador, editor: attrs?.editor, autor_jingle: attrs?.autor_jingle, designer: attrs?.designer, outras_consideracoes: attrs?.outras_consideracoes, data_producao: attrs?.data_producao, data_divulgacao: attrs?.data_divulgacao, data_apresentacao_publica: attrs?.data_apresentacao_publica }}
              onSaved={(data) => handleFormSaved(2, data)}
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
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: `1px solid ${BORDER}` }}>

            {/* Empty fields warning */}
            {emptyWarning && (
              <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.25rem", background: "#c0392b0a", border: "1px solid #c0392b33", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                <span style={{ fontFamily: FONT, fontSize: "0.935rem", color: "#c0392b" }}>
                  ⚠ Campos obrigatórios por preencher — estão marcados a vermelho.
                </span>
                <button
                  onClick={handleForceSave}
                  style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, color: "#c0392b", background: "none", border: "1px solid #c0392b55", borderRadius: "100px", padding: "6px 16px", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" }}
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
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK, background: "none", border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "9px 22px", cursor: "pointer" }}
                  >
                    ← Anterior
                  </button>
                )}
              </div>

              {/* Save */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {saveLabel && (
                  <span style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: saveLabelColor }}>
                    {saveLabel}
                  </span>
                )}
                {activeStep < 3 && (
                  <button
                    className="save-btn"
                    onClick={handleSave}
                    disabled={saveStatus === "saving"}
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: saveStatus === "saving" ? INK_SOFT : INK, background: saveStatus === "saving" ? BG_ALT : GOLD, border: saveStatus === "saving" ? `1px solid ${BORDER}` : "none", borderRadius: "100px", padding: "10px 28px", cursor: saveStatus === "saving" ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}
                  >
                    Guardar
                  </button>
                )}
              </div>

              {/* Next / Concluir */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.4rem" }}>
                {activeStep < STEPS.length - 1 && (
                  <button
                    className="nav-btn-primary"
                    onClick={() => setActiveStep((s) => s + 1)}
                    disabled={!isCurrentStepDone}
                    title={!isCurrentStepDone ? "Guarde este passo antes de avançar" : undefined}
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: isCurrentStepDone ? INK : INK_SOFT, background: isCurrentStepDone ? GOLD : BG_ALT, border: isCurrentStepDone ? "none" : `1px solid ${BORDER}`, borderRadius: "100px", padding: "10px 24px", cursor: isCurrentStepDone ? "pointer" : "not-allowed", transition: "opacity 0.2s" }}
                  >
                    Próximo →
                  </button>
                )}
                {activeStep < STEPS.length - 1 && !isCurrentStepDone && (
                  <span style={{ fontFamily: FONT, fontSize: "0.792rem", color: INK_SOFT }}>
                    Guarde para poder avançar
                  </span>
                )}
                {activeStep === STEPS.length - 1 && (
                  <button
                    className="nav-btn-primary"
                    onClick={() => router.push("/perfil")}
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK, background: GOLD, border: "none", borderRadius: "100px", padding: "10px 24px", cursor: "pointer" }}
                  >
                    Concluir Inscrição
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
