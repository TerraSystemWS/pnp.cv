import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const PostList = ({ social, contato, posts, navbar }: any) => {
  const { user, loading } = useFetchUser();
  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Blog - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Aqui pode encontar postagens e arquivos relacionado ao pnp e muito
          mais"
        />
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
            <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Nosso Blog
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              Aqui pode encontar postagens e arquivos relacionado ao pnp e muito
              mais
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {posts.data.map((value: any, index: any) => (
              <article
                key={index}
                className="p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-5 text-gray-500">
                  <span className="bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded dark:bg-primary-200 dark:text-primary-800">
                    {/* <svg
											className="mr-1 w-3 h-3"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
										</svg>
										Tutorial */}
                  </span>
                  <span className="text-sm">
                    {value.attributes.publishedAt}
                  </span>
                </div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  <a href="#">{value.attributes.Titulo}</a>
                </h2>
                <p
                  className="mb-5 font-light text-gray-500 dark:text-gray-400"
                  dangerouslySetInnerHTML={{
                    __html: value.attributes.descricao.substring(0, 200),
                  }}
                ></p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    {/* <img
											className="w-7 h-7 rounded-full"
											src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
											alt="Jese Leos avatar"
										/> */}
                    {/* <span className="font-medium dark:text-white">
											Jese Leos
										</span> */}
                  </div>
                  <Link
                    href={`/posts/${value.id}`}
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
                        fill-rule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PostList;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados para posts
  const posts = await fetcher(`${api_link}/posts?populate=*`);
  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/menus?populate=deep`);
  //get links for menu
  let dlink: any = [];
  navbar.data.map((value: any) => {
    value.attributes.items.data.map((value: any, index: any) => {
      // value.attributes.title;
      // value.attributes.url;
      // console.log(value);
      dlink[index] = {
        name: value.attributes.title,
        link: value.attributes.url,
      };
    });
  });
  // console.log(banners.attributes);

  // Pass data to the page via props
  return { props: { social: rsocials, contato, posts, navbar: dlink } };
}
