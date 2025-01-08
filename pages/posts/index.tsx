import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Link from "next/link"
import Head from "next/head"
import { StrapiImage } from "../../components/custom/StrapiImage"
import { useFetchUser } from "../../lib/authContext"
import { formatDateTime } from "../../lib/utils"
import { useState } from "react"
import HeroSection from "../../components/HeroSection"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const PostList = ({ social, contato, posts, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 4 // After the first 6, paginate remaining posts

  // Total available posts, excluding the first 6 (2 for the main area, 4 for sidebar)
  const totalPosts = posts.data.length - 6
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Get the posts for pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPaginatedPosts = posts.data.slice(
    6 + indexOfFirstPost,
    6 + indexOfLastPost
  )

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Blog - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Aqui pode encontrar postagens e arquivos relacionados ao PNP e muito mais"
        />
      </Head>

      <HeroSection
        title={"Notícias"}
        subtitle={"Fique por dentro das últimas atualizações e novidades!"}
      />

      <section className="bg-white dark:bg-gray-900 py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main News - First two posts */}
          <div className="lg:col-span-3">
            <div className="grid gap-8">
              {posts.data.slice(0, 2).map((post: any) => (
                <article
                  key={post.id}
                  className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col lg:flex-row hover:shadow-lg transition-shadow"
                >
                  {/* Post Cover */}
                  <div className="w-full lg:w-1/3 mb-4 lg:mr-4">
                    <Link href={`/posts/${post.id}`}>
                      <StrapiImage
                        src={post.attributes.capa?.data?.attributes.url}
                        alt={post.attributes.Titulo}
                        width={300}
                        height={200}
                        className="w-full h-auto rounded-lg object-cover"
                      />
                    </Link>
                  </div>
                  {/* Post Content */}
                  <div className="w-full lg:w-2/3">
                    <div className="mb-5 text-gray-500">
                      <span className="text-sm">
                        {formatDateTime(post.attributes.publishedAt)}
                      </span>
                    </div>
                    <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                      <Link href={`/posts/${post.id}`}>
                        {post.attributes.Titulo}
                      </Link>
                    </h2>
                    <p className="mb-5 text-gray-500 dark:text-gray-400">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: post.attributes.descricao.substring(0, 200),
                        }}
                      ></span>
                    </p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/posts/${post.id}`}
                        className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline"
                      >
                        Ler mais
                        <svg
                          className="ml-2 w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar News - Next four posts */}
          <div className="lg:col-span-1">
            <div className="grid gap-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Outras Notícias
              </h3>
              {posts.data.slice(2, 6).map((post: any) => (
                <article
                  key={post.id}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                    <Link href={`/posts/${post.id}`}>
                      {post.attributes.Titulo}
                    </Link>
                  </h4>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: post.attributes.descricao.substring(0, 50),
                      }}
                    ></span>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Publicada em:{" "}
                      {formatDateTime(post.attributes.publishedAt)}
                    </span>
                    <Link
                      href={`/posts/${post.id}`}
                      className="font-medium text-primary-600 dark:text-primary-500 hover:underline"
                    >
                      Ler mais
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination for remaining posts */}
        <div className="flex justify-center items-center mt-8 py-6 px-4 bg-yellow-500 rounded-lg shadow-xl space-x-4">
          {/* Previous Button */}
          <button
            className="px-8 py-3 text-xl font-semibold text-white bg-yellow-600 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {/* Page Info */}
          <span className="text-xl font-semibold text-white">
            Página {currentPage} de {totalPages}
          </span>

          {/* Next Button */}
          <button
            className="px-8 py-3 text-xl font-semibold text-white bg-yellow-600 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </section>
    </Layout>
  )
}

export default PostList

export async function getServerSideProps() {
  try {
    const [rsocials, contato, posts, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(
        `${api_link}/api/noticias?sort[0]=publishedAt:desc&populate[0]=noticias&populate[1]=capa`
      ),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const dlink = navbar.data?.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    return { props: { social: rsocials, contato, posts, navbar: dlink } }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { props: { error: "Failed to fetch data" } }
  }
}
