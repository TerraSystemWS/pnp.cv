import Layout from "../../components/Layout"
import Link from "next/link"
import { fetcher, apiClient, ApiError } from "../../lib/api"
import { getTokenFromLocalCookie, openLogin } from "../../lib/auth"
import { parseNavbar } from "../../lib/parseNavbar"
import qs from "qs"
import Head from "next/head"
import { useRouter } from "next/router"
import Swal from "sweetalert2"
import { useFetchUser } from "../../lib/authContext"
import { useEffect, useState } from "react"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"
import { getEstado, ESTADO_LABEL, diasRestantes, fimDoDia } from "../../lib/inscricaoStatus"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

interface MinhaInscricao {
  id: number
  url: string
  nome_projeto: string | null
  categoria: string | null
  publishedAt: string | null
  updatedAt: string
  submetida_em: string | null
  confirmada_em: string | null
  expira_em: string | null
}

const Inscreve = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const router = useRouter()
  const [minhas, setMinhas] = useState<MinhaInscricao[] | null>(null)
  const [creating, setCreating] = useState(false)

  const dataFim = edicao?.data?.attributes?.data_fim
    ? fimDoDia(edicao.data.attributes.data_fim)
    : new Date("2025-01-31")
  const diffDays = Math.max(0, Math.ceil((dataFim.getTime() - Date.now()) / 86400000))
  const deadlineStr = dataFim.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })

  useEffect(() => {
    if (loading || !user) return
    const jwt = getTokenFromLocalCookie()
    if (!jwt) return
    apiClient
      .getWithAuth("/api/inscricoes/mine", jwt)
      .then((res: { data: MinhaInscricao[] }) => setMinhas(res.data ?? []))
      .catch((err: unknown) => {
        console.error("Erro ao carregar candidaturas:", err)
        setMinhas([])
      })
  }, [user, loading])

  const novaCandidatura = async () => {
    const result = await Swal.fire({
      title: "Prémio Nacional De Publicidade",
      text: "Antes de iniciar a candidatura, leia os regulamentos do concurso.",
      footer: '<a href="/regulamentos">Regulamentos</a>',
      imageUrl: "https://res.cloudinary.com/dkz8fcpla/image/upload/v1672960467/Captura_de_ecra_de_2023_01_05_22_13_23_ae07a3a795.png?updated_at=2023-01-05T23:14:27.822Z",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "PNP Gala",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2a12b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, inscrever",
    })
    if (!result.isConfirmed) return

    const jwt = getTokenFromLocalCookie()
    if (!jwt) return openLogin()

    setCreating(true)
    try {
      const res = await apiClient.post("/api/inscricoes/mine", {}, jwt)
      const url = res?.data?.url
      if (!url) throw new Error("Resposta sem url")
      Swal.fire("Inscrição criada!", `Tem até ${deadlineStr} para concluir a candidatura e confirmá-la no email que lhe vamos enviar. Caso contrário, será eliminada.`, "success")
      router.push(`/inscricao/${url}`)
    } catch (err) {
      // 403: conta por confirmar ou candidaturas da edição já encerradas.
      const text = err instanceof ApiError && err.status === 403
        ? err.message
        : "Erro ao criar inscrição. Tente novamente."
      Swal.fire({ icon: "error", title: "Erro", text })
      setCreating(false)
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição — Prémio Nacional De Publicidade</title>
        <meta name="description" content="Candidatura ao Prémio Nacional de Publicidade de Cabo Verde." />
      </Head>

      <style>{`
        ${FONT_IMPORT}

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseGold {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }

        .pnp-page {
          background: ${BG};
          min-height: 100vh;
          font-family: ${FONT};
        }

        .pnp-hero { animation: fadeIn 0.8s ease both; }

        .pnp-rule {
          height: 1px;
          background: ${BORDER};
        }

        .pnp-deadline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid ${BORDER};
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 0.82rem;
          font-weight: 600;
          color: ${GOLD_DARK};
          background: ${BG_ALT};
        }

        .pnp-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: ${GOLD};
          animation: pulseGold 2s ease-in-out infinite;
        }

        /* Cards */
        .pnp-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          animation: fadeUp 0.6s ease both;
        }

        .pnp-card:hover {
          border-color: ${GOLD};
          box-shadow: 0 16px 40px rgba(36,31,15,0.1);
          transform: translateY(-4px);
        }

        .pnp-icon {
          width: 52px; height: 52px;
          border: 1px solid ${BORDER};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: ${BG_ALT};
          margin-bottom: 1.75rem;
          transition: background 0.25s, border-color 0.25s;
        }

        .pnp-card:hover .pnp-icon {
          background: ${GOLD}14;
          border-color: ${GOLD};
        }

        .pnp-card-title {
          font-family: ${FONT};
          font-size: 1.4rem;
          font-weight: 700;
          color: ${INK};
          margin-bottom: 0.5rem;
        }

        .pnp-card-desc {
          font-size: 0.92rem;
          color: ${INK_SOFT};
          line-height: 1.65;
          margin-bottom: 2rem;
        }

        .pnp-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: ${INK};
          margin-bottom: 8px;
        }

        .pnp-input {
          width: 100%;
          background: ${BG};
          border: 1px solid ${BORDER};
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.92rem;
          color: ${INK};
          font-family: ${FONT};
          transition: border-color 0.2s;
          box-sizing: border-box;
        }

        .pnp-input::placeholder { color: ${INK_SOFT}88; }

        .pnp-input:focus {
          outline: none;
          border-color: ${GOLD};
        }


        .pnp-btn {
          width: 100%;
          background: ${GOLD};
          border: none;
          border-radius: 10px;
          padding: 13px 24px;
          font-family: ${FONT};
          font-size: 0.9rem;
          font-weight: 700;
          color: ${INK};
          cursor: pointer;
          transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          margin-top: 8px;
        }

        .pnp-btn:hover {
          background: #d4aa40;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(194,161,43,0.28);
        }

        .pnp-btn:active { transform: translateY(0); }

        .pnp-err { color: #c0392b; font-size: 0.82rem; margin-top: 4px; }

        .pnp-divider { display: none; }

        .pnp-btn:disabled { opacity: 0.6; cursor: default; transform: none; box-shadow: none; }

        .pnp-row {
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
          padding: 1rem 1.25rem; text-decoration: none; transition: background 0.2s;
        }
        .pnp-row:hover { background: ${GOLD}10 !important; }

        .pnp-badge {
          flex-shrink: 0; font-size: 0.78rem; font-weight: 700; color: ${INK};
          border: 1px solid ${BORDER}; border-radius: 100px; padding: 4px 12px; background: ${BG};
        }

        @media (max-width: 768px) {
          .pnp-card { padding: 2rem 1.5rem; }
          .pnp-divider {
            display: block;
            height: 1px;
            background: ${BORDER};
            margin: 0.5rem 0;
          }
        }
      `}</style>

      <div className="pnp-page">
        {/* Hero */}
        <div className="pnp-hero pt-28 pb-14 px-6 text-center">
          <div className="pnp-deadline mb-8">
            <span className="pnp-dot" />
            Prazo: {deadlineStr}
            {diffDays > 0 && <span style={{ color: INK_SOFT }}>· {diffDays} dias</span>}
            {diffDays === 0 && <span style={{ color: "#c0392b" }}>· Encerrado</span>}
          </div>

          <h1 style={{ fontFamily: FONT, fontWeight: 700, color: INK }} className="text-5xl md:text-7xl leading-none tracking-tight mb-3">
            Candidatura
          </h1>
          <p style={{ fontFamily: FONT, fontWeight: 700, color: INK_SOFT, letterSpacing: "0.08em" }} className="text-base md:text-lg uppercase mb-10">
            Prémio Nacional de Publicidade
          </p>

          <div className="pnp-rule max-w-sm mx-auto" />
        </div>

        {/* Cards */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
          {loading ? null : !user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Sem sessão — entrar */}
              <div className="pnp-card">
                <div className="pnp-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </div>
                <h3 className="pnp-card-title">Já tenho conta</h3>
                <p className="pnp-card-desc">
                  Entre para criar uma nova candidatura ou continuar as que já começou.
                </p>
                <button type="button" className="pnp-btn" onClick={openLogin}>
                  Entrar →
                </button>
              </div>

              {/* Sem sessão — criar conta */}
              <div className="pnp-card">
                <div className="pnp-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                       stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <h3 className="pnp-card-title">Criar conta</h3>
                <p className="pnp-card-desc">
                  Qualquer pessoa ou empresa pode candidatar projetos. Crie a sua conta com um email válido — enviamos um link de confirmação.
                </p>
                <Link href="/conta/registar" className="pnp-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
                  Criar conta →
                </Link>
              </div>
            </div>
          ) : (
            <div className="pnp-card" style={{ transform: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h3 className="pnp-card-title">As minhas candidaturas</h3>
                  <p className="pnp-card-desc" style={{ margin: 0 }}>
                    Continue uma candidatura ou crie uma nova. O email de contacto é o da sua conta.
                  </p>
                </div>
                <button type="button" className="pnp-btn" style={{ width: "auto", marginTop: 0 }} onClick={novaCandidatura} disabled={creating}>
                  {creating ? "A criar…" : "+ Nova candidatura"}
                </button>
              </div>

              {router.query.confirmada === "1" && (
                <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.25rem", background: `${GOLD}14`, border: `1px solid ${GOLD}`, borderRadius: "8px", color: INK, fontSize: "0.95rem", fontWeight: 700 }}>
                  ✓ Candidatura confirmada com sucesso. Obrigado pela sua participação!
                </div>
              )}

              {minhas === null ? (
                <p style={{ color: INK_SOFT, fontSize: "0.92rem" }}>A carregar…</p>
              ) : minhas.length === 0 ? (
                <p style={{ color: INK_SOFT, fontSize: "0.92rem" }}>
                  Ainda não tem candidaturas. Leia o <Link href="/regulamentos" style={{ color: GOLD_DARK, textDecoration: "underline" }}>regulamento</Link> e comece a primeira.
                </p>
              ) : (
                <div style={{ border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
                  {minhas.map((m, i) => (
                    <Link
                      key={m.id}
                      href={`/inscricao/${m.url}`}
                      className="pnp-row"
                      style={{ borderBottom: i < minhas.length - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? CARD : BG_ALT }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: INK, fontSize: "1rem" }}>
                          {m.nome_projeto || "Candidatura sem título"}
                        </p>
                        <p style={{ margin: "0.2rem 0 0", color: INK_SOFT, fontSize: "0.85rem" }}>
                          {m.categoria || "Categoria por escolher"} · atualizada a {new Date(m.updatedAt).toLocaleDateString("pt-PT")}
                        </p>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.3rem", flexShrink: 0 }}>
                        <span className="pnp-badge" style={getEstado(m) === "aceite" || getEstado(m) === "confirmada" ? { background: `${GOLD}22`, borderColor: GOLD } : undefined}>
                          {ESTADO_LABEL[getEstado(m)]}
                        </span>
                        {diasRestantes(m) !== null && (
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: (diasRestantes(m) ?? 0) <= 2 ? "#c0392b" : INK_SOFT }}>
                            {diasRestantes(m) === 0 ? "Expira hoje" : `Expira em ${diasRestantes(m)} dia${diasRestantes(m) === 1 ? "" : "s"}`}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer note */}
          <p className="text-center mt-10" style={{ color: INK_SOFT, fontFamily: FONT, fontSize: "0.935rem" }}>
            Ao submeter, declara ter lido e aceite o{" "}
            <Link href="/regulamentos" style={{ color: GOLD_DARK, textDecoration: "underline", textUnderlineOffset: "3px" }}>
              regulamento
            </Link>{" "}
            do concurso.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Inscreve

export async function getServerSideProps() {
  // Edição atual = a mais recente (a mesma em que o Strapi cria as candidaturas).
  const query = qs.stringify({ sort: ["N_Edicao:desc"], pagination: { limit: 1 }, populate: "deep" }, { encodeValuesOnly: true })
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, edicao, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })
    return {
      props: {
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        edicao: edicao?.data?.[0] ? { data: edicao.data[0] } : null,
        navbar: parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return {
      props: { social: [], contato: null, edicao: null, navbar: [] },
    }
  }
}
