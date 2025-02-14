import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Link from "next/link"
import Head from "next/head"
import { StrapiImage } from "../../components/custom/StrapiImage"
import { useFetchUser } from "../../lib/authContext"
import { formatDateTime } from "../../lib/utils"
import { useState, useEffect } from "react"
import qs from "qs"
import HeroSection from "../../components/HeroSection"
import { useRouter } from "next/router"
import UserProfileCard from "../../components/custom/sidemenu"
import { getIdFromLocalCookie } from "../../lib/auth"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Avaliacao = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  avaliacaos,
  totalPages,
  currentPage,
}: any) => {
  const { user, loading } = useFetchUser()
  const router = useRouter()

  // Estado para armazenar o userId
  const [userId, setUserId] = useState<string | null>(null)

  // Recupera o userId quando o componente for montado
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getIdFromLocalCookie()
      setUserId(id)
    }

    fetchUserId()
  }, []) // O useEffect é executado uma vez quando o componente é montado

  // Verifica se o usuário está logado e redireciona para a home caso contrário
  useEffect(() => {
    if (!loading && !user) {
      // Redirecionar para a página inicial (home)
      router.push("/")
    }
  }, [user, loading, router])

  // Se o userId ainda não foi carregado, evita a renderização
  if (loading || userId === null) {
    return <div>Loading...</div> // ou qualquer componente de carregamento
  }

  // Ordena as edições pela mais recente (assumindo que N_Edicao representa o número da edição)
  const edicaoMaisRecente = edicoes[0]?.attributes

  // Se não houver edições, exibe uma mensagem
  if (!edicaoMaisRecente) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <Head>
          <title>Trabalhos concorrentes - Prémio Nacional De Publicidade</title>
          <meta
            name="description"
            content="Projetos concorrentes aos Premios - Prémio Nacional De Publicidade"
          />
        </Head>
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <HeroSection
            title="Sem Edições Disponíveis"
            subtitle="Não há edições de concursos disponíveis no momento."
          />
        </div>
      </Layout>
    )
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Perfil - dados do usuário</title>
        <meta
          name="description"
          content="Aqui pode encontrar postagens e arquivos relacionados ao PNP e muito mais"
        />
      </Head>
      <section>
        <div className="bg-gray-100">
          <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
              <UserProfileCard user={user} />
              <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Área dos Jurados</h2>
                  <HeroSection
                    title={`Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição`}
                    subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
                  />
                  <h2 className="text-xl font-bold mt-6 mb-4">
                    Lista De Projetos
                  </h2>
                  <div className="mb-6">
                    <div className="mt-4">
                      <div className="bg-gray-200 p-4 rounded-lg">
                        {edicaoMaisRecente.categoria.map((categoria: any) => {
                          const inscricoesCategoria = inscritos.filter(
                            (inscricao: any) =>
                              inscricao.attributes.categoria ===
                              categoria.titulo
                          )

                          return (
                            <div key={categoria.id} className="mb-8">
                              <h4 className="text-2xl font-semibold text-gray-800 mb-4">
                                {categoria.titulo}
                              </h4>

                              {inscricoesCategoria.length > 0 ? (
                                <div className="flex flex-wrap gap-4 justify-start">
                                  {inscricoesCategoria.map((inscricao: any) => {
                                    // Filtra as avaliações com base no user_id do usuário logado e no id da inscrição
                                    // console.log("avaliacaos: ")
                                    // console.log(avaliacaos)
                                    const avaliacao = avaliacaos.find(
                                      (avaliacao: any) =>
                                        avaliacao.attributes.user_id?.data
                                          .id === userId && // Agora está comparando com o userId carregado
                                        avaliacao.attributes.inscricoe?.data
                                          .id === inscricao.id
                                    )

                                    // const avaliacao = avaliacaos.find(
                                    //   (avaliacao) =>
                                    //     avaliacao.attributes.user_id?.data.id === userId && // Acessando 'user_id' corretamente dentro de 'attributes'
                                    //     avaliacao.attributes.inscricoe?.data.id === inscricao.id // Acessando 'inscricoe' corretamente dentro de 'attributes'
                                    // );

                                    // console.log("avaliacaos: ")
                                    // console.log(avaliacaos)

                                    // console.log("avaliacao filtrada: ")
                                    // console.log(avaliacao)

                                    // console.log("userId: ")
                                    // console.log(userId)

                                    // console.log("avaliacao: ")
                                    // console.log(avaliacao)

                                    // console.log("userId:", userId)
                                    // console.log("inscricao.id:", inscricao.id)
                                    // console.log(
                                    //   "avaliacao.user_id?.data.id:",
                                    //   avaliacao?.user_id?.data?.id
                                    // )
                                    // console.log(
                                    //   "avaliacao.inscricoe?.data.id:",
                                    //   avaliacao?.inscricoe?.data?.id
                                    // )

                                    return (
                                      <Link
                                        key={inscricao.id}
                                        href={`/projetos/${inscricao.id}`}
                                        className="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 dark:bg-surface-dark dark:text-white"
                                      >
                                        <div className="p-6">
                                          <h6 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white leading-tight transition-colors duration-300">
                                            {inscricao.attributes.nome_projeto}
                                          </h6>

                                          {/* Exibindo faixa de avaliação */}

                                          {avaliacao ? (
                                            <div className="mt-2 flex space-x-4">
                                              <p>
                                                <span
                                                  className={`p-2 rounded-full text-white ${
                                                    avaliacao.attributes
                                                      .notas ===
                                                      "insuficiente" ||
                                                    avaliacao.attributes
                                                      .notas === "Insuficiente"
                                                      ? "bg-red-400"
                                                      : avaliacao.attributes
                                                          .notas ===
                                                        "Suficiente"
                                                      ? "bg-yellow-400"
                                                      : avaliacao.attributes
                                                          .notas === "Bom"
                                                      ? "bg-blue-400"
                                                      : "bg-green-400"
                                                  }`}
                                                >
                                                  {avaliacao.attributes.notas
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    avaliacao.attributes.notas.slice(
                                                      1
                                                    )}
                                                </span>
                                              </p>
                                              <p className="text-sm text-gray-600">
                                                {
                                                  avaliacao.attributes
                                                    .comentario
                                                }
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="text-lg text-yellow-500">
                                              Ainda não foi avaliado.
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    )
                                  })}
                                </div>
                              ) : (
                                <p className="text-gray-500">
                                  Nenhuma inscrição encontrada para esta
                                  categoria.
                                </p>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Avaliacao

// Server-Side Data Fetching with Pagination Logic
export async function getServerSideProps({ query }: any) {
  const page = query.page || 1 // Default to first page
  const pageSize = 1 // Show only one edition per page

  const queri = qs.stringify(
    {
      sort: ["N_Edicao:desc"], // Ordena pela edição mais recente
      pagination: {
        page, // Current page
        pageSize, // Number of editions per page
      },
    },
    { encodeValuesOnly: true }
  )

  try {
    // Fetch data concurrently
    const [edicoes, rsocials, contato, navbar, inscritos, avaliacaos] =
      await Promise.all([
        fetcher(
          `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${queri}`
        ),
        fetcher(`${api_link}/api/redes-social?populate=*`),
        fetcher(`${api_link}/api/contato`),
        fetcher(`${api_link}/api/menus?populate=deep`),
        fetcher(`${api_link}/api/inscricoes?populate=*`), // Certifique-se de que as inscrições também estão sendo populadas
        fetcher(
          `${api_link}/api/avaliacaos?populate[user_id][fields]=id&[populate][inscricoe][fields]=id`
        ),
      ])

    const totalPages = Math.ceil(edicoes.meta.pagination.total / pageSize)
    const currentPage = edicoes.meta.pagination.page

    // Navbar parsing
    const dlink =
      navbar?.data?.flatMap(
        (menuItem: any) =>
          menuItem?.attributes?.items?.data?.map((linkItem: any) => ({
            name: linkItem?.attributes?.title ?? "Unnamed",
            link: linkItem?.attributes?.url ?? "#",
          })) || []
      ) || []

    return {
      props: {
        edicoes: edicoes.data,
        totalPages, // Add total pages for pagination
        currentPage, // Add current page
        social: rsocials,
        contato,
        navbar: dlink,
        inscritos: inscritos.data,
        avaliacaos: avaliacaos.data,
      },
    }
  } catch (error) {
    console.error("Error fetching server-side data:", error)
    return {
      props: {
        edicoes: [],
        social: [],
        contato: {},
        navbar: [],
        inscritos: [],
        avaliacaos: [],
        totalPages: 1,
        currentPage: 1,
      },
    }
  }
}
