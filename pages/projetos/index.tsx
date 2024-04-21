import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
// import { Card } from "flowbite-react";
import { Alert } from "flowbite-react";
import { IoCall } from "react-icons/io5";
import { HiInformationCircle } from "react-icons/hi";
import Image from "next/image";
import { useFetchUser } from "../../lib/authContext";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Vpublica = ({ social, contato, inscritos, navbar }: any) => {
  const { user, loading } = useFetchUser();
  console.log(inscritos);
  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Trabalhos Concorentes - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Projetos Concorentes aos Premios - Prémio Nacional De Publicidade"
        />
      </Head>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          {!loading &&
            (user ? ( //user
              <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
                <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
                  Avaliaçao Dos Jurados
                </h2>
                <p className="font-light text-justify text-gray-500 sm:text-xl dark:text-gray-400">
                  O Prémio Público de Publicidade é uma das categorias do Prémio
                  Nacional de Publicidade (PNP) em que a votação é feita somente
                  pelo público, através da Internet. Trata-se de um prémio da
                  responsabilidade do PNP, com regulamento próprio, sem
                  avaliação do júri, baseado apenas no critério de popularidade.
                </p>
              </div>
            ) : (
              <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
                <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
                  Votação Pública
                </h2>
                <p className="font-light text-justify text-gray-500 sm:text-xl dark:text-gray-400">
                  O Prémio Público de Publicidade é uma das categorias do Prémio
                  Nacional de Publicidade (PNP) em que a votação é feita somente
                  pelo público, através da Internet. Trata-se de um prémio da
                  responsabilidade do PNP, com regulamento próprio, sem
                  avaliação do júri, baseado apenas no critério de popularidade.
                </p>
              </div>
            ))}

          <div className="dados das inscriçoes">
            <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
              <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
                Projetos Concorentes a {'?'} Edição
              </h2>
            </div>

            <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
              <Alert color="warning" icon={HiInformationCircle}>
                <span>
                  <span className="font-medium">Info!</span> Disponivel somente
                  no período de votação.
                </span>
              </Alert>
            </div>

            <div className="grid grid-row md:grid-cols-2 gap-4">
              {inscritos.data.map((value: any, index: number) => (
                // <div key={index}>{value.attributes.url}</div>
                // <Card href="#"  key={index}>
                //     <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                //     {value.attributes.nome_projeto}
                //     </h5>
                //     <p className="font-normal text-gray-700 dark:text-gray-400">
                //         {value.attributes.con_criativo}
                //     </p>
                // </Card>
                <div key={index} className="flex font-sans shadow-2xl">
                  {/* <div className="flex-none w-48 relative">
                    <Link href={`/projetos/${value.id}`}>
                      <Image
                        src="https://res.cloudinary.com/dkz8fcpla/image/upload/v1674656587/pnp-icon.png"
                        alt="img test"
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        width={200}
                        height={500}
                      />
                    </Link>
                  </div> */}
                  <form className="flex-auto p-6">
                    <div className="flex flex-wrap">
                      <Link href={`/projetos/${value.id}`}>
                        <h1 className="flex-auto text-lg font-semibold text-slate-900">
                          {value.attributes.nome_projeto}
                        </h1>
                      </Link>
                      <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
                        {value.attributes.nome_completo}
                        <p>
                          <IoCall /> {value.attributes.telefone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-baseline mt-4 mb-6 pb-6 border-b border-slate-200">
                      <p>{value.attributes?.con_criativo?.substring(0, 536)}</p>
                    </div>
                    <div className="flex space-x-4 mb-6 text-sm font-medium">
                      <div className="flex-auto flex space-x-4"></div>
                      <Link
                        href={`/projetos/${value.id}`}
                        className="bg-amarelo-ouro text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro 
                                            duration-500"
                      >
                        Detalhes
                      </Link>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Vpublica;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/menus?populate=deep`);
  // GET: dados dos projetos inscritos
  const inscritos = await fetcher(`${api_link}/inscricoes`);
  //get links for menu
  let dlink: any = [];
  navbar.data?.map((value: any) => {
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
  console.log(inscritos);

  // Pass data to the page via props
  return { props: { social: rsocials, contato, navbar: dlink, inscritos } };
}

/*
<div className="flex font-sans">
<div className="flex-none w-48 relative">
  <img src="/classic-utility-jacket.jpg" alt="dsdsdd" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
</div>
<form className="flex-auto p-6">
  <div className="flex flex-wrap">
    <h1 className="flex-auto text-lg font-semibold text-slate-900">
      Classic Utility Jacket
    </h1>
    <div className="text-lg font-semibold text-slate-500">
      $110.00
    </div>
    <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
      In stock
    </div>
  </div>
  <div className="flex items-baseline mt-4 mb-6 pb-6 border-b border-slate-200">
    <div className="space-x-2 flex text-sm">
      <label>
        <input className="sr-only peer" name="size" type="radio" value="xs" checked />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
          XS
        </div>
      </label>
      <label>
        <input className="sr-only peer" name="size" type="radio" value="s" />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
          S
        </div>
      </label>
      <label>
        <input className="sr-only peer" name="size" type="radio" value="m" />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
          M
        </div>
      </label>
      <label>
        <input className="sr-only peer" name="size" type="radio" value="l" />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
          L
        </div>
      </label>
      <label>
        <input className="sr-only peer" name="size" type="radio" value="xl" />
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 peer-checked:font-semibold peer-checked:bg-slate-900 peer-checked:text-white">
          XL
        </div>
      </label>
    </div>
  </div>
  <div className="flex space-x-4 mb-6 text-sm font-medium">
    <div className="flex-auto flex space-x-4">
      <button className="h-10 px-6 font-semibold rounded-md bg-black text-white" type="submit">
        Buy now
      </button>
      <button className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-900" type="button">
        Add to bag
      </button>
    </div>
    <button className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-slate-300 border border-slate-200" type="button" aria-label="Like">
      <svg width="20" height="20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
      </svg>
    </button>
  </div>
  <p className="text-sm text-slate-700">
    Free shipping on all continental US orders.
  </p>
</form>
</div>
*/
