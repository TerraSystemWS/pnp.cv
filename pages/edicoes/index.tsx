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

const Edicoes = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()

  const Verimg = (url: any) => {
    new ImageViewer({
      images: url,
    })
  }

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
              EDIÇÕES DO PRÉMIO NACIONAL DE PUBLICIDADE
            </span>
          </h2>
          <div className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Fotografias, videos, regulamento, os vencedores dos Prémios Palmeira
            e respetivos discursos de vitória… Aqui encontra tudo sobre as
            anteriores edições do PNP.
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        {/* @ts-ignore */}
        <Timeline>
          {edicao.data.map((value: any, index: any) => (
            <Timeline.Item key={index}>
              <Timeline.Point icon={HiCalendar} />
              <Timeline.Content>
                <Timeline.Time>{value.attributes.publishedAt}</Timeline.Time>
                <Timeline.Title>
                  PNP {value.attributes.N_Edicao}ª Edição
                </Timeline.Title>
                <Timeline.Body>
                  {/* Júrados section */}
                  <div key={index} id="juri">
                    <section className="text-gray-600 body-font">
                      <div className="container px-5 py-24 mx-auto">
                        <div className="flex flex-col w-full mb-5">
                          <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                            Jurados
                          </h1>
                          {/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
														Whatever cardigan tote bag tumblr hexagon brooklyn
														asymmetrical gentrify, subway tile poke
														farm-to-table. Franzen you probably havent heard of
														them.
													</p> */}
                        </div>
                        <div className="flex flex-wrap -m-2">
                          {value.attributes.juri.map(
                            (value2: any, index: any) => (
                              <Link
                                href={`/juris/${value2.id}?edicao=${value.attributes.N_Edicao}`}
                                key={index}
                                className="p-2 lg:w-1/3 md:w-1/2 w-full"
                              >
                                <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                                  {/* <Link href={`/juris/${value2.id}?edicao=${value2.attributes.N_Edicao}`}> */}
                                  {/* @ts-ignore */}
                                  <StrapiImage
                                    key={index}
                                    alt="team"
                                    className="w-16 h-16 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                                    src={
                                      value2.foto.data?.attributes.formats
                                        .thumbnail.url || "/"
                                    }
                                    width={
                                      value2.foto.data?.attributes.formats
                                        .thumbnail.width
                                    }
                                    height={
                                      value2.foto.data?.attributes.formats
                                        .thumbnail.height
                                    }
                                  />
                                  {/* </Link> */}
                                  <div className="flex-grow">
                                    <h2 className="text-gray-900 title-font font-medium">
                                      {value2.nome}
                                    </h2>
                                  </div>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                  {/* Gallery section */}
                  <div id="galeria">
                    <div className="flex flex-col w-full mb-5">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                        Galeria
                      </h1>
                      {/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
														Whatever cardigan tote bag tumblr hexagon brooklyn
														asymmetrical gentrify, subway tile poke
														farm-to-table. Franzen you probably havent heard of
														them.
													</p> */}
                    </div>

                    {/* <div className="flex flex-wrap justify-between gap-4 sm:gap-8 xl:gap-12 2xl:gap-16">
											{value.attributes.galeria
												.slice(0, 10)
												.map((item: any) => (
													<div key={item.id}>
														<div>
															<h1 className="">
																{item.titulo}
															</h1>
														</div>
														<div className="">
															{/* @ts-ignore * /}
															<Galery
																imageUrls={item.imagens.data
																	.slice(
																		0,
																		10
																	)
																	.map(
																		(
																			img: any
																		) =>
																			img
																				.attributes
																				.url
																	)}
															/>
														</div>
													</div>
												))}
										</div> */}
                    <div className="flex flex-wrap justify-between gap-4 sm:gap-8 xl:gap-12 2xl:gap-16">
                      {value.attributes.galeria
                        .slice(0, 10)
                        .map((item: any, index: number) => (
                          <div key={item.id}>
                            <div>
                              <h1 className="">{item.titulo}</h1>
                            </div>
                            <div className="">
                              {/* @ts-ignore */}
                              <Galery
                                imageUrls={item.imagens.data
                                  .slice(0, 10)
                                  .map((img: any) => img.attributes.url)}
                              />
                            </div>
                          </div>
                        ))}
                      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
                        <Link
                          href={`/galeria?edicao=${value.attributes.N_Edicao}`}
                          className="hover:border-blue-500 hover:border-solid hover:bg-white hover:text-blue-500 group w-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 text-slate-900 font-medium py-3"
                        >
                          <svg
                            className="group-hover:text-blue-500 mb-1 text-slate-400"
                            width="20"
                            height="20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M10 5a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H6a1 1 0 1 1 0-2h3V6a1 1 0 0 1 1-1Z" />
                          </svg>
                          Ver mais fotos na galeria
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* Videos section */}
                  <div id="videos">
                    <div className="flex flex-col w-full mb-5">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                        Videos
                      </h1>
                      {/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
														Whatever cardigan tote bag tumblr hexagon brooklyn
														asymmetrical gentrify, subway tile poke
														farm-to-table. Franzen you probably havent heard of
														them.
											</p> */}
                    </div>
                    <section className="grid grid-cols-2 gap-4">
                      {value.attributes.videos.map((value3: any) => (
                        <div
                          key={value3.id}
                          className="relative aspect-w-16 aspect-h-9"
                        >
                          <video
                            className="absolute inset-0 w-full h-full object-cover"
                            controls
                          >
                            <source
                              src={
                                getStrapiMedia(
                                  value3.video.data.attributes.url
                                ) || " "
                              }
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ))}
                    </section>
                  </div>
                  {/* Catalogs section */}
                  <div id="catalogos">
                    <div className="flex flex-col w-full mb-5">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">
                        Catálogos
                      </h1>
                      {/* <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
												Whatever cardigan tote bag
												tumblr hexagon brooklyn
												asymmetrical gentrify, subway
												tile poke farm-to-table. Franzen
												you probably havent heard of
												them.
											</p> */}
                    </div>
                    {value.attributes.documents.map((value: any) => (
                      <div key={value.id} className="m-5">
                        <div>
                          <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            {/* <svg
																className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-3"
																aria-hidden="true"
																xmlns="http://www.w3.org/2000/svg"
																fill="currentColor"
																viewBox="0 0 20 20"
															>
																<path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z" />
															</svg> */}
                            <a
                              href={
                                getStrapiMedia(
                                  value.ficheiro.data.attributes.url
                                ) || " "
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                {value.titulo}
                              </h5>
                            </a>

                            {/* <a
																href={
																	getStrapiMedia(
																		value
																			.ficheiro
																			.data
																			.attributes
																			.url
																	) || " "
																}
																className="inline-flex font-medium items-center text-blue-600 hover:underline"
																target="_blank"
															>
																Abrir
																<svg
																	className="w-3 h-3 ms-2.5 rtl:rotate-[270deg]"
																	aria-hidden="true"
																	xmlns="http://www.w3.org/2000/svg"
																	fill="none"
																	viewBox="0 0 18 18"
																>
																	<path
																		stroke="currentColor"
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		stroke-width="2"
																		d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
																	/>
																</svg>
															</a> */}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline>
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
