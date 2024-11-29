import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Link from "next/link"
import Head from "next/head"
import { Alert } from "flowbite-react"
import { IoCall } from "react-icons/io5"
import { HiInformationCircle } from "react-icons/hi"
import Image from "next/image"
import { useFetchUser } from "../../lib/authContext"

// link to API endpoint
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Vpublica = ({ social, contato, inscritos, navbar }: any) => {
  const { user, loading } = useFetchUser()

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Trabalhos Concorentes - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Projetos Concorentes aos Premios - Prémio Nacional De Publicidade"
        />
      </Head>

      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          {/* Conditional User Display */}
          <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
              {user ? "Avaliação Dos Jurados" : "Votação Pública"}
            </h2>
            <p className="font-light text-justify text-gray-500 sm:text-xl dark:text-gray-400">
              O Prémio Público de Publicidade é uma das categorias do Prémio
              Nacional de Publicidade (PNP) em que a votação é feita somente
              pelo público, através da Internet. Trata-se de um prémio da
              responsabilidade do PNP, com regulamento próprio, sem avaliação do
              júri, baseado apenas no critério de popularidade.
            </p>
          </div>

          {/* Competitor Projects Header */}
          <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
              Projetos Concorentes a {"?"} Edição
            </h2>
          </div>

          {/* Alert for Voting Period */}
          <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
            <Alert color="warning" icon={HiInformationCircle}>
              <span>
                <span className="font-medium">Info!</span> Disponível somente no
                período de votação.
              </span>
            </Alert>
          </div>

          {/* Project Cards Display */}
          <div className="grid grid-row md:grid-cols-2 gap-4">
            {inscritos.data.map((value: any, index: number) => (
              <div
                key={index}
                className="flex font-sans shadow-2xl border-b border-slate-200"
              >
                <form className="flex-auto p-6">
                  {/* Project Info */}
                  <div className="flex flex-wrap">
                    <Link href={`/projetos/${value.id}`}>
                      <h1 className="flex-auto text-lg font-semibold text-slate-900">
                        {value.attributes.nome_projeto}
                      </h1>
                    </Link>
                    <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
                      {value.attributes.nome_completo}
                      <p>
                        <IoCall /> {value.attributes.telefone}
                      </p>
                    </div>
                  </div>

                  {/* Creative Concept */}
                  <div className="flex items-baseline mt-4 mb-6 pb-6 border-b border-slate-200">
                    <p>{value.attributes?.con_criativo?.substring(0, 536)}</p>
                  </div>

                  {/* Action Button */}
                  <div className="flex space-x-4 mb-6 text-sm font-medium">
                    <Link
                      href={`/projetos/${value.id}`}
                      className="bg-amarelo-ouro text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro duration-500"
                    >
                      Detalhes
                    </Link>
                  </div>
                </form>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Vpublica

// Server-Side Data Fetching
export async function getServerSideProps() {
  // Fetch data from external API

  // GET: Social media links
  const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`)
  // GET: Contact data
  const contato = await fetcher(`${api_link}/api/contato`)
  // GET: Navbar data
  const navbar = await fetcher(`${api_link}/api/menus?populate=deep`)
  // GET: Registered projects for competition
  const inscritos = await fetcher(`${api_link}/api/inscricoes`)

  // Parse Navbar items into an array of links
  const dlink =
    navbar.data?.flatMap((menuItem: any) =>
      menuItem.attributes.items.data.map((linkItem: any) => ({
        name: linkItem.attributes.title,
        link: linkItem.attributes.url,
      }))
    ) || []

  // Return the data as props
  return { props: { social: rsocials, contato, navbar: dlink, inscritos } }
}
