import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Link from "next/link"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import HeroSection from "../../components/HeroSection"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Vpublica = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  totalPages,
  currentPage,
}: any) => {
  const { user, loading } = useFetchUser()

  // Ordena as edições pela mais recente (assumindo que N_Edicao representa o número da edição)
  const edicaoMaisRecente = edicoes[0]?.attributes

  // console.log("edicaoMaisRecente")
  // console.log(edicaoMaisRecente)

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

  // Mapeamento das inscrições por edição
  const inscricoesPorEdicao = inscritos.reduce((acc: any, inscricao: any) => {
    // Certifique-se de que o id da edição está sendo acessado corretamente
    const edicaoId = inscricao.attributes.edicoes?.data?.id

    if (!edicaoId) return acc

    if (!acc[edicaoId]) {
      acc[edicaoId] = []
    }

    acc[edicaoId].push(inscricao)
    return acc
  }, {})

  // console.log("inscricoesPorEdicao")
  // console.log(inscricoesPorEdicao)

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Trabalhos concorrentes - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Projetos concorrentes aos Premios - Prémio Nacional De Publicidade"
        />
      </Head>

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <HeroSection
            title={`Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição`}
            subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
          />

          {/* Lista de Categorias com Inscrições */}
          <div className="mt-4 ">
            <div className="bg-gray-200 p-4 rounded-lg">
              {/* <h3 className="text-2xl font-semibold mb-4">
                Edição {edicaoMaisRecente.N_Edicao}
              </h3> */}
              {edicaoMaisRecente.categoria.map((categoria: any) => {
                // Filtra as inscrições da categoria específica
                const inscricoesCategoria = inscritos.filter(
                  (inscricao: any) =>
                    inscricao.attributes.categoria === categoria.titulo
                )

                return (
                  <div key={categoria.id} className="mb-8">
                    {/* Título da categoria */}
                    <h4 className="text-2xl font-semibold text-gray-800 mb-4">
                      {categoria.titulo}
                    </h4>

                    {/* Se houver inscrições na categoria */}
                    {inscricoesCategoria.length > 0 ? (
                      <div className="flex flex-wrap gap-4 justify-start">
                        {inscricoesCategoria.map((inscricao: any) => (
                          <Link
                            key={inscricao.id}
                            href={`/projetos/${inscricao.id}`}
                            className="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 dark:bg-surface-dark dark:text-white"
                          >
                            <div className="p-6">
                              {/* Nome do projeto */}
                              <h6 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white leading-tight transition-colors duration-300">
                                {inscricao.attributes.nome_projeto}
                              </h6>
                              {/* Adiciona uma breve descrição (caso tenha) ou algum outro detalhe */}
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                Breve descrição ou informação adicional sobre o
                                projeto.
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Nenhuma inscrição encontrada para esta categoria.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Paginação */}
            <div className="flex justify-between items-center mt-8 py-6 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-lg">
              {/* Botão de Próxima Página */}
              {currentPage < totalPages && (
                <Link
                  href={`?page=${currentPage + 1}`}
                  className="px-8 py-3 text-xl font-semibold text-white bg-yellow-600 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
                >
                  Edição Anterior
                </Link>
              )}

              {/* Exibição de Página Atual */}
              <span className="text-xl font-semibold text-white">
                Página {currentPage} de {totalPages}
              </span>

              {/* Botão de Página Anterior */}
              {currentPage > 1 && (
                <Link
                  href={`?page=${currentPage - 1}`}
                  className="px-8 py-3 text-xl font-semibold text-white bg-yellow-600 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300"
                >
                  Próxima Edição
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Vpublica

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
    const [edicoes, rsocials, contato, navbar, inscritos] = await Promise.all([
      fetcher(
        `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${queri}`
      ),
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?populate=*`), // Certifique-se de que as inscrições também estão sendo populadas
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
        totalPages: 1,
        currentPage: 1,
      },
    }
  }
}
