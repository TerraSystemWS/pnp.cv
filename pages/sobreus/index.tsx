import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import showdown from "showdown";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Sobreus = ({ social, contato, navbar, sobreus }: any) => {
  const { user, loading } = useFetchUser();
  const createMarkup = (values: any) => {
    // const values =
    const converter = new showdown.Converter();
    const html = converter.makeHtml(values);
    return { __html: html };
  };

  const sobreUs: any = createMarkup(sobreus.data.attributes.sobrepnp);

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Sobre Nos - Prémio Nacional De Publicidade"
        />
      </Head>
      {/* <pre>{JSON.stringify(parceirosOrganizacao, null, 2)}</pre> */}
      <section className="text-gray-600 body-font">
        <div className="">
          <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
              <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block text-amarelo-ouro">SOBRE NÓS</span>
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

export default Sobreus;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/menus?populate=deep`);
  // GET: dados do sobre Us
  const sobreus = await fetcher(`${api_link}/sobre-pnp?populate=deep`);
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

  // Pass data to the page via props
  return {
    props: { social: rsocials, contato, navbar: dlink, sobreus },
  };
}
