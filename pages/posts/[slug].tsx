import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Link from "next/link"
import Head from "next/head"
import { StrapiImage } from "../../components/custom/StrapiImage"
import { formatDateTime } from "../../lib/utils"
import { useFetchUser } from "../../lib/authContext"
import { IoArrowBack, IoArrowForward } from "react-icons/io5" // Importando os ícones do react-icons/io5

interface PostDetailProps {
  social: any
  contato: any
  post: any
  navbar: any
  previousPost: any
  nextPost: any
}

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const PostDetail = ({
  social,
  contato,
  post,
  navbar,
  previousPost,
  nextPost,
}: PostDetailProps) => {
  const { user, loading } = useFetchUser()

  const { Titulo, subtitulo, publishedAt, capa, descricao } =
    post.data.attributes

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>{Titulo} - Blog | Prémio Nacional de Publicidade</title>
        <meta name="description" content={subtitulo} />
      </Head>

      <article className="bg-gradient-to-r from-[#f5f5f5] via-white to-[#f5f5f5] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Título do Post */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            {Titulo}
          </h1>

          {/* Subtítulo e Data de Publicação */}
          <div className="text-lg text-gray-500 mb-8">
            <span className="italic">{subtitulo}</span>Publicado em:{" "}
            <span className="font-medium">{formatDateTime(publishedAt)}</span>
          </div>

          {/* Imagem do Post */}
          <div className="mb-8">
            <StrapiImage
              src={capa.data?.attributes.url}
              width={1000}
              height={500}
              alt={Titulo}
              className="w-full h-auto rounded-xl shadow-lg"
            />
          </div>

          {/* Conteúdo do Post */}
          <div className="prose prose-lg text-gray-700 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: descricao }}></p>
          </div>

          {/* Botões de Navegação */}
          <div className="mt-10 flex justify-between items-center">
            {/* Botão Anterior */}
            {previousPost && (
              <Link href={`/posts/${previousPost.id}`}>
                <span className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer">
                  <IoArrowBack className="w-5 h-5 mr-2" />
                  Notícia Anterior
                </span>
              </Link>
            )}

            {/* Botão Voltar para Notícias */}
            <Link href="/posts">
              <span className="inline-flex items-center px-6 py-3 border-2 border-yellow-500 text-black bg-white rounded-lg text-lg font-semibold shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer">
                Notícias
              </span>
            </Link>

            {/* Botão Próxima */}
            {nextPost && (
              <Link href={`/posts/${nextPost.id}`}>
                <span className="inline-flex items-center px-6 py-3 bg-yellow-500 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 cursor-pointer">
                  Próxima Notícia
                  <IoArrowForward className="w-5 h-5 mr-2" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>
    </Layout>
  )
}

export async function getServerSideProps(context: any) {
  try {
    const { slug } = context.params
    const [rsocials, contato, post, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(
        `${api_link}/api/noticias/${slug}?populate[0]=noticias&populate[1]=capa`
      ),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const dlink = navbar.data?.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    // Fetch the previous and next posts
    const previousPost = await fetcher(
      `${api_link}/api/noticias?filters[publishedAt][$lt]=${post.data.attributes.publishedAt}&_limit=1&_sort=publishedAt:desc`
    )
    const nextPost = await fetcher(
      `${api_link}/api/noticias?filters[publishedAt][$gt]=${post.data.attributes.publishedAt}&_limit=1&_sort=publishedAt:asc`
    )

    return {
      props: {
        social: rsocials,
        contato,
        post,
        navbar: dlink,
        previousPost:
          previousPost.data.length > 0 ? previousPost.data[0] : null,
        nextPost: nextPost.data.length > 0 ? nextPost.data[0] : null,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { props: { error: "Failed to fetch data" } }
  }
}

export default PostDetail
