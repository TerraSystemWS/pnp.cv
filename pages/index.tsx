import Head from "next/head"
import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import Juri from "../components/Juri"
import Categorias from "../components/Categorias"
import { useRouter } from "next/router"
import { useFetchUser } from "../lib/authContext"
import { getStrapiMedia } from "../lib/utils"
import Banner from "../components/Banner"
import Projetos from "../components/Projetos"
import Inscrever from "../components/Inscrever"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Home = ({ social, contato, banners, edicao, navbar, error }: any) => {
  const router = useRouter()

  // Data processing for banners, juries, and categories
  const bannerData =
    banners?.data
      ?.filter(
        (value: any) => value.attributes.destaque && value.attributes.banners
      )
      .map((value: any, index: number) => ({
        id: index,
        title: value.attributes?.banners.titulo,
        url: value.attributes.banners.image.data.attributes.url,
      })) || []

  const Juris =
    edicao?.attributes?.juri?.map((value2: any, index2: number) => ({
      id: index2,
      idd: value2.id,
      edicao: edicao.attributes.N_Edicao,
      j_foto: value2.foto.data?.attributes.formats.medium.url || "/",
      j_nome: value2.nome,
      j_titulo: value2.titulo,
      j_descricao: value2.descricao,
    })) || []

  const Categoria =
    edicao?.attributes?.categoria?.map((categs: any, index3: number) => ({
      id: index3,
      titulo: categs.titulo,
      url: getStrapiMedia(categs.capa.data?.attributes.formats.small.url),
      slug: categs.titulo.replace(/ /g, "_"),
      descricao: categs.descricao,
    })) || []

  const { user } = useFetchUser()

  const goto = (link: string) => router.push(link)

  if (error) {
    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <p>There was an error fetching the data. Please try again later.</p>
      </Layout>
    )
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da atividade publicitária..."
        />
      </Head>

      <Banner dados={bannerData} />

      <div className="py-32 bg-gradient-to-r from-[#e6e2d8] via-white to-[#e6e2d8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-white mb-8">
            <span className="block text-[rgb(194,161,43)]">
              PRÉMIO NACIONAL DE PUBLICIDADE
            </span>
          </h2>
          <div className="font-light text-lg sm:text-xl text-gray-800 dark:text-gray-300 mb-16 leading-relaxed">
            O{" "}
            <span className="font-semibold text-[rgb(194,161,43)]">
              PRÉMIO NACIONAL DE PUBLICIDADE
            </span>{" "}
            tem como objetivo promover a atividade publicitária através do
            reconhecimento da qualidade dos trabalhos publicitários e
            institucionais veiculados. Este prêmio é dedicado a premiar aqueles
            que, com sua criatividade e originalidade, contribuem de forma
            significativa para o desenvolvimento do mercado publicitário em Cabo
            Verde.
          </div>
        </div>
      </div>

      <Categorias dados={Categoria} />

      <Projetos />

      <Juri dados={Juris} />

      <Inscrever />
    </Layout>
  )
}

export async function getServerSideProps() {
  const query = qs.stringify(
    { sort: ["N_Edicao:DESC"] },
    { encodeValuesOnly: true }
  )
  const queryBanner = qs.stringify(
    { sort: ["id:desc"] },
    { encodeValuesOnly: true }
  )

  try {
    const [rsocials, contato, banners, edicao, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(
        `${api_link}/api/banners?populate[0]=banners&populate[1]=banners.image&${queryBanner}`
      ),
      fetcher(`${api_link}/api/edicoes?_limit=1&populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const dlink = navbar.data.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    return {
      props: {
        social: rsocials,
        contato,
        banners,
        edicao: edicao?.data?.[0],
        navbar: dlink,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { props: { error: "Failed to fetch data" } }
  }
}

export default Home
