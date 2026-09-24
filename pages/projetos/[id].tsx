import Layout from "../../components/Layout"
import { fetcher, apiClient, ApiError } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
const qs = require("qs")
import { useFetchUser } from "../../lib/authContext"
import { getTokenFromLocalCookie, getIdFromLocalCookie, openLogin } from "../../lib/auth"
import { hasJuryAccess } from "../../lib/roles"
import JSConfetti from "js-confetti"
import Votacao from "../../components/Votacao"
import ImageLightbox from "../../components/custom/ImageLightbox"
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

const VpublicaDetalhes = ({ edicoes, social, contato, inscricao, navbar }: any) => {
  const { user, role, loading } = useFetchUser()
  const isJury = hasJuryAccess(role)
  const [nhaId, setNhaId] = useState<string | null>(null)
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null)
  // Voto do utilizador: null = ainda a carregar / sem sessão.
  const [meuVoto, setMeuVoto] = useState<{ voted: boolean; inscricaoId: number | null } | null>(null)
  const [voting, setVoting] = useState(false)
  // Só júri: dados de contacto e documentos privados, pedidos com o token
  // (não vêm na resposta pública do servidor).
  const [ficha, setFicha] = useState<any>(null)
  const [privateFiles, setPrivateFiles] = useState<any[]>([])

  useEffect(() => {
    getIdFromLocalCookie()?.then((id) => setNhaId(id ?? null))
  }, [])

  useEffect(() => {
    const jwt = getTokenFromLocalCookie()
    if (loading || !user || !jwt) return
    apiClient
      .getWithAuth("/api/votacao-publicas/me", jwt)
      .then((res: any) => setMeuVoto(res.data))
      .catch((err: unknown) => console.error("Erro ao verificar voto:", err))
  }, [user, loading])

  const inscricaoId = inscricao?.data?.id
  useEffect(() => {
    const jwt = getTokenFromLocalCookie()
    if (!isJury || !jwt || !inscricaoId) return
    apiClient
      .getWithAuth(`/api/inscricoes/${inscricaoId}/ficha`, jwt)
      .then((res: any) => setFicha(res.data))
      .catch((err: unknown) => console.error("Erro ao carregar ficha:", err))
    apiClient
      .getWithAuth(`/api/inscricoes/${inscricaoId}?populate[fileLink][populate][ficheiro][fields]=url`, jwt)
      .then((res: any) => setPrivateFiles((res.data?.attributes?.fileLink ?? []).filter((f: any) => f.publico === false)))
      .catch((err: unknown) => console.error("Erro ao carregar documentos privados:", err))
  }, [isJury, inscricaoId])

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

  const onVotar = async () => {
    const jwt = getTokenFromLocalCookie()
    if (!jwt) return openLogin()
    setVoting(true)
    try {
      await apiClient.post("/api/votacao-publicas/votar", { inscricaoId: inscricao.data.id }, jwt)
      setMeuVoto({ voted: true, inscricaoId: inscricao.data.id })
      new JSConfetti().addConfetti({ emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"], emojiSize: 10, confettiNumber: 500 })
      Swal.fire({ icon: "success", title: "Voto registado!", text: "" })
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setMeuVoto((prev) => ({ voted: true, inscricaoId: prev?.inscricaoId ?? null }))
        Swal.fire({ icon: "warning", title: "Aviso", text: "Só pode votar uma única vez." })
      } else if (err instanceof ApiError && err.status === 403) {
        Swal.fire({ icon: "warning", title: "Aviso", text: "Confirme o seu email antes de votar." })
      } else {
        Swal.fire({ icon: "error", title: "Falhou", text: "Não foi possível votar." })
      }
    } finally {
      setVoting(false)
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

          {/* Ficha de Inscrição — só júri */}
          {!loading && isJury && (
            <SectionPanel title="Ficha de Inscrição" subtitle="Dados do participante">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "0 2rem" }}>
                <Field label="Nome Completo" value={ficha?.nome_completo ?? attr.nome_completo} />
                <Field label="NIF" value={ficha?.NIF} />
                <Field label="Email" value={ficha?.email} />
                <Field label="Sede / Residência" value={ficha?.sede} />
                <Field label="Telefone" value={ficha?.telefone} />
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

          {/* Equipa — só júri */}
          {!loading && isJury && (
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

          {/* Documentos Privados — só júri */}
          {!loading && isJury && (
            <SectionPanel title="Documentos Privados">
              <FileAccordion
                onPreview={setLightboxImage}
                items={privateFiles
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

          {/* Avaliação do Júri — só júri */}
          {!loading && isJury && (
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
            {loading ? null : !user ? (
              <div style={{ maxWidth: "480px" }}>
                <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK_SOFT, margin: "0 0 1.25rem", lineHeight: 1.6 }}>
                  Para votar precisa de uma conta com email confirmado. Cada conta tem direito a um voto.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={openLogin} style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK, background: GOLD, border: "none", borderRadius: "100px", padding: "12px 28px", cursor: "pointer" }}>
                    Entrar para votar
                  </button>
                  <Link href="/conta/registar" style={{ fontFamily: FONT, fontSize: "0.935rem", fontWeight: 700, color: INK, border: `1px solid ${BORDER}`, borderRadius: "100px", padding: "11px 26px", textDecoration: "none" }}>
                    Criar conta
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: "480px" }}>
                {meuVoto?.voted && (
                  <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK_SOFT, margin: "0 0 1.25rem" }}>
                    {meuVoto.inscricaoId === inscricao.data.id
                      ? "Votou neste projeto. Obrigado!"
                      : "Já usou o seu voto noutro projeto — cada conta vota uma única vez."}
                  </p>
                )}
                <button
                  type="button"
                  onClick={onVotar}
                  disabled={voting || !meuVoto || meuVoto.voted}
                  style={{
                    fontFamily: FONT,
                    fontSize: "0.935rem",
                    fontWeight: 700,
                    color: meuVoto?.voted ? INK_SOFT : INK,
                    background: meuVoto?.voted ? BG_ALT : GOLD,
                    border: meuVoto?.voted ? `1px solid ${BORDER}` : "none",
                    borderRadius: "100px",
                    padding: "12px 32px",
                    cursor: voting || !meuVoto || meuVoto.voted ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "opacity 0.2s",
                  }}
                >
                  <svg width="16" height="16" fill={meuVoto?.inscricaoId === inscricao.data.id ? "#c0392b" : "currentColor"} viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  {voting ? "A votar…" : meuVoto?.voted ? "Voto registado" : "Votar"}
                </button>
              </div>
            )}
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
