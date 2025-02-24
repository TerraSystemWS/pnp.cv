import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
// import Link from "next/link"
import Head from "next/head"
// import { StrapiImage } from "../../components/custom/StrapiImage"
import { useFetchUser } from "../../lib/authContext"
// import { formatDateTime } from "../../lib/utils"
import { useState, useEffect } from "react"
import qs from "qs"
// import HeroSection from "../../components/HeroSection"
import { useRouter } from "next/router"
import UserProfileCard from "../../components/custom/sidemenu"
import { getTokenFromLocalCookie } from "../../lib/auth"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// import React, { useState, useEffect } from "react";

const Avaliacao = ({
  edicoes,
  social,
  contato,
  navbar,
  inscritos,
  avaliacoes,
  totalPages,
  currentPage,
}: any) => {
  const { user, loading } = useFetchUser()
  const router = useRouter()

  // Estado para armazenar os nomes dos usuários
  const [userNames, setUserNames] = useState<{ [key: number]: string }>({})

  // Verifica se o usuário está logado e redireciona para a home caso contrário
  useEffect(() => {
    if (!loading && !user) {
      router.push("/") // Redirecionar para a página inicial (home)
    }
  }, [user, loading, router])

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
  }) // Dependência para buscar os nomes sempre que `categorias` mudar

  // Agrupando avaliações por categoria e projeto
  const categorias: any = {}
  avaliacoes.data.forEach((avaliacao: any) => {
    const nomeProjeto =
      avaliacao.attributes.inscricoe.data.attributes.nome_projeto
    const categoria = avaliacao.attributes.inscricoe.data.attributes.categoria

    if (!categorias[categoria]) {
      categorias[categoria] = {}
    }

    if (!categorias[categoria][nomeProjeto]) {
      categorias[categoria][nomeProjeto] = {
        usuarios: [],
      }
    }

    categorias[categoria][nomeProjeto].usuarios.push({
      id: avaliacao.attributes.user_id.data.id,
      nota: avaliacao.attributes.notas,
    })
  })

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
                  <h2 className="text-xl font-bold mb-4">
                    Resultados das Avaliações
                  </h2>
                  <section className="py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        Avaliações Realizadas
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Object.keys(categorias).map((categoria) => (
                          <div key={categoria} className="mb-8">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                              {categoria}
                            </h3>

                            {Object.keys(categorias[categoria]).map(
                              (nomeProjeto) => {
                                const { usuarios } =
                                  categorias[categoria][nomeProjeto]
                                const totalUsuarios = usuarios.length

                                return (
                                  <div
                                    key={nomeProjeto}
                                    className="bg-white p-6 rounded-lg shadow-lg mb-6"
                                  >
                                    <h4 className="text-xl font-semibold mb-4">
                                      {nomeProjeto}
                                    </h4>

                                    <p className="text-sm font-semibold mb-4 text-gray-500">
                                      {totalUsuarios} Avaliações
                                    </p>

                                    <ul className="text-sm text-gray-600">
                                      {usuarios.map(
                                        (usuario: any, index: any) => {
                                          const userName =
                                            userNames[usuario.id] ||
                                            "Carregando..." // Atraso no nome, pode mostrar "Carregando..."
                                          return (
                                            <li
                                              key={index}
                                              className="mb-2 flex justify-between items-center"
                                            >
                                              <span>
                                                {/* ID: {usuario.id} - Usuário{" "} */}
                                                Juri #{usuario.id}: {userName}
                                              </span>

                                              <span
                                                className={`px-3 py-1  rounded-full text-white ${
                                                  usuario.nota ===
                                                    "insuficiente" ||
                                                  usuario.nota ===
                                                    "Insuficiente"
                                                    ? "bg-red-400"
                                                    : usuario.nota ===
                                                      "Suficiente"
                                                    ? "bg-yellow-400"
                                                    : usuario.nota === "Bom"
                                                    ? "bg-blue-400"
                                                    : "bg-green-400"
                                                }`}
                                              >
                                                {usuario.nota}
                                              </span>
                                            </li>
                                          )
                                        }
                                      )}
                                    </ul>
                                  </div>
                                )
                              }
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
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
    const [edicoes, rsocials, contato, navbar, inscritos, avaliacoes] =
      await Promise.all([
        fetcher(
          `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${queri}`
        ),
        fetcher(`${api_link}/api/redes-social?populate=*`),
        fetcher(`${api_link}/api/contato`),
        fetcher(`${api_link}/api/menus?populate=deep`),
        fetcher(`${api_link}/api/inscricoes?populate=*`), // Certifique-se de que as inscrições também estão sendo populadas
        fetcher(
          `${api_link}/api/avaliacaos?populate[user_id][fields]=id&[populate][inscricoe][fields]=*&pagination[page]=1&pagination[pageSize]=500`
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
        avaliacoes,
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
        avaliacoes: [],
        totalPages: 1,
        currentPage: 1,
      },
    }
  }
}
