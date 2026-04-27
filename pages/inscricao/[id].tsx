import Head from "next/head"
import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { useRouter } from "next/router"
import { Toaster } from "react-hot-toast"
import { useFetchUser } from "../../lib/authContext"
import HeroSection from "../../components/HeroSection"
import FichaInscricaoForm from "../../components/Inscrever/FichaInscricaoForm"
import FichaTecnicaForm from "../../components/Inscrever/FichaTecnicaForm"
import EquipaForm from "../../components/Inscrever/EquipaForm"
import FileUploadSection from "../../components/Inscrever/FileUploadSection"
import { Inscricao, ParsedNavLink, FileLink, Categoria } from "../../types/strapi"
const qs = require("qs")

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

interface Props {
  social: any
  contato: any
  edicao: { data: { attributes: { categoria: Categoria[] } }[] }
  navbar: ParsedNavLink[]
  inscricao: { data: { id: number; attributes: Inscricao & { fileLink?: FileLink[] } } | null }
}

const Inscrever = ({ social, contato, edicao, navbar, inscricao }: Props) => {
  const { user } = useFetchUser()
  const router = useRouter()
  const { cd, cid } = router.query as { cd: string; cid: string }

  const attrs = inscricao.data?.attributes
  const categorias: Categoria[] = edicao?.data?.[0]?.attributes?.categoria ?? []
  const existingFiles: FileLink[] = attrs?.fileLink ?? []

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Para aceder a sua inscrição introduza o codigo que foi criado como participante do PNP"
        />
      </Head>

      <Toaster position="bottom-right" reverseOrder={false} />

      <HeroSection
        title={"PRÉMIO NACIONAL DE PUBLICIDADE"}
        subtitle="guarde seu codigo para aceder a sua inscrição mais tarde"
      />

      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block">
                Seu codigo é: <span className="bg-amarelo-ouro">{cd}</span>
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="p-11">
        <FichaInscricaoForm
          cid={cid}
          apiLink={api_link ?? ""}
          defaults={{
            nome_completo: attrs?.nome_completo,
            email: attrs?.email,
            sede: attrs?.sede,
            nif: attrs?.NIF,
            telefone: attrs?.telefone,
          }}
        />

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5"><div className="border-t border-gray-200" /></div>
        </div>

        <FichaTecnicaForm
          cid={cid}
          apiLink={api_link ?? ""}
          categorias={categorias}
          defaults={{
            categoria: attrs?.categoria,
            nome_projeto: attrs?.nome_projeto,
            con_criativo: attrs?.con_criativo,
          }}
        />

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5"><div className="border-t border-gray-200" /></div>
        </div>

        <EquipaForm
          cid={cid}
          apiLink={api_link ?? ""}
          defaults={{
            coord_prod: attrs?.coord_prod,
            dir_foto: attrs?.dir_foto,
            dir_art: attrs?.dir_art,
            realizador: attrs?.realizador,
            editor: attrs?.editor,
            autor_jingle: attrs?.autor_jingle,
            designer: attrs?.designer,
            outras_consideracoes: attrs?.outras_consideracoes,
            data_producao: attrs?.data_producao,
            data_divulgacao: attrs?.data_divulgacao,
            data_apresentacao_publica: attrs?.data_apresentacao_publica,
          }}
        />

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5"><div className="border-t border-gray-200" /></div>
        </div>

        <FileUploadSection
          cid={cid}
          apiLink={api_link ?? ""}
          existingFiles={existingFiles}
          onConfirm={() => router.reload()}
        />
      </div>
    </Layout>
  )
}

export default Inscrever

export async function getServerSideProps({ query }: { query: Record<string, string> }) {
  const { cid } = query

  if (!cid || isNaN(Number(cid))) {
    return { notFound: true }
  }

  const queri = qs.stringify({ sort: ["N_Edicao:desc"] }, { encodeValuesOnly: true })

  try {
    const inscricao = await fetcher(`${api_link}/api/inscricoes/${cid}?populate=deep`)

    if (!inscricao.data) {
      return { notFound: true }
    }

    const [rsocials, contato, edicao, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes?populate=deep&${queri}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const navbarLinks =
      navbar?.data?.flatMap((menu: any) =>
        menu?.attributes?.items?.data?.map((item: any) => ({
          name: item?.attributes?.title ?? "",
          link: item?.attributes?.url ?? "#",
        })) ?? []
      ) ?? []

    return {
      props: { social: rsocials, contato, edicao, navbar: navbarLinks, inscricao },
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return { notFound: true }
  }
}
