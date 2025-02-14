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

  console.log("inscricoesPorEdicao")
  console.log(inscricoesPorEdicao)

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
                  {/* inicio do section */}
                  <h2 className="text-xl font-bold mb-4">Área do Utilizador</h2>
                  {/* <HeroSection
                    title={`Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição`}
                    subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
                  /> */}
                  <p>area de dados</p>

                  {/* fim do section */}
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
