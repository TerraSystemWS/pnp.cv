import React, { useState } from "react"
import { fetcher } from "../../lib/api"
import Layout from "../../components/Layout"
import Head from "next/head"
import HeroSection from "../../components/HeroSection"
import { StrapiImage } from "../../components/custom/StrapiImage"
import Link from "next/link"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
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
        url: jurado.foto.data.attributes.formats.small.url,
        width: jurado.foto.data.attributes.formats.small.width,
        height: jurado.foto.data.attributes.formats.small.height,
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
      url: video.video.data.attributes.url,
    })),
  }))

  const documents = edicao.data.map((edicaoItem: any) => ({
    edicaoNumero: edicaoItem.attributes.N_Edicao,
    documents: edicaoItem.attributes.documents.map((document: any) => ({
      titulo: document.titulo,
      url: document.ficheiro.data.attributes.url,
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

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar}>
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

                    <span
                      dangerouslySetInnerHTML={{
                        __html: jurado.descricao,
                      }}
                    />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galeria
              .find(
                (item: any) => item.edicaoNumero === currentEdition.edicaoNumero
              )
              ?.galeria.map((galeriaItem: any) => (
                <Link
                  key={galeriaItem.titulo}
                  href={`/galeria/${galeriaItem.titulo}`}
                >
                  <div className="bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                    <h2 className="text-xl font-extrabold text-center text-yellow-500">
                      {galeriaItem.titulo}
                    </h2>
                    <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                      {galeriaItem.imagens[0] && (
                        <StrapiImage
                          className="w-full h-full object-cover rounded-lg"
                          src={
                            galeriaItem.imagens[0]?.url || "/default-avatar.png"
                          }
                          alt={galeriaItem.titulo}
                          height={200}
                          width={200}
                        />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="my-6">
          <h1 className="text-3xl font-extrabold text-center text-yellow-400 mb-4">
            Vídeos
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos
              .find((item) => item.edicaoNumero === currentEdition.edicaoNumero)
              ?.videos.map((video) => (
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
                  href={document.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-gray-200 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                    <h2 className="text-xl font-extrabold text-center text-yellow-500">
                      {document.titulo}
                    </h2>
                    <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-white">PDF</span>
                    </div>
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
