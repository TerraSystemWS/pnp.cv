import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import showdown from "showdown"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import qs from "qs"
import { useEffect } from "react"

// link to API URL
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Regulamentos = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()

  // Markdown converter function
  const createMarkup = (content: string) => {
    if (typeof content !== "string") {
      console.error("Error: Content is not a string.")
      return { __html: "" }
    }
    const converter = new showdown.Converter()
    return { __html: converter.makeHtml(content) }
  }

  // Map Regulations
  const Regulamentos = edicao.attributes.regulamentos.map(
    (regulamento: any, index: number) => ({
      id: index,
      titulo: regulamento.titulo,
      descricao: createMarkup(regulamento.descricao),
    })
  )

  // Map Categories
  const Categoria = edicao.attributes.categoria.map(
    (categoria: any, index: number) => ({
      id: index,
      titulo: categoria.titulo,
      slug: categoria.titulo.replace(/ /g, "_"),
      descricao: createMarkup(categoria.descricao),
    })
  )

  // Scroll behavior adjustment for anchor links
  useEffect(() => {
    // Adiciona um evento de rolagem para os links com âncoras
    const links = document.querySelectorAll('a[href^="#"]')

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId: any = link.getAttribute("href")?.substring(1)
        const targetElement: any = document.getElementById(targetId)

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 230, // Ajuste o valor conforme a altura do menu
            behavior: "smooth",
          })
        }
      })
    })
  }, [])

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>{`Regulamento - Prémio Nacional De Publicidade`}</title>
        <meta name="description" content={Regulamentos[0]?.titulo || " "} />
      </Head>

      <section className="bg-gradient-to-r from-[#e6e2d8] via-[#dbdbdb] to-[#e6e2d8] py-12 px-6 sm:px-12 ">
        <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent mb-8 text-center leading-tight bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
          <span>{Regulamentos[0]?.titulo}</span>
        </h2>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="py-8">
            <div className="leading-relaxed text-xl text-gray-800">
              <span dangerouslySetInnerHTML={Regulamentos[0]?.descricao} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-600 body-font">
        <h1 className="mb-10 text-5xl font-extrabold text-gray-800 text-center mt-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-transparent bg-clip-text pt-10">
          Categorias de Prémios
        </h1>

        <div className="bg-white shadow max-w-7xl mx-auto px-6 sm:px-12 py-24 flex">
          {/* Box fixo à esquerda com links para as categorias */}
          <div className="w-64 fixed top-32 left-1 z-5 bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out ">
            <h2 className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text mb-4 uppercase">
              Categorias
            </h2>

            <ul className="space-y-3">
              {Categoria.map((category) => (
                <li key={category.id} className="group relative">
                  <a
                    href={`#${category.slug}`}
                    className="text-lg text-gray-800 hover:text-yellow-500 transition-colors duration-300 group-hover:pl-2"
                  >
                    {category.titulo}
                  </a>
                  <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
                </li>
              ))}
            </ul>
          </div>

          {/* Seção principal com conteúdo das categorias */}
          <div className="w-full">
            <div className="divide-y-4 divide-gray-300">
              {Categoria.map((category) => (
                <div
                  key={category.id}
                  className="py-16 flex flex-wrap md:flex-nowrap gap-12"
                >
                  <div className="md:flex-grow bg-white p-12 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                    <h2 className="text-4xl font-bold text-transparent title-font mb-4 text-center tracking-wide bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text">
                      <a
                        id={category.slug}
                        className="hover:text-amarelo-ouro transition-colors duration-300"
                      >
                        {category.titulo}
                      </a>
                    </h2>

                    <div className="leading-relaxed text-lg text-gray-800">
                      <span dangerouslySetInnerHTML={category.descricao} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
