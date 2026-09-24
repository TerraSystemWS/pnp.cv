import { useState, useRef, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { IncomingMessage } from "http"
import Swal from "sweetalert2"
import { fetcher, apiClient, ApiError } from "../../lib/api"
import { getTokenFromServerCookie, getTokenFromLocalCookie } from "../../lib/auth"
import { getEstado, ESTADO_LABEL, diasRestantes, formatPrazo, isCategoriaCandidatavel } from "../../lib/inscricaoStatus"
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
}

interface FormHandle {
  validate: () => string[]
  submit: () => void
}

type SaveStatus = "idle" | "saving" | "saved" | "error"

const STEPS = [
  { label: "Concorrente",   desc: "Identificação do concorrente e do responsável" },
  { label: "Peça",          desc: "Categoria, veiculação, meios e descrição" },
  { label: "Equipa",        desc: "Equipa técnica e funções" },
  { label: "Documentos",     desc: "Ficheiros do trabalho" },
]

const Inscrever = ({ social, contato, edicao, navbar, inscricao }: Props) => {
  const { user } = useFetchUser()
  const router = useRouter()
  // Estado (não constante derivada da prop inicial) — cada painel funde aqui
  // o que acabou de gravar, para os dados não "desaparecerem" ao voltar a
  // um passo já visitado (cada passo desmonta/remonta ao trocar de separador).
  const [attrs, setAttrs] = useState(inscricao.data?.attributes)
  const categorias: Categoria[] = (edicao?.data?.[0]?.attributes?.categoria ?? []).filter((c) => isCategoriaCandidatavel(c.titulo))
  const url = attrs?.url ?? ""
  // Depois de submetida (ou aceite pela organização) a candidatura fica só de leitura.
  const readOnly = !!attrs?.publishedAt || !!attrs?.submetida_em
  const estado = getEstado(attrs ?? {})
  const dias = diasRestantes(attrs ?? {})
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const [activeStep, setActiveStep] = useState(0)
  const [existingFiles, setExistingFiles] = useState<FileLink[]>(attrs?.fileLink ?? [])
  const [savedSteps, setSavedSteps] = useState([false, false, false, false])
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [emptyWarning, setEmptyWarning] = useState(false)

  const ref0 = useRef<FormHandle>(null)
  const ref1 = useRef<FormHandle>(null)
  const ref2 = useRef<FormHandle>(null)

  useEffect(() => {
    setSaveStatus("idle")
    setEmptyWarning(false)
  }, [activeStep])

  // Os mesmos requisitos que o servidor exige ao submeter.
  const stepDone = [
    !!(attrs?.nome_completo && attrs?.responsavel),
    !!(attrs?.categoria && attrs?.nome_projeto && attrs?.con_criativo && attrs?.meios_divulgacao?.length),
    !!attrs?.equipa?.length,
    existingFiles.length > 0,
  ]
  const isCurrentStepDone = readOnly || stepDone[activeStep] || savedSteps[activeStep]

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

  // "Concluir": bloqueia a candidatura e o servidor envia o email de confirmação.
  const handleSubmit = async () => {
    const result = await Swal.fire({
      title: "Submeter candidatura?",
      html: "Depois de submeter <b>não poderá alterar</b> a candidatura.<br/>Vamos enviar-lhe um email para confirmar que as informações são verdadeiras e que deseja participar no concurso.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: GOLD,
      cancelButtonColor: "#d33",
      confirmButtonText: "Submeter",
      cancelButtonText: "Voltar",
    })
    if (!result.isConfirmed) return
    const jwt = getTokenFromLocalCookie()
    if (!jwt) return router.push("/inscricao")

    setSubmitting(true)
    try {
      const res = await apiClient.post(`/api/inscricoes/mine/${url}/submeter`, {}, jwt)
      setAttrs((prev) => ({ ...(prev as any), ...res.data.attributes }))
      Swal.fire({
        icon: "success",
        title: "Candidatura submetida",
        text: `Enviámos um email para ${attrs?.email}. Abra-o e confirme a candidatura para concluir o processo.`,
        confirmButtonColor: GOLD,
      })
    } catch (err) {
      const missing: string[] = err instanceof ApiError ? err.details?.missing ?? [] : []
      Swal.fire({
        icon: "error",
        title: "Não foi possível submeter",
        html: missing.length
          ? `Complete primeiro os campos em falta:<br/><b>${missing.join(", ")}</b>`
          : err instanceof ApiError ? err.message : "Tente novamente.",
        confirmButtonColor: GOLD,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    const jwt = getTokenFromLocalCookie()
    if (!jwt) return
    setResending(true)
    try {
      await apiClient.post(`/api/inscricoes/mine/${url}/reenviar`, {}, jwt)
      Swal.fire({ icon: "success", title: "Email reenviado", text: `Verifique a caixa de entrada de ${attrs?.email}.`, confirmButtonColor: GOLD })
    } catch {
      Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível reenviar o email. Tente novamente.", confirmButtonColor: GOLD })
    } finally {
      setResending(false)
    }
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

        {/* Status badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: CARD, border: `1px solid ${estado === "confirmada" || estado === "aceite" ? GOLD : BORDER}`, borderRadius: "100px", padding: "0.6rem 1.25rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          <span style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, color: INK_SOFT }}>
            Nº {inscricao.data?.id}
          </span>
          <span style={{ fontFamily: FONT, fontSize: "0.95rem", fontWeight: 700, color: INK }}>
            {ESTADO_LABEL[estado]}
          </span>
        </div>

        <p style={{ fontFamily: FONT, fontSize: "0.902rem", color: INK_SOFT, marginTop: "0.75rem", animation: "fadeUp 0.9s ease 0.3s both" }}>
          {estado === "aceite"
            ? "A candidatura já foi aceite pela organização e não pode ser alterada."
            : estado === "confirmada"
            ? "A candidatura foi submetida e confirmada. Já não pode ser alterada."
            : estado === "aguarda"
            ? "A candidatura foi submetida e já não pode ser alterada. Falta confirmá-la no email."
            : "Pode voltar a esta candidatura a qualquer momento em \"As minhas candidaturas\"."}
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

      {/* ── Prazo de confirmação (visível em todos os passos) ── */}
      {dias !== null && attrs?.expira_em && (
        <div style={{ background: dias <= 2 ? "#c0392b0d" : `${GOLD}14`, borderBottom: `1px solid ${dias <= 2 ? "#c0392b33" : `${GOLD}55`}` }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0.9rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <p style={{ fontFamily: FONT, fontSize: "0.92rem", color: INK, margin: 0, lineHeight: 1.5 }}>
              <strong style={{ color: dias <= 2 ? "#c0392b" : GOLD_DARK }}>
                {dias === 0 ? "Último dia" : `Faltam ${dias} dia${dias === 1 ? "" : "s"}`}
              </strong>
              {" — "}
              {estado === "aguarda"
                ? <>enviámos um email para <strong>{attrs.email}</strong>. Confirme a candidatura até {formatPrazo(attrs.expira_em)}, caso contrário será eliminada.</>
                : <>conclua a candidatura e confirme-a no email que lhe enviaremos até {formatPrazo(attrs.expira_em)} (fim das candidaturas desta edição), caso contrário será eliminada.</>}
            </p>
            {estado === "aguarda" && (
              <button
                className="nav-btn"
                onClick={handleResend}
                disabled={resending}
                style={{ fontFamily: FONT, fontSize: "0.858rem", fontWeight: 700, color: INK, background: CARD, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "6px 16px", cursor: resending ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}
              >
                {resending ? "A enviar…" : "Reenviar email"}
              </button>
            )}
          </div>
        </div>
      )}

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
              url={url}
              email={attrs?.email ?? ""}
              defaults={{ nome_completo: attrs?.nome_completo, responsavel: attrs?.responsavel, sede: attrs?.sede, nif: attrs?.NIF as any, telefone: attrs?.telefone as any }}
              onSaved={(data) => handleFormSaved(0, data)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 1 && (
            <FichaTecnicaForm
              ref={ref1}
              url={url}
              categorias={categorias}
              defaults={{ categoria: attrs?.categoria, nome_projeto: attrs?.nome_projeto, data_divulgacao: attrs?.data_divulgacao, meios_divulgacao: attrs?.meios_divulgacao ?? [], con_criativo: attrs?.con_criativo }}
              onSaved={(data) => handleFormSaved(1, data)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 2 && (
            <EquipaForm
              ref={ref2}
              url={url}
              defaults={{ equipa: (attrs?.equipa ?? []).map((m) => ({ nome: m.nome, funcao: m.funcao ?? "" })), outras_consideracoes: attrs?.outras_consideracoes }}
              onSaved={(data) => handleFormSaved(2, data)}
              onSaveStatusChange={setSaveStatus}
            />
          )}
          {activeStep === 3 && (
            <FileUploadSection
              url={url}
              apiLink={api_link ?? ""}
              readOnly={readOnly}
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
                {activeStep < 3 && !readOnly && (
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
                    disabled={!isCurrentStepDone && !readOnly}
                    title={!isCurrentStepDone ? "Guarde este passo antes de avançar" : undefined}
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: isCurrentStepDone ? INK : INK_SOFT, background: isCurrentStepDone ? GOLD : BG_ALT, border: isCurrentStepDone ? "none" : `1px solid ${BORDER}`, borderRadius: "100px", padding: "10px 24px", cursor: isCurrentStepDone ? "pointer" : "not-allowed", transition: "opacity 0.2s" }}
                  >
                    Próximo →
                  </button>
                )}
                {activeStep < STEPS.length - 1 && !isCurrentStepDone && !readOnly && (
                  <span style={{ fontFamily: FONT, fontSize: "0.792rem", color: INK_SOFT }}>
                    Guarde para poder avançar
                  </span>
                )}
                {activeStep === STEPS.length - 1 && (
                  <button
                    className="nav-btn-primary"
                    onClick={readOnly ? () => router.push("/inscricao") : handleSubmit}
                    disabled={submitting}
                    style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK, background: GOLD, border: "none", borderRadius: "100px", padding: "10px 24px", cursor: submitting ? "not-allowed" : "pointer", transition: "opacity 0.2s" }}
                  >
                    {readOnly ? "Voltar às candidaturas" : submitting ? "A submeter…" : "Concluir Inscrição"}
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

export async function getServerSideProps({ params, req }: { params: { id: string }; req: IncomingMessage }) {
  const jwt = getTokenFromServerCookie(req)
  // Sem sessão ou inscrição de outra conta → volta à lista (que pede login).
  const toList = { redirect: { destination: "/inscricao", permanent: false } }
  if (!jwt || !/^[0-9a-f-]{36}$/i.test(params.id)) return toList

  const queri = qs.stringify({ sort: ["N_Edicao:desc"] }, { encodeValuesOnly: true })

  try {
    const inscricao = await apiClient.getWithAuth(`/api/inscricoes/mine/${params.id}`, jwt)
    if (!inscricao.data) return toList

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
      },
    }
  } catch (error) {
    console.error("Erro ao buscar inscrição:", error)
    return toList
  }
}
