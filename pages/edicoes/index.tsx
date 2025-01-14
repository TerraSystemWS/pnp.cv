import React, { useState } from "react"
import { fetcher } from "../../lib/api"
import Layout from "../../components/Layout"
import Head from "next/head"
import HeroSection from "../../components/HeroSection"
import { StrapiImage } from "../../components/custom/StrapiImage"
import Link from "next/link"
import { useFetchUser } from "../../lib/authContext"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
  const { user } = useFetchUser()
  const [currentPage, setCurrentPage] = useState(0)

  // Agrupando os jurados por edição
  const Juris = edicao.data.map((edicaoItem: any) => ({
    edicaoNumero: edicaoItem.attributes.N_Edicao,
    jurados: edicaoItem.attributes.juri.map((jurado: any) => ({
      id: jurado.id,
      nome: jurado.nome,
      titulo: jurado.titulo,
      descricao: jurado.descricao,
      foto: {
        url: jurado.foto.data?.attributes.formats.small.url,
        width: jurado.foto.data?.attributes.formats.small.width,
        height: jurado.foto.data?.attributes.formats.small.height,
      },
    })),
  }))

  // Agrupando as galerias, vídeos e documentos por edição
  const galeria = edicao.data.map((edicaoItem: any) => ({
    edicaoNumero: edicaoItem.attributes.N_Edicao,
    galeria: edicaoItem.attributes.galeria.map((galeria: any) => ({
      titulo: galeria.titulo,
      imagens: galeria.imagens.data.map((imagem: any) => ({
        url: imagem.attributes.formats.medium.url,
        width: imagem.attributes.formats.medium.width,
        height: imagem.attributes.formats.medium.height,
      })),
    })),
  }))

  const videos = edicao.data.map((edicaoItem: any) => ({
    edicaoNumero: edicaoItem.attributes.N_Edicao,
    videos: edicaoItem.attributes.videos.map((video: any) => ({
      titulo: video.titulo,
      url: video.video.data?.attributes.url,
    })),
  }))

  const documents = edicao.data.map((edicaoItem: any) => ({
    edicaoNumero: edicaoItem.attributes.N_Edicao,
    documents: edicaoItem.attributes.documents.map((document: any) => ({
      titulo: document.titulo,
      url: document.ficheiro.data?.attributes.url,
    })),
  }))

  // Função para ir para a próxima página (próxima edição)
  const nextPage = () => {
    if (currentPage < Juris.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  // Função para voltar para a página anterior (edição anterior)
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Edição atual a ser exibida
  const currentEdition = Juris[currentPage]

  console.log(galeria)

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Edições - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Fotografias, vídeos, regulamento, os vencedores dos Prémios Palmeira e respetivos discursos de vitória… Aqui encontra tudo sobre as anteriores edições do PNP."
        />
      </Head>

      <HeroSection
        title={`${currentEdition.edicaoNumero}ª EDIÇÃO DO PRÉMIO NACIONAL DE PUBLICIDADE`}
        subtitle={
          "Fotografias, vídeos, regulamento, os vencedores dos Prémios Palmeira e respetivos discursos de vitória… Aqui encontra tudo sobre as anteriores edições do PNP."
        }
      />

      <div className="container mx-auto py-6">
        {/* Jurados Section */}
        <div className="my-6">
          <h1 className="text-4xl font-extrabold text-center text-amarelo-ouro dark:text-white tracking-tight my-4">
            Jurados
          </h1>

          <div className="flex flex-wrap justify-center gap-6">
            {currentEdition.jurados.map((jurado: any) => (
              <div
                key={jurado.nome}
                className="flex flex-col items-center bg-gray-50 rounded-lg shadow sm:flex-row dark:bg-gray-800 dark:border-gray-700 w-full sm:w-[20rem] md:w-[22rem] lg:w-[24rem]"
              >
                <Link
                  href={`/juris/${jurado.id}?edicao=${currentEdition.edicaoNumero}`}
                >
                  <StrapiImage
                    className="w-[200px] h-[200px] object-cover rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src={jurado.foto?.url || "/default-avatar.png"}
                    alt={jurado.nome}
                    height={200}
                    width={200}
                  />
                </Link>
                <div className="p-5 flex flex-col justify-between h-full">
                  <h3 className="text-lg font-medium text-amarelo-ouro dark:text-white">
                    <Link
                      href={`/juris/${jurado.id}?edicao=${currentEdition.edicaoNumero}`}
                    >
                      {jurado.nome}
                    </Link>
                  </h3>
                  <span className="text-sm text-gray-800 dark:text-gray-400">
                    {jurado.titulo}
                  </span>
                  <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                    {/* Renderizando a descrição truncada, se disponível */}

                    {/* <span
                      dangerouslySetInnerHTML={{
                        __html:
                          jurado.descricao.slice(0, 112) +
                          (jurado.descricao.length > 112 ? "..." : ""),
                      }}
                    /> */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Galeria Section */}
        <div className="my-6">
          <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
            Galeria
          </h1>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> */}
          {galeria
            .find(
              (item: any) => item.edicaoNumero === currentEdition.edicaoNumero
            )
            ?.galeria.slice(0, 1) // Pega a galeria mais recente
            .map((galeriaItem: any) => (
              <div key={galeriaItem.titulo} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Exibindo até 5 imagens da galeria mais recente */}
                  {galeriaItem.imagens
                    .slice(0, 6)
                    .map((image: any, index: number) => (
                      <div key={index} className="relative">
                        <StrapiImage
                          className="w-full h-full object-cover rounded-lg"
                          src={image?.url || "/default-avatar.png"}
                          alt={galeriaItem.titulo}
                          height={200}
                          width={200}
                        />
                        {/* Magnifier Icon (zoom) */}
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-12 h-12 text-white"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 6a5 5 0 0110 0 5 5 0 01-10 0zM4.93 4.93a9 9 0 1112.73 12.73M13.8 14.8l4.69 4.69"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}

                  {/* Se houver mais de 5 imagens, mostra um link na última posição */}
                  {galeriaItem.imagens.length > 5 && (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out flex items-center justify-center">
                      <Link
                        href="/galerias"
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300"
                      >
                        Ver mais galerias
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          {/* </div> */}
        </div>

        {/* Videos Section */}
        <div className="my-6">
          <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
            Vídeos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos
              .find(
                (item: any) => item.edicaoNumero === currentEdition.edicaoNumero
              )
              ?.videos.slice(0, 5) // Exibe até 5 vídeos
              .map((video: any, index: any) => (
                <div
                  key={video.titulo}
                  className="bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out"
                >
                  <h2 className="text-xl font-extrabold text-center text-yellow-500 mb-4">
                    {video.titulo}
                  </h2>
                  {/* Video player */}
                  <div className="flex justify-center">
                    <video
                      width={320}
                      height={240}
                      controls
                      className="rounded-lg"
                    >
                      <source
                        src={`${api_link}${video.url}`}
                        type="video/mp4"
                      />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                </div>
              ))}
            {/* Adiciona o box de link para a página de vídeos, caso haja mais de 5 vídeos */}
            {videos.find(
              (item: any) => item.edicaoNumero === currentEdition.edicaoNumero
            )?.videos.length > 5 && (
              <div className="bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <h2 className="text-xl font-extrabold text-center text-yellow-500 mb-4">
                  Veja mais vídeos
                </h2>
                <div className="flex justify-center">
                  <a
                    href="/pagina-de-videos" // Substitua pelo link correto para a página de vídeos
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300"
                  >
                    Acessar Página de Vídeos
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="my-6">
          <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
            Documentos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents
              .find(
                (item: any) => item.edicaoNumero === currentEdition.edicaoNumero
              )
              ?.documents.map((document: any) => (
                <a
                  key={document.titulo}
                  href={`${api_link}${document.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105">
                    <h2 className="text-xl font-extrabold text-center text-yellow-500 mb-4">
                      {document.titulo}
                    </h2>
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src="https://placehold.co/150x200.png?text=Abrir+PDF" // Aqui você pode colocar uma URL para uma capa de PDF ou miniatura
                        alt="Capa do documento"
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-12 h-12 text-white"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2 2 4-4m0 0l-4-4-2 2m4 4H6"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-center text-sm">
                      Clique para abrir o documento
                    </p>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* Pagination Section */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={prevPage}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 disabled:opacity-50"
            disabled={currentPage === 0}
          >
            Anterior
          </button>
          <button
            onClick={nextPage}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 disabled:opacity-50"
            disabled={currentPage === Juris.length - 1}
          >
            Próximo
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default Edicoes

export async function getServerSideProps() {
  const query = new URLSearchParams({ sort: "N_Edicao:desc" })

  const [rsocials, contato, edicao, navbar] = await Promise.all([
    fetcher(`${api_link}/api/redes-social?populate=*`),
    fetcher(`${api_link}/api/contato`),
    fetcher(`${api_link}/api/edicoes?populate=deep&${query.toString()}`),
    fetcher(`${api_link}/api/menus?populate=deep`),
  ])

  const dlink = navbar.data.flatMap((value: any) =>
    value.attributes.items.data.map((item: any) => ({
      name: item.attributes.title,
      link: item.attributes.url,
    }))
  )

  return { props: { social: rsocials, contato, edicao, navbar: dlink } }
}
