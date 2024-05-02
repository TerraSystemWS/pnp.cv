import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import {StrapiImage} from "../../components/custom/StrapiImage"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;



const PostList = ({ social, contato, posts, navbar }) => {

    // posts.data?.map((post:any) => {
    //     console.log(post.attributes.capa.data?.attributes.url)
    // })

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar}>
      <Head>
        <title>Blog - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Aqui pode encontrar postagens e arquivos relacionados ao PNP e muito mais"
        />
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 grid grid-cols-4 gap-8">
          {/* Notícias Principais */}
          <div className="col-span-3">
            {/* <div className="grid gap-8">
              {posts.data?.map((post, index) => (
                <article
                  key={index}
                  className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between items-center mb-5 text-gray-500">
                    <span className="text-sm">{post.attributes.publishedAt}</span>
                  </div>
                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <Link href={`/posts/${post.id}`}>
                      {post.attributes.Titulo}
                    </Link>
                  </h2>
                  <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
                    <span dangerouslySetInnerHTML={{
                      __html: post.attributes.descricao.substring(0, 200),
                    }}></span>
                  </p>
                  <div className="flex justify-between items-center">
                    <Link href={`/posts/${post.id}`} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
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
            </div> */}
            <div className="grid gap-8">
  {posts.data && posts.data.map((post, index) => ( //?.slice(3).
    <article
      key={index}
      className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700 flex"
    >
      {/* Capa do post */}
      <div className="flex-shrink-0 w-1/3 mr-4">
        <StrapiImage
        //   src={post.attributes.capa.data.attributes.url || ' '} // Substitua pelo link da imagem da capa do post
          src={post.attributes.capa && post.attributes.capa.data ? post.attributes.capa.data.attributes.url : `https://placehold.co/${300}x${300}`}
          alt={post.attributes.Titulo}
          height={300}
          width={300}
          className="w-full h-auto rounded-lg"
        />
      </div>
      {/* Conteúdo do post */}
      <div className="w-2/3">
        <div className="mb-5 text-gray-500">
          <span className="text-sm">{post.attributes.publishedAt}</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          <Link href={`/posts/${post.id}`}>
            {post.attributes.Titulo}
          </Link>
        </h2>
        <p className="mb-5 font-light text-gray-500 dark:text-gray-400">
          <span dangerouslySetInnerHTML={{
            __html: post.attributes.descricao.substring(0, 200),
          }}></span>
        </p>
        <div className="flex justify-between items-center">
          <Link href={`/posts/${post.id}`} className="inline-flex items-center font-medium text-primary-600 dark:text-primary-500 hover:underline">
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
          {/* Outras Notícias */}
          <div className="col-span-1">
            <div className="grid gap-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Outras Notícias</h3>
              {posts.data?.map((post: any, index: any) => (
                <article
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <h4 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  <Link href={`/posts/${post.id}`}>
                      {post.attributes.Titulo}
                    </Link>
                  </h4>
                  {/* <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ullamcorper dolor sed mauris tempus, et ultricies erat vestibulum. Sed at lorem vel mi ultrices vehicula.</p> */}
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span dangerouslySetInnerHTML={{
                      __html: post.attributes.descricao.substring(0, 50),
                    }}></span>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Publicado em: {post.attributes.publishedAt}</span>
                    <Link href={`/posts/${post.id}`} className="font-medium text-primary-600 dark:text-primary-500 hover:underline">
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
      </section>
    </Layout>
  );
};

export default PostList;

export async function getServerSideProps() {
  try {
    const [rsocials, contato, posts, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      // http://localhost:1337/api/noticias?populate[0]=noticias&populate[1]=capa
      fetcher(`${api_link}/api/noticias?populate[0]=noticias&populate[1]=capa`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ]);

    const dlink = navbar.data?.flatMap((value) =>
      value.attributes.items.data.map((item) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    );

    return { props: { social: rsocials, contato, posts, navbar: dlink } };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { error: "Failed to fetch data" } };
  }
}
