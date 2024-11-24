import Head from "next/head"
import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import Juri from "../components/Juri"
import Categorias from "../components/Categorias"
// import Link from "next/link"
import { useRouter } from "next/router"
import { useFetchUser } from "../lib/authContext"
// import { StrapiImage } from "../components/custom/StrapiImage"
import { getStrapiMedia } from "../lib/utils"
import Banner from "../components/Banner"
import Projetos from "../components/Projetos"
import Inscrever from "../components/Inscrever"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

export default function Home({
  social,
  contato,
  banners,
  edicao,
  navbar,
  error,
}: any) {
  const router = useRouter()

  let bannerData: any = []
  let Juris: any = []
  let Categoria: any = []

  if (banners && banners.data) {
    banners.data.map((value: any, index: any) => {
      if (value.attributes.destaque && value.attributes.banners) {
        bannerData[index] = {
          id: index,
          title: value.attributes?.banners.titulo,
          url: value.attributes.banners.image.data.attributes.url,
        }
      }
    })
  }

  if (edicao && edicao.attributes && edicao.attributes.juri) {
    edicao.attributes.juri.map((value2: any, index2: any) => {
      Juris[index2] = {
        id: index2,
        idd: value2.id,
        edicao: edicao.attributes.N_Edicao,
        j_foto: value2.foto.data?.attributes.formats.medium.url || "/",
        j_nome: value2.nome,
        j_titulo: value2.titulo,
        j_descricao: value2.descricao,
      }
    })
  }

  if (edicao && edicao.attributes && edicao.attributes.categoria) {
    edicao.attributes.categoria.map((categs: any, index3: any) => {
      Categoria[index3] = {
        id: index3,
        titulo: categs.titulo,
        url: getStrapiMedia(categs.capa.data?.attributes.formats.small.url),
        slug: categs.titulo.replace(/ /g, "_"),
        descricao: categs.descricao,
      }
    })
  }

  const goto = (link: string) => {
    router.push(link)
  }

  const { user, loading } = useFetchUser()

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da
              atividade publicitária, através do reconhecimento da qualidade dos
              trabalhos publicitários e institucionais exibidos e veiculados,
              premiando os que pela sua criatividade e originalidade contribuem
              para o desenvolvimento do mercado publicitário em Cabo Verde."
        />
      </Head>

      <Banner dados={bannerData} />

      {/* <div className="-mt-2">
        <div className="h-56 md:h-screen z-0">
          <Carousel>
            {bannerData.map((value: any) => (
              <StrapiImage
                key={value.id}
                src={value.url}
                alt={value.title}
                width={1024}
                height={500}
                className="cursor-pointer"
              />
            ))}
          </Carousel>
        </div>
      </div> */}

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl text-center font-extrabold tracking-tight text-white mb-8">
            <span className="block  text-[rgb(194,161,43)]">
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
    {
      sort: ["N_Edicao:DESC"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  )

  const queryBanner = qs.stringify(
    {
      sort: ["id:desc"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
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
        edicao: edicao && edicao.data && edicao.data[0],
        navbar: dlink,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { props: { error: "Failed to fetch data" } }
  }
}
