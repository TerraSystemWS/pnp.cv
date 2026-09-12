import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { useState, useEffect, useMemo } from "react"
import qs from "qs"
import { useRouter } from "next/router"
import UserProfileCard from "../../components/custom/sidemenu"
import EdicaoPicker from "../../components/custom/EdicaoPicker"
import { hasJuryAccess } from "../../lib/roles"
import { getTokenFromLocalCookie, getTokenFromServerCookie } from "../../lib/auth"
import { getEdicoesDisponiveis, resolveEdicaoSelecionada } from "../../lib/edicoes"
import { GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const NOTA_COLORS: Record<string, string> = {
  insuficiente: "#a13b34",
  Insuficiente: "#a13b34",
  Suficiente: "#93691a",
  Bom: "#2f5a85",
  Excelente: "#316647",
}

const Avaliacao = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  avaliacoes,
  edicoesDisponiveis,
  edicaoSelecionada,
}: any) => {
  const { user, role, loading } = useFetchUser()
  const router = useRouter()

  // Estado para armazenar os nomes dos usuários
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({})

  // Verifica se o usuário está logado e redireciona para a home caso contrário
  useEffect(() => {
    if (!loading && !user) {
      router.push("/") // Redirecionar para a página inicial (home)
    }
  }, [user, loading, router])

  // Só jurados e responsáveis podem ver o resultado da avaliação
  useEffect(() => {
    if (!loading && user && !hasJuryAccess(role)) {
      router.push("/perfil")
    }
  }, [user, role, loading, router])

  // Função para pegar o nome do usuário com base no ID
  const getUserNameById = async (userId: number) => {
    const jwt = getTokenFromLocalCookie()
    // alert(jwt)

    if (!jwt) {
      console.error("Token Bearer não encontrado.")
      return null
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error("Erro ao buscar dados do usuário.")
      }

      const data = await response.json()

      // console.log("response Username")
      // console.log(data)
      return data.username // Retorna o nome do usuário
    } catch (error) {
      console.error("Erro ao buscar nome do usuário:", error)
      return null
    }
  }

  // Agrupando avaliações por categoria e projeto.
  // Memorizado por `avaliacoes` — antes era recriado a cada render, o que
  // fazia o efeito abaixo (sem array de dependências) disparar um
  // setState -> render -> efeito em loop infinito assim que havia dados.
  const categorias: any = useMemo(() => {
    const result: any = {}
    ;(avaliacoes ?? []).forEach((avaliacao: any) => {
      // Pula avaliações com relação órfã (inscrição ou usuário apagado/despublicado)
      // em vez de quebrar a página inteira com um erro de "cannot read properties of null".
      const inscricao = avaliacao?.attributes?.inscricoe?.data?.attributes
      const userId = avaliacao?.attributes?.user_id?.data?.id
      if (!inscricao || !userId) return

      const nomeProjeto = inscricao.nome_projeto
      const categoria = inscricao.categoria

      if (!result[categoria]) {
        result[categoria] = {}
      }

      if (!result[categoria][nomeProjeto]) {
        result[categoria][nomeProjeto] = {
          usuarios: [],
        }
      }

      result[categoria][nomeProjeto].usuarios.push({
        id: userId,
        nota: avaliacao.attributes.notas,
      })
    })
    return result
  }, [avaliacoes])

  // Atualiza os nomes dos usuários quando as avaliações são carregadas
  useEffect(() => {
    const fetchUserNames = async () => {
      const names: { [key: number]: string } = {}

      // Busca o nome de cada usuário nas avaliações
      for (let categoria in categorias) {
        for (let nomeProjeto in categorias[categoria]) {
          for (let usuario of categorias[categoria][nomeProjeto].usuarios) {
            if (!names[usuario.id]) {
              const name = await getUserNameById(usuario.id)
              names[usuario.id] = name || "Desconhecido" // Caso não tenha nome, marca como "Desconhecido"
            }
          }
        }
      }

      setUserNames(names) // Atualiza o estado com os nomes encontrados
    }

    fetchUserNames()
  }, [categorias]) // Só busca de novo quando os dados agrupados realmente mudam

  const temResultados = Object.keys(categorias).length > 0

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Resultado da Avaliação dos Jurados - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Resultados das avaliações do júri no Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Hero */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Resultado da Avaliação dos Jurados
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          Notas atribuídas por cada jurado, por projeto e categoria.
        </p>
      </div>

      <div style={{ background: BG, padding: "3rem 2rem 6rem", fontFamily: FONT }}>
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <UserProfileCard user={user} role={role} />

          <div className="col-span-4 sm:col-span-9">
            <EdicaoPicker
              edicoes={edicoesDisponiveis}
              selecionada={edicaoSelecionada}
              basePath="/perfil/avaliacaoStatus"
              variant="inline"
            />

            {!temResultados ? (
              <p style={{ color: INK_SOFT, textAlign: "center", padding: "3rem 0" }}>
                Ainda não há avaliações registadas nesta edição.
              </p>
            ) : (
              Object.keys(categorias).map((categoria) => (
                <div key={categoria} style={{ marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap", margin: 0 }}>
                      {categoria}
                    </h2>
                    <div style={{ flex: 1, height: "1px", background: BORDER }} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {Object.keys(categorias[categoria]).map((nomeProjeto) => {
                      const { usuarios } = categorias[categoria][nomeProjeto]

                      return (
                        <div key={nomeProjeto} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: "14px", padding: "1.5rem" }}>
                          <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: INK, margin: "0 0 0.2rem" }}>{nomeProjeto}</h4>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600, color: INK_SOFT, margin: "0 0 1rem" }}>
                            {usuarios.length} avaliaç{usuarios.length === 1 ? "ão" : "ões"}
                          </p>

                          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {usuarios.map((usuario: any, index: number) => {
                              const userName = userNames[usuario.id] || "Carregando..."
                              return (
                                <li key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.87rem" }}>
                                  <span style={{ color: INK }}>Jurado #{usuario.id}: {userName}</span>
                                  <span style={{
                                    fontSize: "0.74rem", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase",
                                    color: "#fff", background: NOTA_COLORS[usuario.nota] ?? GOLD_DARK,
                                    borderRadius: "100px", padding: "3px 11px",
                                  }}>
                                    {usuario.nota}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Avaliacao

export async function getServerSideProps({ query, req }: any) {
  const jwt = getTokenFromServerCookie(req)

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
    const avaliacoesQuery = qs.stringify(
      {
        filters: { inscricoe: { edicoes: { N_Edicao: { $eq: edicaoSelecionada } } } },
        populate: { user_id: { fields: ["id"] }, inscricoe: { fields: "*" } },
        pagination: { page: 1, pageSize: 500 },
      },
      { encodeValuesOnly: true }
    )

    const results = await Promise.allSettled([
      fetcher(
        `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${edicaoQuery}`
      ),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?${inscritosQuery}`),
      fetcher(
        `${api_link}/api/avaliacaos?${avaliacoesQuery}`,
        jwt ? { headers: { Authorization: `Bearer ${jwt}` } } : {}
      ),
    ])
    const [edicoes, contato, menus, inscritos, avaliacoes] = results.map((r: any) => {
      if (r.status === 'fulfilled') return r.value
      console.error('Endpoint failed:', r.reason)
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
        avaliacoes: avaliacoes?.data ?? [],
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
        avaliacoes: [],
      },
    }
  }
}
