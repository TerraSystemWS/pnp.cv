import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar";
import showdown from "showdown";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const SobreusPolicy = ({ social, contato, navbar, sobreus }: any) => {
  const createMarkup = (values: any) => {
    // const values =
    const converter = new showdown.Converter();
    const html = converter.makeHtml(values);
    return { __html: html };
  };

  const sobreUs: any = createMarkup(sobreus.data.attributes.politica);

  const { user, loading } = useFetchUser();
  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Politica de Privacidade - Prémio Nacional De Publicidade"
        />
      </Head>
      {/* <pre>{JSON.stringify(parceirosOrganizacao, null, 2)}</pre> */}
      <section className="text-gray-600 body-font">
        <div className="">
          <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
              <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block text-amarelo-ouro">
                  POLÍTICA DE PRIVACIDADE
                </span>
              </h2>
            </div>
          </div>
        </div>
        <div className="container mx-auto py-5 mx-10">
          <div className="text-lg font-medium ">
            <div dangerouslySetInnerHTML={sobreUs}></div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SobreusPolicy;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  const results = await Promise.allSettled([
    fetcher(`${api_link}/api/contato`),
    fetcher(`${api_link}/api/menus?populate=deep`),
    fetcher(`${api_link}/api/sobre-pnp?populate=deep`),
  ])
  const [contato, menus, sobreus] = results.map((r: any) => {
    if (r.status === 'fulfilled') return r.value
    console.error('Endpoint failed:', r.reason)
    return null
  })

  return {
    props: {
      social: parseNavbar(menus, "redes-social"),
      contato: contato ?? null,
      navbar: parseNavbar(menus, "menus"),
      sobreus: sobreus ?? null,
    },
  };
}
