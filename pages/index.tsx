import Head from "next/head"
import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { HiInformationCircle } from "react-icons/hi"
import { Carousel, Alert } from "flowbite-react"
import Juri from "../components/Juri"
import Categorias from "../components/Categorias"
import Link from "next/link"
import { useRouter } from "next/router"
import { useFetchUser } from "../lib/authContext"
import { StrapiImage } from "../components/custom/StrapiImage"
import { getStrapiMedia } from "../lib/utils"
import Banner from "../components/Banner"
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

      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block text-amarelo-ouro">
                PRÉMIO NACIONAL DE PUBLICIDADE
              </span>
            </h2>
            <div className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
              O PRÉMIO NACIONAL DE PUBLICIDADE tem por objeto a promoção da
              atividade publicitária, através do reconhecimento da qualidade dos
              trabalhos publicitários e institucionais exibidos e veiculados,
              premiando os que, pela sua criatividade e originalidade,
              contribuem para o desenvolvimento do mercado publicitário em Cabo
              Verde.
            </div>
          </div>
        </div>
      </div>

      <Categorias dados={Categoria} />

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="text-center mb-20">
            <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-amarelo-ouro mb-4">
              PRÉMIO PÚBLICO DE PUBLICIDADE
            </h1>
            <p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
              O Prémio Público de Publicidade é uma das categorias do Prémio
              Nacional de Publicidade (PNP), em que a votação é feita somente
              pelo público, através da internet. Trata-se de um prémio da
              responsabilidade do PNP, com regulamento próprio, sem avaliação do
              júri, baseado apenas no critério da popularidade.
            </p>
          </div>
          <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
            <Alert color="info" icon={HiInformationCircle}>
              <span>
                <span className="font-medium">Info!</span> Disponivel somente no
                período de votação.
              </span>
            </Alert>
          </div>
          <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
            <Link
              href={"/projetos"}
              className="bg-amarelo-ouro text-center font-bold  font-bold text-branco hover:text-branco font-[Poppins] py-5 px-8 rounded hover:bg-castanho-claro 
						duration-500 n"
            >
              PROJETOS
            </Link>
          </div>
        </div>
      </section>

      <Juri dados={Juris} />

      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">Pronto para se inscrever?</span>
              <span className="block text-amarelo-ouro">
                Inscrições abertas de 1 a 31 de Janeiro de 2025
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/inscricao"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-amarelo-ouro px-5 py-3 text-base font-medium text-white hover:bg-castanho-claro"
                >
                  Inscrever
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/regulamentos"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Regulamentos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
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
