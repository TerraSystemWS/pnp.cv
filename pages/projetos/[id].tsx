import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"
const qs = require("qs")
import { useFetchUser } from "../../lib/authContext"
import { getTokenFromLocalCookie, getIdFromLocalCookie } from "../../lib/auth"
import JSConfetti from "js-confetti"
import Votacao from "../../components/Votacao"
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const SectionPanel = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "3rem" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.75rem", paddingBottom: "1rem", borderBottom: `1px solid ${BORDER}` }}>
      <div style={{ width: "4px", height: "1.25rem", marginTop: "3px", background: GOLD, borderRadius: "2px", flexShrink: 0 }} />
      <div>
        <h3 style={{ fontFamily: FONT, fontSize: "1.265rem", fontWeight: 700, color: INK, margin: 0 }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontFamily: FONT, fontSize: "0.935rem", color: INK_SOFT, margin: "0.25rem 0 0" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
)

const Field = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, margin: "0 0 0.3rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: FONT, fontSize: "1.045rem", color: INK, margin: 0, lineHeight: 1.6 }}>
        {value}
      </p>
    </div>
  )
}

type FileItem = { titulo: string; url: string; ext: string }

// Acordeão nativo (substitui o PrimeReact Accordion) — só um item aberto de
// cada vez, igual ao comportamento padrão do componente anterior.
const FileAccordion = ({ items, onPreview }: { items: FileItem[]; onPreview: (image: { url: string; title: string }) => void }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, index) => {
        const open = openIndex === index
        return (
          <div key={index} style={{ marginBottom: "0.6rem" }}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                background: open ? `${GOLD}14` : CARD,
                border: `1px solid ${open ? GOLD : BORDER}`,
                color: open ? GOLD_DARK : INK,
                fontFamily: FONT,
                fontSize: "0.9rem",
                fontWeight: 600,
                padding: "0.9rem 1.25rem",
                borderRadius: open ? "8px 8px 0 0" : "8px",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span>{item.titulo}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {open && (
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "1rem 1.25rem", color: INK_SOFT, fontFamily: FONT, fontSize: "0.9rem" }}>
                <a href={item.url} target="_blank" rel="noreferrer" style={{ color: GOLD_DARK, fontSize: "0.968rem", fontWeight: 700 }}>[Abrir ficheiro]</a>
                {item.ext === ".mp3" && <audio controls style={{ marginTop: "0.75rem", width: "100%" }}><source src={item.url} type="audio/mpeg" /></audio>}
                {item.ext === ".mp4" && <video width="100%" controls style={{ marginTop: "0.75rem", borderRadius: "8px" }}><source src={item.url} type="video/mp4" /></video>}
                {[".png", ".jpg", ".jpeg"].includes(item.ext) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.titulo}
                    onClick={() => onPreview({ url: item.url, title: item.titulo })}
                    style={{ marginTop: "0.75rem", width: "100%", borderRadius: "8px", cursor: "zoom-in" }}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Lightbox nativo (substitui o preview de imagem do PrimeReact).
const ImageLightbox = ({ image, onClose }: { image: { url: string; title: string } | null; onClose: () => void }) => {
  useEffect(() => {
    if (!image) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [image, onClose])

  if (!image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" }}
    >
      <button
        onClick={onClose}
        aria-label="Fechar"
        style={{ position: "fixed", top: "1.5rem", right: "1.5rem", background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "6px" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.title}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", cursor: "default" }}
      />
    </div>
  )
}

const VpublicaDetalhes = ({ edicoes, social, contato, inscricao, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const [cor, setCor] = useState("currentColor")
  const [isBlock, setBlock] = useState(false)
  const [nhaId, setNhaId] = useState<string | null>(null)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    getIdFromLocalCookie()?.then((id) => setNhaId(id ?? null))
  }, [])

  if (!inscricao?.data) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div style={{ background: BG, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: FONT, color: INK_SOFT, fontSize: "1.045rem" }}>
            Projeto não encontrado.
          </p>
        </div>
      </Layout>
    )
  }

  const attr = inscricao.data.attributes
  const edicaoNum = edicoes?.data?.[0]?.attributes?.N_Edicao

  const onVotar = async (data: any) => {
    const jsConfetti = new JSConfetti()
    try {
      const res = await fetcher(`${api_link}/api/votacao-publicas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            nome_completo: data.nome,
            email: data.email,
            inscricoe: inscricao.data.id,
          },
        }),
      })
      if (res.data) {
        setCor("red")
        setBlock(true)
        jsConfetti.addConfetti({ emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"], emojiSize: 10, confettiNumber: 500 })
        Swal.fire({ icon: "success", title: "Voto registado!", text: "" })
      } else {
        Swal.fire({ icon: "warning", title: "Aviso", text: "Só pode votar uma única vez." })
      }
    } catch {
      Swal.fire({ icon: "error", title: "Falhou", text: "Não foi possível votar." })
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>{attr.nome_projeto} - Prémio Nacional De Publicidade</title>
        <meta name="description" content={attr.con_criativo || "Projecto concorrente ao PNP"} />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .vote-input {
          background: ${BG} !important;
          border: 1px solid ${BORDER} !important;
          color: ${INK} !important;
          font-family: ${FONT} !important;
          font-size: 0.92rem !important;
          border-radius: 8px !important;
          padding: 0.75rem 1rem !important;
          width: 100% !important;
          outline: none !important;
          transition: border-color 0.2s !important;
          box-sizing: border-box !important;
        }
        .vote-input:focus { border-color: ${GOLD} !important; }
        .vote-input::placeholder { color: ${INK_SOFT}88 !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ animation: "fadeUp 0.5s ease both", marginBottom: "1.25rem" }}>
          <Link href="/projetos" style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK_SOFT, textDecoration: "none" }}>
            ← Trabalhos Concorrentes
          </Link>
        </div>

        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease 0.05s both" }}>
          {attr.categoria || "Categoria"}
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(1.98rem,4.5vw,3.3rem)", fontWeight: 700, color: INK, margin: "0 auto 0.5rem", maxWidth: "800px", padding: "0 2rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          {attr.nome_projeto}
        </h1>
        {edicaoNum && (
          <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK_SOFT, animation: "fadeUp 0.8s ease 0.2s both" }}>
            Concorrente da {edicaoNum}ª edição
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ background: BG, padding: "4rem 2rem 6rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Ficha de Inscrição — logged users only */}
          {!loading && user && (
            <SectionPanel title="Ficha de Inscrição" subtitle="Dados do participante">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0 2rem" }}>
                <Field label="Nome Completo" value={attr.nome_completo} />
                <Field label="NIF" value={attr.NIF} />
                <Field label="Email" value={attr.email} />
                <Field label="Sede / Residência" value={attr.sede} />
                <Field label="Telefone" value={attr.telefone} />
              </div>
            </SectionPanel>
          )}

          {/* Ficha Técnica — always visible */}
          <SectionPanel title="Ficha Técnica" subtitle="Categoria e conceito criativo">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0 2rem" }}>
              <Field label="Categoria" value={attr.categoria} />
              <Field label="Nome do Projeto" value={attr.nome_projeto} />
            </div>
            {attr.con_criativo && (
              <div style={{ marginTop: "0.5rem", padding: "1.25rem 1.5rem", background: BG_ALT, border: `1px solid ${BORDER}`, borderRadius: "10px" }}>
                <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, margin: "0 0 0.5rem" }}>Conceito Criativo</p>
                <p style={{ fontFamily: FONT, fontSize: "1.045rem", color: INK, margin: 0, lineHeight: 1.7 }}>{attr.con_criativo}</p>
              </div>
            )}
          </SectionPanel>

          {/* Equipa — logged users only */}
          {!loading && user && (
            <SectionPanel title="Equipa do Projeto" subtitle="Colaboradores e datas">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "0 2rem" }}>
                <Field label="Coordenador / Produtor"     value={attr.coord_prod} />
                <Field label="Diretor de Fotografia"       value={attr.dir_foto} />
                <Field label="Diretor de Arte"             value={attr.dir_art} />
                <Field label="Realizador"                  value={attr.realizador} />
                <Field label="Editor"                      value={attr.editor} />
                <Field label="Autoria do Jingle"           value={attr.autor_jingle} />
                <Field label="Designer"                    value={attr.designer} />
                <Field label="Data de Produção"            value={attr.data_producao} />
                <Field label="Data de Divulgação"          value={attr.data_divulgacao} />
                <Field label="Data de Apresentação Pública" value={attr.data_apresentacao_publica} />
              </div>
              {attr.outras_consideracoes && (
                <Field label="Outras Considerações" value={attr.outras_consideracoes} />
              )}
            </SectionPanel>
          )}

          {/* Documentos Privados — logged users only */}
          {!loading && user && (
            <SectionPanel title="Documentos Privados">
              <FileAccordion
                onPreview={setLightboxImage}
                items={(attr.fileLink ?? [])
                  .filter((v: any) => v.publico === false)
                  .map((value: any) => ({
                    titulo: value.titulo,
                    url: `${api_link}${value.ficheiro?.data?.attributes?.url}`,
                    ext: value.titulo?.slice(-4).toLowerCase(),
                  }))}
              />
            </SectionPanel>
          )}

          {/* Documentos Públicos */}
          <SectionPanel title="Documentos Públicos">
            <FileAccordion
              onPreview={setLightboxImage}
              items={(attr.fileLink ?? [])
                .filter((v: any) => v.publico === true)
                .map((value: any) => {
                  const url = `${api_link}${value.ficheiro?.data?.attributes?.url}`
                  return { titulo: value.titulo, url, ext: url.slice(-4).toLowerCase() }
                })}
            />
          </SectionPanel>

          {/* Avaliação do Júri — logged users only */}
          {!loading && user && (
            <SectionPanel title="Avaliação dos Jurados" subtitle="Notas por critério de cada jurado">
              <p style={{ fontFamily: FONT, fontSize: "0.968rem", color: INK_SOFT, marginBottom: "1.25rem" }}>
                Categoria: <strong style={{ color: INK, fontWeight: 700 }}>{attr.categoria}</strong>
              </p>
              <Votacao
                edicaoId={edicoes?.data?.[0]?.id}
                inscricaoId={inscricao.data.id}
                userId={nhaId}
              />
            </SectionPanel>
          )}

          {/* Votação Pública */}
          <SectionPanel title="Votação Pública" subtitle="Dê o seu voto a este trabalho">
            <form onSubmit={handleSubmit(onVotar)} style={{ maxWidth: "480px" }}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, color: INK, display: "block", marginBottom: "0.5rem" }}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="vote-input"
                  placeholder="Seu nome"
                  {...register("nome", { required: true })}
                />
              </div>
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, color: INK, display: "block", marginBottom: "0.5rem" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="vote-input"
                  placeholder="exemplo@email.com"
                  {...register("email", { required: true })}
                />
                {errors.email && <span style={{ fontFamily: FONT, fontSize: "0.88rem", color: "#c0392b" }}>O email é obrigatório.</span>}
              </div>

              <button
                type="submit"
                disabled={isBlock}
                style={{
                  fontFamily: FONT,
                  fontSize: "0.935rem",
                  fontWeight: 700,
                  color: isBlock ? INK_SOFT : INK,
                  background: isBlock ? BG_ALT : GOLD,
                  border: isBlock ? `1px solid ${BORDER}` : "none",
                  borderRadius: "100px",
                  padding: "12px 32px",
                  cursor: isBlock ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "opacity 0.2s",
                }}
              >
                <svg width="16" height="16" fill={cor} viewBox="0 0 20 20">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                {isBlock ? "Voto registado" : "Votar"}
              </button>
            </form>
          </SectionPanel>

        </div>
      </div>

      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
    </Layout>
  )
}

export default VpublicaDetalhes

export async function getServerSideProps({ query }: any) {
  const { id } = query

  const queri = qs.stringify({ sort: ["N_Edicao:desc"] }, { encodeValuesOnly: true })

  const results = await Promise.allSettled([
    fetcher(`${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&${queri}`),
    fetcher(`${api_link}/api/contato`),
    fetcher(`${api_link}/api/menus?populate=deep`),
    fetcher(`${api_link}/api/inscricoes/${id}?populate[fileLink][populate][ficheiro][fields]=url`),
  ])
  const [edicoes, contato, menus, inscritos] = results.map((r: any) => {
    if (r.status === "fulfilled") return r.value
    console.error("Endpoint failed:", r.reason)
    return null
  })

  return {
    props: {
      edicoes:    edicoes ?? null,
      social:     parseNavbar(menus, "redes-social"),
      contato:    contato ?? null,
      navbar:     parseNavbar(menus, "menus"),
      inscricao:  inscritos ?? null,
    },
  }
}
