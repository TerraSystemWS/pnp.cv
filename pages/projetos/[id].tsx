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
import { Accordion, AccordionTab } from "primereact/accordion"
import { Button } from "primereact/button"
import { Image } from "primereact/image"
import "primereact/resources/themes/lara-dark-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import JSConfetti from "js-confetti"
import Votacao from "../../components/Votacao"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

const SectionPanel = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "3rem" }}>
    <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1.75rem", paddingBottom: "1rem", borderBottom: `1px solid ${GOLD}18` }}>
      <div style={{ width: "3px", height: "1.25rem", marginTop: "3px", background: `linear-gradient(180deg, ${GOLD}, ${GOLD_BRIGHT})`, borderRadius: "2px", flexShrink: 0 }} />
      <div>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 300, color: GOLD_BRIGHT, letterSpacing: "0.04em", margin: 0 }}>
          {title}
        </h3>
        {subtitle && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: `${GOLD}55`, margin: "0.25rem 0 0", letterSpacing: "0.06em" }}>
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
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}55`, margin: "0 0 0.3rem" }}>
        {label}
      </p>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: `${GOLD_BRIGHT}cc`, margin: 0, lineHeight: 1.6 }}>
        {value}
      </p>
    </div>
  )
}

const VpublicaDetalhes = ({ edicoes, social, contato, inscricao, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const [cor, setCor] = useState("currentColor")
  const [isBlock, setBlock] = useState(false)
  const [nhaId, setNhaId] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    getIdFromLocalCookie()?.then((id) => setNhaId(id ?? null))
  }, [])

  if (!inscricao?.data) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <div style={{ background: DARK, minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", color: `${GOLD}44`, fontSize: "0.9rem" }}>
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
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* PrimeReact Accordion overrides */
        .p-accordion .p-accordion-header .p-accordion-header-link {
          background: ${DARK_CARD} !important;
          border: 1px solid ${GOLD}22 !important;
          color: ${GOLD_BRIGHT}cc !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.82rem !important;
          letter-spacing: 0.06em !important;
          padding: 0.9rem 1.25rem !important;
          border-radius: 8px !important;
        }
        .p-accordion .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link {
          background: ${GOLD}10 !important;
          border-color: ${GOLD}44 !important;
          color: ${GOLD} !important;
        }
        .p-accordion .p-accordion-header.p-highlight .p-accordion-header-link {
          background: ${GOLD}15 !important;
          border-color: ${GOLD}55 !important;
          color: ${GOLD} !important;
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
        .p-accordion .p-accordion-content {
          background: ${DARK_CARD} !important;
          border: 1px solid ${GOLD}22 !important;
          border-top: none !important;
          color: rgba(240,216,144,0.5) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.84rem !important;
          border-bottom-left-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
        }
        .p-accordion .p-accordion-tab { margin-bottom: 0.6rem; }
        .p-accordion-header-icon { color: ${GOLD}88 !important; }

        .vote-input {
          background: ${DARK_CARD} !important;
          border: 1px solid ${GOLD}30 !important;
          color: rgba(240,216,144,0.8) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.85rem !important;
          border-radius: 8px !important;
          padding: 0.75rem 1rem !important;
          width: 100% !important;
          outline: none !important;
          transition: border-color 0.2s !important;
        }
        .vote-input:focus { border-color: ${GOLD}77 !important; }
        .vote-input::placeholder { color: ${GOLD}33 !important; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ background: DARK, paddingTop: "7rem", paddingBottom: "3.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 60% 40% at 50% 100%, ${GOLD}0a 0%, transparent 70%)` }} />

        <div style={{ animation: "fadeUp 0.5s ease both", marginBottom: "1.5rem" }}>
          <Link href="/projetos" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${GOLD}55`, textDecoration: "none" }}>
            ← Trabalhos Concorrentes
          </Link>
        </div>

        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.32em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "1rem", animation: "fadeUp 0.6s ease 0.05s both" }}>
          ✦ &nbsp; {attr.categoria || "Categoria"}
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2rem,5vw,3.8rem)", fontWeight: 300, color: "#f5e8b8", letterSpacing: "0.05em", margin: "0 auto 0.5rem", maxWidth: "800px", padding: "0 2rem", animation: "fadeUp 0.7s ease 0.1s both" }}>
          {attr.nome_projeto}
        </h1>
        {edicaoNum && (
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: `${GOLD}77`, animation: "fadeUp 0.8s ease 0.2s both" }}>
            Concorrente da {edicaoNum}ª edição
          </p>
        )}
        <div style={{ width: "48px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "1.8rem auto 0" }} />
      </div>

      {/* ── Content ── */}
      <div style={{ background: DARK, padding: "4rem 2rem 6rem" }}>
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
              <div style={{ marginTop: "0.5rem", padding: "1.25rem 1.5rem", background: `${GOLD}08`, border: `1px solid ${GOLD}18`, borderRadius: "10px" }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}55`, margin: "0 0 0.5rem" }}>Conceito Criativo</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: `${GOLD_BRIGHT}aa`, margin: 0, lineHeight: 1.8 }}>{attr.con_criativo}</p>
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
              <Accordion>
                {(attr.fileLink ?? []).filter((v: any) => v.publico === false).map((value: any, index: number) => {
                  const url = `${api_link}${value.ficheiro?.data?.attributes?.url}`
                  const ext = value.titulo?.slice(-4).toLowerCase()
                  return (
                    <AccordionTab key={index} header={value.titulo}>
                      <a href={url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: "0.8rem" }}>[Abrir ficheiro]</a>
                      {ext === ".mp3" && <audio controls style={{ marginTop: "0.75rem", width: "100%" }}><source src={url} type="audio/mpeg" /></audio>}
                      {ext === ".mp4" && <video width="100%" controls style={{ marginTop: "0.75rem", borderRadius: "8px" }}><source src={url} type="video/mp4" /></video>}
                      {[".png", ".jpg", ".jpeg"].includes(ext) && (
                        <div style={{ marginTop: "0.75rem" }}><Image src={url} alt={value.titulo} width="100%" preview /></div>
                      )}
                    </AccordionTab>
                  )
                })}
              </Accordion>
            </SectionPanel>
          )}

          {/* Documentos Públicos */}
          <SectionPanel title="Documentos Públicos">
            <Accordion>
              {(attr.fileLink ?? []).filter((v: any) => v.publico === true).map((value: any, index: number) => {
                const url = `${api_link}${value.ficheiro?.data?.attributes?.url}`
                const ext = url.slice(-4).toLowerCase()
                return (
                  <AccordionTab key={index} header={value.titulo}>
                    <a href={url} target="_blank" rel="noreferrer" style={{ color: GOLD, fontSize: "0.8rem" }}>[Abrir ficheiro]</a>
                    {ext === ".mp3" && <audio controls style={{ marginTop: "0.75rem", width: "100%" }}><source src={url} type="audio/mpeg" /></audio>}
                    {ext === ".mp4" && <video width="100%" controls style={{ marginTop: "0.75rem", borderRadius: "8px" }}><source src={url} type="video/mp4" /></video>}
                    {[".png", ".jpg", ".jpeg"].includes(ext) && (
                      <div style={{ marginTop: "0.75rem" }}><Image src={url} alt={value.titulo} width="100%" preview /></div>
                    )}
                  </AccordionTab>
                )
              })}
            </Accordion>
          </SectionPanel>

          {/* Avaliação do Júri — logged users only */}
          {!loading && user && (
            <SectionPanel title="Avaliação dos Jurados" subtitle="Notas por critério de cada jurado">
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: `${GOLD}66`, marginBottom: "1.25rem" }}>
                Categoria: <strong style={{ color: GOLD }}>{attr.categoria}</strong>
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
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, display: "block", marginBottom: "0.5rem" }}>
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
                <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, display: "block", marginBottom: "0.5rem" }}>
                  Email
                </label>
                <input
                  type="email"
                  className="vote-input"
                  placeholder="exemplo@email.com"
                  {...register("email", { required: true })}
                />
                {errors.email && <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: "#e74c3c" }}>O email é obrigatório.</span>}
              </div>

              <button
                type="submit"
                disabled={isBlock}
                style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: isBlock ? `${GOLD}44` : DARK,
                  background: isBlock ? `${GOLD}22` : `linear-gradient(135deg, ${GOLD}, ${GOLD_BRIGHT})`,
                  border: "none",
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
