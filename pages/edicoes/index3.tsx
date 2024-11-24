import { Timeline } from "flowbite-react"
import { HiCalendar, HiArrowNarrowRight } from "react-icons/hi"
import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
// import Image from "next/image";
import Link from "next/link"
import Head from "next/head"
// import { Button } from "flowbite-react";
import ImageViewer from "awesome-image-viewer"
// import { Carousel, Button } from "flowbite-react";
import { useFetchUser } from "../../lib/authContext"
import { StrapiImage } from "../../components/custom/StrapiImage"
import Galery from "../../components/custom/galery"
import { getStrapiMedia } from "../../lib/utils"
import React from "react"
// import SimpleModal from "../../components/custom/pdfModal";

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const processIt = (data: any, category: string) => {
  return data
    .map((value: any) => {
      return value.attributes[category]?.map((dados: any, index2: any) => {
        return {
          id: index2,
          nome: dados.nome,
          foto: getStrapiMedia(dados.foto?.data?.attributes.url) || " ",
        }
      })
    })
    .flat()
}

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()

  const Verimg = (url: any) => {
    new ImageViewer({
      images: url,
    })
  }

  // Processa todos os parceiros de uma vez
  const jurados = processIt(edicao.data, "juri")

  console.log(jurados)

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // // const pdfSrc = "/path/to/your/pdf.pdf"; // Replace with the actual path to your PDF file

  // const openModal = () => {
  // 	setIsModalOpen(true);
  // };

  // const closeModal = () => {
  // 	setIsModalOpen(false);
  // };

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Edições - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Fotografias, videos, regulamento, os vencedores dos Prémios
          Palmeira e respetivos discursos de vitória… Aqui encontra tudo
          sobre as anteriores edições do PNP."
        />
      </Head>

      <div className="container mx-auto">
        <div className="bg-gray-50 py-12 px-4 sm:px-6">
          <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block text-amarelo-ouro">
              ?ª EDIÇÕES DO PRÉMIO NACIONAL DE PUBLICIDADE
            </span>
          </h2>
          <div className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Fotografias, videos, regulamento, os vencedores dos Prémios Palmeira
            e respetivos discursos de vitória… Aqui encontra tudo sobre as
            anteriores edições do PNP.
          </div>
        </div>
      </div>

      {/* jurados section  */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
            <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Jurados
            </h1>
          </div>
          <div className="flex flex-wrap justify-center m-4">
            {jurados.map((value2: any) => (
              <Link
                href="/"
                key={value2.id}
                className="flex flex-col items-center border rounded-lg shadow-lg overflow-hidden mr-10"
              >
                <img
                  src={value2.foto}
                  alt={value2.nome}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value2.nome}
                  </h3>
                  {/* <p className="text-gray-600">{value2.nome}</p> */}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projectos section  */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full py-1 rounded-lg shadow-lg">
            <h1 className="sm:text-4xl text-3xl font-extrabold title-font mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-200 transform transition-all duration-500 hover:scale-105">
              Projetos
            </h1>
          </div>
          <div className="flex flex-wrap justify-center -m-2">
            {/* {parceirosMedia.map((partner: any, index: number) => (
              <PartnerCard key={index} partner={partner} />
            ))} */}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Edicoes

export async function getServerSideProps() {
  //   const query = new URLSearchParams({ sort: "N_Edicao:desc" })

  const [rsocials, contato, edicao, navbar] = await Promise.all([
    fetcher(`${api_link}/api/redes-social?populate=*`),
    fetcher(`${api_link}/api/contato`),
    fetcher(
      `${api_link}/api/edicoes?populate=deep&sort[0]=id:desc&pagination[pageSize]=1`
    ),
    fetcher(`${api_link}/api/menus?populate=deep`),
  ])

  // console.log("edicao");
  // console.log(edicao.data[0].attributes);

  const dlink = navbar.data.flatMap((value: any) =>
    value.attributes.items.data.map((item: any) => ({
      name: item.attributes.title,
      link: item.attributes.url,
    }))
  )

  return { props: { social: rsocials, contato, edicao, navbar: dlink } }
}
