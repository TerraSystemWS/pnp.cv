import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import qs from "qs"
import CategBox from "../components/CategBox"
import HeroSection from "../components/HeroSection"
import { useState } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Regulamentos = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()

  const createMarkup = (content: string) => {
    if (typeof content !== "string") {
      console.error("Error: Content is not a string.")
      return { __html: "" }
    }
    const converter = new showdown.Converter()
    return { __html: converter.makeHtml(content) }
  }

  const Regulamentos = edicao.attributes.regulamentos.map(
    (regulamento: any, index: number) => ({
      id: index,
      titulo: regulamento.titulo,
      descricao: createMarkup(regulamento.descricao),
    })
  )

  const Categoria = edicao.attributes.categoria.map(
    (categoria: any, index: number) => ({
      id: index,
      titulo: categoria.titulo,
      slug: categoria.titulo.replace(/ /g, "_"),
      descricao: createMarkup(categoria.descricao),
    })
  )

  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState<"regulamentos" | "categorias">(
    "regulamentos"
  )

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>{`Regulamento - Prémio Nacional De Publicidade`}</title>
        <meta name="description" content={Regulamentos[0]?.titulo || " "} />
      </Head>

      <HeroSection
        title={Regulamentos[0]?.titulo}
        subtitle={"Tudo sobre a recente edição do PNP"}
      />

      <section className="bg-gradient-to-r from-[#f2f0eb] via-[#e3e3e3] to-[#f2f0eb] py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-6 sm:py-8 md:py-12">
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-3 text-lg font-semibold rounded-md ${
                  activeTab === "regulamentos"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("regulamentos")}
              >
                Regulamentos
              </button>
              <button
                className={`px-6 py-3 text-lg font-semibold rounded-md ml-4 ${
                  activeTab === "categorias"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("categorias")}
              >
                Categorias
              </button>
            </div>

            {activeTab === "regulamentos" && (
              <div className="leading-relaxed text-lg sm:text-xl md:text-2xl text-gray-800 font-serif">
                <span dangerouslySetInnerHTML={Regulamentos[0]?.descricao} />
              </div>
            )}

            {activeTab === "categorias" && (
              <div className="rounded-xl max-w-7xl mx-auto px-6 sm:px-12 py-24 flex flex-wrap gap-12">
                <div className="w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 px-4 sm:px-6 lg:px-8">
                    {Categoria.map((category: any) => (
                      <div
                        key={category.id}
                        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
                      >
                        <h2 className="text-2xl sm:text-3xl font-bold text-transparent title-font mb-6 text-center tracking-wide bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
                          <a
                            id={category.slug}
                            className="hover:text-orange-600 transition-colors duration-300"
                          >
                            {category.titulo}
                          </a>
                        </h2>

                        <div className="leading-relaxed text-lg text-gray-700 mb-4">
                          <span dangerouslySetInnerHTML={category.descricao} />
                        </div>

                        {/* <div className="text-center">
                          <a
                            href={`#${category.slug}`}
                            className="inline-block px-6 py-3 mt-4 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-300 ease-in-out"
                          >
                            Ver Mais
                          </a>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Regulamentos

export async function getServerSideProps() {
  const query = qs.stringify(
    { sort: ["N_Edicao:DESC"] },
    { encodeValuesOnly: true }
  )

  const [rsocials, contato, edicaoResponse, navbarResponse] = await Promise.all(
    [
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?_limit=1&populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ]
  )

  const edicao = edicaoResponse?.data?.[0] || null
  const navbar =
    navbarResponse?.data?.flatMap((menu: any) =>
      menu.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    ) || []

  return {
    props: {
      social: rsocials,
      contato,
      edicao,
      navbar,
    },
  }
}
