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

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Avaliacao = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  totalPages,
  currentPage,
}: any) => {
  const { user, loading } = useFetchUser()
  const router = useRouter()

  // Verifica se o usuário está logado e redireciona para a home caso contrário
  useEffect(() => {
    if (!loading && !user) {
      // Redirecionar para a página inicial (home)
      router.push("/")
    }
  }, [user, loading, router])

  // Evita renderização até que o status de login seja verificado
  //   if (loading || !user) {
  //     return <div>Loading...</div> // ou qualquer componente de carregamento
  //   }

  // Ordena as edições pela mais recente (assumindo que N_Edicao representa o número da edição)
  const edicaoMaisRecente = edicoes[0]?.attributes

  console.log("edicaoMaisRecente")
  console.log(edicaoMaisRecente)

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
    // let inscricaoId = inscricao.id

    if (!edicaoId) return acc

    if (!acc[edicaoId]) {
      acc[edicaoId] = []
    }

    acc[edicaoId].push(inscricao)
    return acc
  }, {})

  //   console.log("inscricoesPorEdicao")
  //   console.log(inscricoesPorEdicao)

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
              {/* component de side meu */}
              <UserProfileCard user={user} />
              <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Área dos Jurados</h2>
                  <HeroSection
                    title={`Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição`}
                    subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
                  />
                  {/* <p className="text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    finibus est vitae tortor ullamcorper, ut vestibulum velit
                    convallis. Aenean posuere risus non velit egestas suscipit.
                    Nunc finibus vel ante id euismod. Vestibulum ante ipsum
                    primis in faucibus orci luctus et ultrices posuere cubilia
                    Curae; Aliquam erat volutpat. Nulla vulputate pharetra
                    tellus, in luctus risus rhoncus id.
                  </p> */}

                  <h3 className="font-semibold text-center mt-3 -mb-2">
                    Siga-me no
                  </h3>
                  <div className="flex justify-center items-center gap-6 my-6">
                    <a
                      className="text-gray-700 hover:text-orange-600"
                      aria-label="Visit TrendyMinds LinkedIn"
                      href=""
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="h-6"
                      >
                        <path
                          fill="currentColor"
                          d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                        ></path>
                      </svg>
                    </a>
                    <a
                      className="text-gray-700 hover:text-orange-600"
                      aria-label="Visit TrendyMinds YouTube"
                      href=""
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        className="h-6"
                      >
                        <path
                          fill="currentColor"
                          d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                        ></path>
                      </svg>
                    </a>
                    <a
                      className="text-gray-700 hover:text-orange-600"
                      aria-label="Visit TrendyMinds Facebook"
                      href=""
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="h-6"
                      >
                        <path
                          fill="currentColor"
                          d="m279.14 288 14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                        ></path>
                      </svg>
                    </a>
                    <a
                      className="text-gray-700 hover:text-orange-600"
                      aria-label="Visit TrendyMinds Instagram"
                      href=""
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        className="h-6"
                      >
                        <path
                          fill="currentColor"
                          d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                        ></path>
                      </svg>
                    </a>
                    <a
                      className="text-gray-700 hover:text-orange-600"
                      aria-label="Visit TrendyMinds Twitter"
                      href=""
                      target="_blank"
                    >
                      <svg
                        className="h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                        ></path>
                      </svg>
                    </a>
                  </div>

                  <h2 className="text-xl font-bold mt-6 mb-4">
                    Lista De Projetos
                  </h2>
                  <div className="mb-6">
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
                              inscricao.attributes.categoria ===
                              categoria.titulo
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
                                    // <Link
                                    //   key={inscricao.id}
                                    //   href={`/projetos/${inscricao.id}`}
                                    //   className="block max-w-[18rem] rounded-lg bg-white text-left text-surface shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 dark:bg-surface-dark dark:text-white"
                                    // >
                                    //   <div className="p-6">
                                    //     {/* Nome do projeto */}
                                    //     <h6 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white leading-tight transition-colors duration-300">
                                    //       {inscricao.attributes.nome_projeto}
                                    //     </h6>
                                    //     {/* Adiciona uma breve descrição (caso tenha) ou algum outro detalhe */}
                                    //     <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    //       Breve descrição ou informação
                                    //       adicional sobre o projeto.
                                    //     </p>
                                    //   </div>
                                    // </Link>
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

                                        {/* Condição para exibir a faixa de votação ou a descrição */}
                                        {inscricao.votacao ? (
                                          <div className="mt-2 flex space-x-4">
                                            {/* Faixa de votação */}
                                            <span
                                              className={`px-4 py-2 rounded-full text-white ${
                                                inscricao.votacao ===
                                                "insuficiente"
                                                  ? "bg-red-500"
                                                  : inscricao.votacao ===
                                                    "suficiente"
                                                  ? "bg-yellow-500"
                                                  : inscricao.votacao === "bom"
                                                  ? "bg-green-500"
                                                  : "bg-blue-500" // Para 'excelente'
                                              }`}
                                            >
                                              {inscricao.votacao
                                                .charAt(0)
                                                .toUpperCase() +
                                                inscricao.votacao.slice(1)}
                                            </span>
                                          </div>
                                        ) : (
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                            Breve descrição ou informação
                                            adicional sobre o projeto.
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
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
                  {/* <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">
                        Web Developer
                      </span>
                      <p>
                        <span className="text-gray-700 mr-2">
                          at ABC Company
                        </span>
                        <span className="text-gray-700">2017 - 2019</span>
                      </p>
                    </div>
                    <p className="mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed finibus est vitae tortor ullamcorper, ut vestibulum
                      velit convallis. Aenean posuere risus non velit egestas
                      suscipit.
                    </p>
                  </div> */}
                  {/* <div className="mb-6">
                    <div className="flex justify-between flex-wrap gap-2 w-full">
                      <span className="text-gray-700 font-bold">
                        Web Developer
                      </span>
                      <p>
                        <span className="text-gray-700 mr-2">
                          at ABC Company
                        </span>
                        <span className="text-gray-700">2017 - 2019</span>
                      </p>
                    </div>
                    <p className="mt-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed finibus est vitae tortor ullamcorper, ut vestibulum
                      velit convallis. Aenean posuere risus non velit egestas
                      suscipit.
                    </p>
                  </div> */}
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
