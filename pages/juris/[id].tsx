import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Image from "next/image";
import { useRouter } from "next/router";
import showdown from "showdown";
import Link from "next/link";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Juris = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser();
  const router = useRouter();
  const { id } = router.query;
  console.log("router");
  console.log(router.query.edicao);
  const createMarkup = (values: any) => {
    // const values =
    const converter = new showdown.Converter();
    const html = converter.makeHtml(values);
    return { __html: html };
  };
  // dados do juri
  let JurisA: any = [];
  let JurisList: any = [];
  // let N_juris: any = [];

  // create Juris objetct
  edicao.data.map((value: any, index: any) => {
    value.attributes.juri.map((value2: any, index2: any) => {
      // console.log("value2.id");
      // console.log(value2.id);

      if (id == value2.id) {
        JurisA[index2] = {
          id: index2 || " ",
          edicao: value.attributes?.N_Edicao || " ",
          j_foto: value2.foto.data?.attributes.formats.medium.url || null,
          j_nome: value2?.nome || " ",
          j_titulo: value2?.titulo || " ",
          j_descricao: createMarkup(value2?.descricao),
        };
      }

      if (id != value2.id && router.query.edicao == value.attributes.N_Edicao) {
        JurisList[index2] = {
          id: index2 || " ",
          idd: value2?.id || " ",
          edicao: value?.attributes?.N_Edicao || " ",
          j_foto: value2?.foto.data?.attributes?.formats.medium.url || null,
          j_nome: value2?.nome || " ",
          j_titulo: value2?.titulo || " ",
          j_descricao: createMarkup(value2?.descricao),
        };
      }
    });
  });

  let Juris = JurisA.filter((n: any) => n);
  // console.log(JurisList);

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title> {Juris[0].j_nome} - Prémio Nacional De Publicidade</title>
      </Head>
      <h1 className="text-4xl font-medium text-gray-700 text-center pt-2">
        {" "}
        Júri da {Juris[0]?.edicao}ª Edição
      </h1>{" "}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto flex flex-col">
          <div className="lg:w-4/6 mx-auto">
            <div className="flex flex-col sm:flex-row mt-10">
              <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                <div className="w-50 h-50 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
                  <Image
                    src={Juris[0].j_foto}
                    alt={Juris[0].j_nome}
                    width={150}
                    height={150}
                    className="w-50 h-50 rounded-full"
                  />
                </div>
                <div className="flex flex-col items-center text-center justify-center">
                  <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">
                    {Juris[0].j_nome}
                  </h2>
                  <div className="w-12 h-1 bg-amarelo-ouro rounded mt-2 mb-4"></div>
                  <p className="text-base">{Juris[0].j_titulo}</p>
                </div>
              </div>
              <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                <div
                  className="leading-relaxed text-lg mb-4"
                  dangerouslySetInnerHTML={Juris[0].j_descricao}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* next juris */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {JurisList.map((value: any, index: any) => (
              <div key={index} className="lg:w-1/3 sm:w-1/2 p-4 z-0">
                <Link href={`/juris/${value.idd}?edicao=${value.edicao}`}>
                  <div className="flex relative">
                    <Image
                      alt="gallery"
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      src={value.j_foto}
                      width={600}
                      height={360}
                    />
                    <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                      <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
                        {value.edicao}ª Edição
                      </h2>

                      <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                        {value.j_nome}
                      </h1>
                      <p className="leading-relaxed">{value.j_titulo}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Juris;

// This gets called on every request
export async function getServerSideProps({ params, query }: any) {
  // Fetch data from external API
  console.log(query.edicao);

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados para banners
  const banners = await fetcher(`${api_link}/banners?populate=deep`);
  // GET: dados dos juris, categorias
  const edicao = await fetcher(`${api_link}/edicoes?populate=deep`);
  // `${api_link}/edicoes/${query.edicao}?populate=deep`
  // console.log("edicao");
  // console.log(edicao);
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
    props: { social: rsocials, contato, banners, edicao, navbar: dlink },
  };
}
