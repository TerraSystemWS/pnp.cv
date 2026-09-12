import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { getAvaliacaos } from "../../lib/utils"
import { useState, useEffect } from "react"
import qs from "qs"
import { useRouter } from "next/router"
import UserProfileCard from "../../components/custom/sidemenu"
import EdicaoPicker from "../../components/custom/EdicaoPicker"
import { getIdFromLocalCookie, getTokenFromLocalCookie } from "../../lib/auth"
import { hasJuryAccess } from "../../lib/roles"
import { getEdicoesDisponiveis, resolveEdicaoSelecionada } from "../../lib/edicoes"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const NOTA_COLORS: Record<string, string> = {
  insuficiente: "#a13b34",
  Insuficiente: "#a13b34",
  Suficiente: "#93691a",
  Bom: "#2f5a85",
  Excelente: "#316647",
}

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Avaliacao = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  edicoesDisponiveis,
  edicaoSelecionada,
}: any) => {
  const { user, role, loading } = useFetchUser()
  const router = useRouter()

  // Estado para armazenar o userId
  const [userId, setUserId] = useState<string | null>(null)
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])

  // Recupera o userId quando o componente for montado
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getIdFromLocalCookie()
      setUserId(id ?? null)
    }

    fetchUserId()
  }, []) // O useEffect é executado uma vez quando o componente é montado

  // Verifica se o usuário está logado e redireciona para a home caso contrário
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Só jurados e responsáveis podem avaliar projetos
  useEffect(() => {
    if (!loading && user && !hasJuryAccess(role)) {
      router.push("/perfil")
    }
  }, [user, role, loading, router])

  // Fetch de avaliações baseado em inscrições e userId
  useEffect(() => {
    if (userId && inscritos.length > 0) {
      const fetchAvaliacoes = async () => {
        const results = await Promise.allSettled(
          inscritos.map(async (inscricao: any) => {
            const avaliacao = await getAvaliacaos(
              inscricao.id,
              Number(userId),
              getTokenFromLocalCookie()
            )
            return {
              inscricaoId: inscricao.id,
              avaliacao: avaliacao || null,
            }
          })
        )
        // Promise.allSettled devolve { status, value }, não o valor resolvido
        // direto — guardar `results` sem desembrulhar fazia o .find() abaixo
        // nunca achar `inscricaoId` (fica dentro de `.value`), então TODO
        // projeto aparecia como "Ainda não foi avaliado", mesmo já avaliado.
        setAvaliacoes(
          results
            .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
            .map((r) => r.value)
        )
      }
      fetchAvaliacoes()
    }
  }, [userId, inscritos]) // Recarregar as avaliações quando userId ou inscritos mudarem

  const edicaoMaisRecente = edicoes[0]?.attributes

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Avaliar Projetos - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Área de avaliação de projetos concorrentes ao Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .av-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 14px; padding: 1.5rem; width: 260px; transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s; text-decoration: none; display: block; }
        .av-card:hover { border-color: ${GOLD}; transform: translateY(-4px); box-shadow: 0 10px 26px rgba(36,31,15,0.1); }
      `}</style>

      {/* Hero */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Avaliar Projetos
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          {edicaoMaisRecente ? `Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição` : "Sem edições disponíveis no momento"}
        </p>
      </div>

      <div style={{ background: BG, padding: "3rem 2rem 6rem", fontFamily: FONT }}>
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <UserProfileCard user={user} role={role} />

          <div className="col-span-4 sm:col-span-9">
            <EdicaoPicker
              edicoes={edicoesDisponiveis}
              selecionada={edicaoSelecionada}
              basePath="/perfil/avaliacao"
              variant="inline"
            />

            {!edicaoMaisRecente ? (
              <p style={{ color: INK_SOFT, textAlign: "center", padding: "3rem 0" }}>
                Não há edições de concursos disponíveis no momento.
              </p>
            ) : (
              edicaoMaisRecente.categoria.map((categoria: any) => {
                const inscricoesCategoria = inscritos.filter(
                  (inscricao: any) => inscricao.attributes.categoria === categoria.titulo
                )

                return (
                  <div key={categoria.id} style={{ marginBottom: "3rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
                        {categoria.titulo}
                      </h2>
                      <div style={{ flex: 1, height: "1px", background: BORDER }} />
                    </div>

                    {inscricoesCategoria.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.1rem" }}>
                        {inscricoesCategoria.map((inscricao: any) => {
                          const avaliacao = avaliacoes.find(
                            (a) => a.inscricaoId === inscricao.id
                          )?.avaliacao
                          const notaColor = avaliacao ? (NOTA_COLORS[avaliacao.notas] ?? GOLD_DARK) : null

                          return (
                            <Link key={inscricao.id} href={`/projetos/${inscricao.id}`} className="av-card">
                              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: INK, margin: "0 0 0.85rem", lineHeight: 1.3 }}>
                                {inscricao.attributes.nome_projeto}
                              </h4>

                              {avaliacao ? (
                                <div>
                                  <span style={{
                                    display: "inline-block", fontSize: "0.76rem", fontWeight: 700,
                                    letterSpacing: "0.03em", textTransform: "uppercase",
                                    color: "#fff", background: notaColor ?? GOLD_DARK,
                                    borderRadius: "100px", padding: "3px 11px", marginBottom: "0.5rem",
                                  }}>
                                    {avaliacao.notas.charAt(0).toUpperCase() + avaliacao.notas.slice(1)}
                                  </span>
                                  {avaliacao.comentario && (
                                    <p style={{ fontSize: "0.82rem", color: INK_SOFT, margin: 0 }}>{avaliacao.comentario}</p>
                                  )}
                                </div>
                              ) : (
                                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: GOLD_DARK }}>
                                  Ainda não foi avaliado
                                </span>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    ) : (
                      <p style={{ color: INK_SOFT, fontSize: "0.9rem" }}>Nenhuma inscrição encontrada para esta categoria.</p>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Avaliacao

export async function getServerSideProps({ query }: any) {
  try {
    const edicoesDisponiveis = await getEdicoesDisponiveis()
    const edicaoSelecionada = resolveEdicaoSelecionada(query.edicao, edicoesDisponiveis)

    const edicaoQuery = qs.stringify(
      { filters: { N_Edicao: { $eq: edicaoSelecionada } } },
      { encodeValuesOnly: true }
    )
    const inscritosQuery = qs.stringify(
      { filters: { edicoes: { N_Edicao: { $eq: edicaoSelecionada } } }, populate: "*" },
      { encodeValuesOnly: true }
    )

    const results = await Promise.allSettled([
      fetcher(
        `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${edicaoQuery}`
      ),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?${inscritosQuery}`),
    ])
    const [edicoes, contato, menus, inscritos] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: {
        edicoes: edicoes?.data ?? [],
        edicoesDisponiveis,
        edicaoSelecionada,
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        navbar: parseNavbar(menus, "menus"),
        inscritos: inscritos?.data ?? [],
      },
    }
  } catch (error) {
    console.error("Error fetching server-side data:", error)
    return {
      props: {
        edicoes: [],
        edicoesDisponiveis: [],
        edicaoSelecionada: null,
        social: [],
        contato: {},
        navbar: [],
        inscritos: [],
      },
    }
  }
}
