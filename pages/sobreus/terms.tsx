import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const SobreusTerms = ({ social, contato, navbar }: any) => {
  //dados do grupo de parceiros;

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
      </Head>
      {/* <pre>{JSON.stringify(parceirosOrganizacao, null, 2)}</pre> */}
      <section className="text-gray-600 body-font">
        <div className="">
          <div className="bg-gray-50">
            <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
              <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block text-amarelo-ouro">
                  TERMOS DE SERVIÇO
                </span>
              </h2>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SobreusTerms;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
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

  // Pass data to the page via props
  return {
    props: { social: rsocials, contato, navbar: dlink },
  };
}
