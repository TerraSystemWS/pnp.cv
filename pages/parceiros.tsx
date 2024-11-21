import Layout from "../components/Layout";
import { fetcher } from "../lib/api";
import Link from "next/link";
import Head from "next/head";
import { useFetchUser } from "../lib/authContext";
import { getStrapiMedia } from "../lib/utils";

// Link para a URL do API
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

// Função helper para processar os dados dos parceiros
const processPartners = (data: any, category: string) => {
  return data.map((value: any) => {
    return value.attributes[category]?.map((partner: any, index2: any) => {
      return {
        id: index2,
        link: partner.link,
        title: partner.titulo,
        foto: getStrapiMedia(partner.logo?.data?.attributes.url) || " ",
        tipo: partner.tipo,
        cor: partner.tipo === "Diamante" ? "" : partner.tipo === "Ouro" ? "#FFD700" : partner.tipo === "Prata" ? "#C0C0C0" : "#CD7F32",
        icon: partner.tipo === "Diamante" ? "💎" : partner.tipo === "Ouro" ? "🥇" : partner.tipo === "Prata" ? "🥈" : "🥉"
      };
    });
  }).flat();
};

const Parceiros = ({ social, contato, parceiros, navbar }: any) => {
  const { user } = useFetchUser();

  // Processa todos os parceiros de uma vez
  const parceirosOrganizacao = processPartners(parceiros.data, 'organizacao');
  const parceirosPadrinho = processPartners(parceiros.data, 'parceiros_padrinhos');
  const parceirosPatrocinadores = processPartners(parceiros.data, 'patrocinadores').sort((a: any, b: any) => a.id - b.id);
  const parceirosOperacionais = processPartners(parceiros.data, 'parceiros_operacionais');
  // const parceirosApoio = processPartners(parceiros.data, 'parceiros_apoio');
  const parceirosMedia = processPartners(parceiros.data, 'media_parteners');
  const heading = parceirosOrganizacao.length > 1 ? "Organizadores" : "Organizador";

  // Componente para o card de patrocinador h-96
  const PartnerCard = ({ partner }: any) => (
    <div className="p-2 lg:w-1/3 md:w-1/2 w-full">
      <div className="h-full flex flex-col items-center p-4 justify-center">
        <Link href={partner.link || "#"} target="_blank" rel="noreferrer">
          <div className="flex justify-center items-center  rounded">
            <img
              alt={partner.title}
              className="object-contain object-center"
              src={partner.foto}
              width="300"
              height="300"
            />
          </div>
        </Link>
        <div className="text-center mt-2">
          {/* Condicional para exibir tipo e ícone */}
          {(partner.tipo || partner.icon) && (
            <div className="flex justify-center items-center space-x-2">
              {partner.tipo && (
                <>
                <span
                  className="text-white px-3 py-1 tracking-widest text-xs rounded-bl"
                  style={{ backgroundColor: partner.cor }}
                >
                  {partner.tipo}
                </span>
                <span className="text-2xl">
                {partner.icon}
              </span>
              </>
              )}
              {/* {partner.icon && (
                <span className="text-2xl">
                  {partner.icon}
                </span>
              )} */}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Parceiros - Prémio Nacional De Publicidade</title>
        <meta name="description" content={heading} />
      </Head>

      {/* Organizadores Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
        <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              {heading}
            </h1>
          </div>
          <div className="flex flex-wrap justify-center">
            {parceirosOrganizacao.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros Padrinho Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-10 mx-auto">
          
          <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
            <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Parceiro Institucional
            </h1>
          </div>

          <div className="flex flex-wrap justify-center">
            {parceirosPadrinho.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Patrocinadores Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
        <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Patrocinadores
            </h1>
          </div>
          <div className="flex flex-wrap justify-center -m-2">
            {parceirosPatrocinadores.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Parceiros Operacionais Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
        <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Parceiros Operacionais
            </h1>
          </div>
          <div className="flex flex-wrap justify-center -m-2">
            {parceirosOperacionais.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Media Partners Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
        <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Media Partners
            </h1>
          </div>
          <div className="flex flex-wrap justify-center -m-2">
            {parceirosMedia.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* Apoio Partners Section */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
        <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Apoio
            </h1>
          </div>
          <div className="flex flex-wrap justify-center -m-2">
            {/* {parceirosApoio.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))} */}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Parceiros;

// Função que busca dados do servidor
export async function getServerSideProps() {
  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/api/contato`);

  // GET: dados dos parceiros
  // const parceiros = await fetcher(`${api_link}/api/parceiros?populate=deep`);
  // const parceiros = await fetcher(`${api_link}/api/parceiros?populate=deep&sort[0]=createdAt:asc`);
  const parceiros = await fetcher(`${api_link}/api/parceiros?populate=deep&sort[0]=id:desc&pagination[pageSize]=1`);


  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/api/menus?populate=deep`);

  // Processar dados do navbar
  let dlink: any = [];
  navbar.data.forEach((value: any) => {
    value.attributes.items.data.forEach((item: any, index: any) => {
      dlink[index] = {
        name: item.attributes.title,
        link: item.attributes.url,
      };
    });
  });

  // Retornar os dados como props
  return {
    props: { social: rsocials, contato, parceiros, navbar: dlink },
  };
}
