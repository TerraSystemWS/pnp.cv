import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
// import Link from "next/link";
import Head from "next/head"
// import { Card } from "flowbite-react";
// import { IoCall } from "react-icons/io5";
import { useState } from "react"
// import { Table } from "flowbite-react"
import { useForm, SubmitHandler } from "react-hook-form"
import Swal from "sweetalert2"
const qs = require("qs")
import HeroSection from "../../components/HeroSection"

// primereact tools
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import "primereact/resources/primereact.min.css" //core css
import "primeicons/primeicons.css" //icons
import { Accordion, AccordionTab } from "primereact/accordion"
import React from "react"
import { useFetchUser } from "../../lib/authContext"
import { Image } from "primereact/image"
import JSConfetti from "js-confetti"
import Votacao from "../../components/Votacao"
import { getTokenFromLocalCookie } from "../../lib/auth"

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// type VotaInputs = {
//   emailVota: string;
//   nomeVota: string;
// };

const VpublicaDetalhes = ({
  edicoes,
  social,
  contato,
  inscricao,
  navbar,
}: any) => {
  // console.log("detalhes inscritos");
  // console.log(inscricao);
  const InscritosValues: any = {
    nome_completo: inscricao.data.attributes.nome_completo,
    email: inscricao.data.attributes.email,
    sede: inscricao.data.attributes.sede,
    nif: inscricao.data?.attributes.NIF,
    telefone: inscricao.data?.attributes.telefone,
    nome_projeto: inscricao.data.attributes.nome_projeto,
    categoria: inscricao.data.attributes.categoria,
    con_criativo: inscricao.data.attributes.con_criativo,
    coord_prod: inscricao.data.attributes.coord_prod,
    dir_foto: inscricao.data.attributes.dir_foto,
    dir_art: inscricao.data.attributes.dir_art,
    realizador: inscricao.data.attributes.realizador,
    editor: inscricao.data.attributes.editor,
    autor_jingle: inscricao.data.attributes.autor_jingle,
    designer: inscricao.data.attributes.designer,
    outras_consideracoes: inscricao.data.attributes.outras_consideracoes,
    data_producao: inscricao.data.attributes.data_producao,
    data_divulgacao: inscricao.data.attributes.data_divulgacao,
    data_apresentacao_publica:
      inscricao.data.attributes.data_apresentacao_publica,
  }

  // const [cor, setCor] = useState(false)
  const [cor, setCor] = useState("CurrentColor")
  const [isBlock, setBlock] = useState(false)
  const [blockCor, setBlockCor] = useState("bg-amarelo-ouro")
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const edicaoMaisRecente = edicoes.data[0]?.attributes.N_Edicao

  const onVotar = async (data: any) => {
    const jwt = getTokenFromLocalCookie()
    // teste de confetti
    const jsConfetti = new JSConfetti()
    // console.log("============== DATA ==================");
    // console.log(data.nomeVota);
    // console.log(data.emailVota);

    try {
      const res = await fetcher(`${api_link}/api/votacao-publicas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            nome_completo: data.nomeVota,
            email: data.emailVota,
            inscricoe: [inscricao.data.id],
          },
        }),
      })

      console.log("=========== response ====================")
      console.log(res)
      if (res.data) {
        setCor("red")
        // alert("Gostei, tem meu voto!");
        setBlock(true)
        setBlockCor("bg-gray-500")
        jsConfetti.addConfetti({
          emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
          emojiSize: 10,
          confettiNumber: 500,
        })
        Swal.fire({
          icon: "success",
          title: "Concluida",
          text: "",
        })
      } else {
        Swal.fire({
          icon: "warning",
          title: "AVISO",
          text: "So Pode Votar Uma Unica Vez",
        })
      }
    } catch (error) {
      // console.log("=========== dados Erros ====================");
      // console.log(error);
      Swal.fire({
        icon: "error",
        title: "Falhou",
        text: "Não foi possivel votar",
      })
    }
  }

  // Pass in the id of an element
  // let confetti = new Confetti("demo");

  // // Edit given parameters
  // confetti.setCount(75);
  // confetti.setSize(1);
  // confetti.setPower(25);
  // confetti.setFade(false);
  // confetti.destroyTarget(true);

  // primereact usecases
  const [visible, setVisible] = useState(false)
  const [position, setPosition] = useState("center")
  // forms
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      {/* <Button
          label="Login"
          icon="pi pi-check"
          onClick={() => setVisible(false)}
          autoFocus
          className="p-button-warning"
        /> */}
    </div>
  )

  const show = (position: any) => {
    setPosition(position)
    setVisible(true)
  }

  // const categoria_pnp: string = "Publicidade Internet"
  // const avaliacao: any = [
  //   { title: "Conceito Criativo", nota: 0 },
  //   { title: "Design", nota: 0 },
  //   { title: "Interatividade", nota: 0 },
  //   { title: "Alcance Pago", nota: 0 },
  //   { title: "Soluçao Tecnologica", nota: 0 },
  //   { title: "Redaçao", nota: 0 },
  //   { title: "Aspetos Administrativos", nota: 0 },
  //   { title: "Pontuacao Geral", nota: 0 },
  // ]

  // const Avalicao: any = [
  //   {
  //     id_inscricao: 1,
  //     categoria: "Publicidade Internet",
  //     juri: "Nome do Juri",
  //     areas: [
  //       { title: "Conceito Criativo", nota: 0 },
  //       { title: "Design", nota: 0 },
  //       { title: "Interatividade", nota: 0 },
  //       { title: "Alcance Pago", nota: 0 },
  //       { title: "Soluçao Tecnologica", nota: 0 },
  //       { title: "Redaçao", nota: 0 },
  //       { title: "Aspetos Administrativos", nota: 0 },
  //       { title: "Pontuacao Geral", nota: 0 },
  //     ],
  //   },
  // ];

  const { user, loading } = useFetchUser()

  // const excluirPrivados = (title: String): boolean => {
  //   let title_clean: boolean = false
  //   const substr = ["nif", "pagamento", "comprovativo pagamento"]
  //   for (let index = 0; index < substr.length; index++) {
  //     title_clean = title.toLowerCase().includes(substr[index].toLowerCase())
  //     if (title_clean) {
  //       break
  //     }
  //   }

  //   return title_clean
  // }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>
          {inscricao.data?.attributes?.nome_projeto} - Prémio Nacional De
          Publicidade
        </title>
        <meta
          name="description"
          content={inscricao.data.attributes.con_criativo}
        />
      </Head>
      {/* <div className="">
        <div className="bg-gray-200">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block text-amarelo-ouro">
                {inscricao.data.attributes.nome_projeto}
              </span>
              {/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> * /}
            </h2>
            {/* <div className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
              Fotografias, videos, regulamento, os vencedores dos Prémios
              Palmeira e respetivos discursos de vitória… Aqui encontra tudo
              sobre as anteriores edições do PNP.
            </div> * /}
          </div>
        </div>
      </div> */}
      <HeroSection
        title={inscricao.data.attributes.nome_projeto}
        subtitle={`Concorente da ${edicaoMaisRecente}ª edição`}
      />

      <div className="p-11">
        {/* Inicio dos detalhes de cada projeto */}
        {!loading &&
          (user ? (
            <>
              <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        FICHA DE INSCRIÇÃO
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Concurso do Prémio Nacional de Publicidade
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                      <div className="overflow-hidden shadow sm:rounded-md">
                        <div className="bg-white px-4 py-5 sm:p-6">
                          <div className="grid grid-cols-6 gap-6">
                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="fname"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Nome Completo (Empresa ou candidato individual)
                              </label>
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.nome_completo}
                              </p>
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                              <label
                                htmlFor="nif"
                                className="block text-sm font-medium text-gray-700"
                              >
                                NIF
                              </label>
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.nif}
                              </p>
                            </div>

                            <div className="col-span-6 sm:col-span-4">
                              <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Email
                              </label>
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.email}
                              </p>
                            </div>

                            <div className="col-span-6">
                              <label
                                htmlFor="street-address"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Sede ou Local de Residência
                              </label>
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.sede}
                              </p>
                            </div>
                            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Telefone
                              </label>
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.telefone}
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      // {  ? 'disabled' : ' '}
                    >
                      Guardar
                    </button>
                  </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                  <div className="border-t border-gray-200" />
                </div>
              </div>
            </>
          ) : (
            <></>
          ))}
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  FICHA TÉCNICA
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Especifica quais as categorias a concorrer e detalhes sobre o
                  projeto
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label
                          htmlFor="countries"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Categoria de Prémio a que concorre
                        </label>
                        <p className="font-bold text-amarelo-ouro">
                          {InscritosValues.categoria}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="proj_nome"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nome do Projeto
                      </label>
                      <p className="font-bold text-amarelo-ouro">
                        {InscritosValues.nome_projeto}
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Conceito Criativo
                      </label>
                      <div className="mt-1">
                        <p className="font-bold text-amarelo-ouro">
                          {InscritosValues.con_criativo}
                        </p>
                      </div>
                      {/* <p className="mt-2 text-sm text-gray-500">
                        Breve descrição sobre seu projeto e outros observações
                      </p> */}
                    </div>

                    {/* <div>
											<label className="block text-sm font-medium text-gray-700">
												Photo
											</label>
											<div className="mt-1 flex items-center">
												<span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
													<svg
														className="h-full w-full text-gray-300"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg>
												</span>
												<button
													type="button"
													className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												>
													Change
												</button>
											</div>
										</div> */}

                    {/* <div>
											<label className="block text-sm font-medium text-gray-700">
												Cover photo
											</label>
											<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
												<div className="space-y-1 text-center">
													<svg
														className="mx-auto h-12 w-12 text-gray-400"
														stroke="currentColor"
														fill="none"
														viewBox="0 0 48 48"
														aria-hidden="true"
													>
														<path
															d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													<div className="flex text-sm text-gray-600">
														<label
															htmlFor="file-upload"
															className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
														>
															<span>Upload a file</span>
															<input
																id="file-upload"
																name="file-upload"
																type="file"
																className="sr-only"
															/>
														</label>
														<p className="pl-1">or drag and drop</p>
													</div>
													<p className="text-xs text-gray-500">
														PNG, JPG, GIF up to 10MB
													</p>
												</div>
											</div>
										</div> */}
                  </div>
                  {/* <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {!loading &&
          (user ? (
            <>
              <div>
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Equipa do Projeto
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Informações sobre as equipas e colaboradores do projeto
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <div>
                      <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Coordenador / Produtor
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.coord_prod}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Diretor de Fotografia
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.dir_foto}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Diretor de Arte
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.dir_art}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Realizador
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.realizador}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Editor
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.editor}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Autoria do Jingle
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.autor_jingle}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Designer
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.designer}
                            </p>
                          </div>

                          <div>
                            <label
                              htmlFor="about"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Outro (considerações adicionais)
                            </label>
                            <div className="mt-1">
                              <p className="font-bold text-amarelo-ouro">
                                {InscritosValues.outras_consideracoes}
                              </p>
                            </div>
                            {/* <p className="mt-2 text-sm text-gray-500">
												algumas considerações adicionais
											</p> */}
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Data da sua produção
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.data_producao}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Data da divulgação
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.data_divulgacao}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-4">
                            <label
                              htmlFor="coo_prod"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Data da sua apresentação pública (se trabalho
                              universitário)
                            </label>
                            <p className="font-bold text-amarelo-ouro">
                              {InscritosValues.data_apresentacao_publica}
                            </p>
                          </div>
                        </div>
                        {/* <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar
                    </button>
                  </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                  <div className="border-t border-gray-200" />
                </div>
              </div>
            </>
          ) : (
            <></>
          ))}

        {/* fim dos detalhes de cada projeto */}
        {/* lista de documentos submetidos */}
        {!loading &&
          (user ? (
            <div className="mt-10 sm:mt-0">
              {/** Private Documents Section */}
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Documentos Privados
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p className="mb-2">
                        <span className="text-red-500 font-bold text-lg pointer">
                          {/* <IoTrashOutline /> */}
                        </span>{" "}
                        {/* Remove a file */}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 md:col-span-2 md:mt-0">
                  <div>
                    <Accordion activeIndex={0}>
                      {inscricao.data.attributes.fileLink?.map(
                        (value: any, index: number) => {
                          // Filtra apenas documentos privados (publico: false)
                          if (value.publico !== false) return null

                          console.log("inscricao.data.attributes.fileLink")
                          console.log(inscricao.data.attributes.fileLink)

                          const fileExtension = value.titulo
                            ?.slice(-4)
                            .toLowerCase() // Obtém a extensão do arquivo

                          const renderFilePreview = () => {
                            switch (fileExtension) {
                              case ".pdf":
                                return (
                                  <p className="m-0">
                                    <a
                                      href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                      target="_blank"
                                      className="hover:text-blue-500 hover:underline"
                                      rel="noreferrer"
                                    >
                                      [Abrir Link]
                                    </a>
                                  </p>
                                )

                              case ".mp3":
                                return (
                                  <>
                                    <p className="m-0">
                                      <a
                                        href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        target="_blank"
                                        className="hover:text-blue-500 hover:underline"
                                        rel="noreferrer"
                                      >
                                        [Abrir Link]
                                      </a>
                                    </p>
                                    <audio controls>
                                      <source
                                        src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        type="audio/mpeg"
                                      />
                                      Your browser does not support the audio
                                      element.
                                    </audio>
                                  </>
                                )

                              case ".mp4":
                                return (
                                  <>
                                    <p className="m-0">
                                      <a
                                        href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        target="_blank"
                                        className="hover:text-blue-500 hover:underline"
                                        rel="noreferrer"
                                      >
                                        [Abrir Link]
                                      </a>
                                    </p>
                                    <video width="500" height="300" controls>
                                      <source
                                        src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        type="video/mp4"
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  </>
                                )

                              case ".png":
                              case ".jpg":
                              case ".jpeg":
                                return (
                                  <>
                                    <p className="m-0">
                                      <a
                                        href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        target="_blank"
                                        className="hover:text-blue-500 hover:underline"
                                        rel="noreferrer"
                                      >
                                        [Abrir Link]
                                      </a>
                                    </p>
                                    <div className="card flex justify-content-center">
                                      <Image
                                        src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                        alt={value.titulo}
                                        width="500"
                                        preview
                                      />
                                    </div>
                                  </>
                                )

                              default:
                                return null // Ignora tipos de arquivo não suportados
                            }
                          }

                          return (
                            <AccordionTab key={index} header={value.titulo}>
                              {renderFilePreview()}
                            </AccordionTab>
                          )
                        }
                      )}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          ))}

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="mt-10 sm:mt-0">
          {/** Public Documents Section */}
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Documentos Públicos
                </h3>
                <div className="mt-1 text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg pointer">
                      {/* <IoTrashOutline /> */}
                    </span>{" "}
                    {/* Remove a file */}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <Accordion activeIndex={0}>
                  {inscricao.data.attributes.fileLink?.map(
                    (value: any, index: number) => {
                      // Filtra apenas documentos públicos (publico: true)
                      if (value.publico !== true) return null

                      const fileExtension =
                        `${api_link}${value.ficheiro?.data?.attributes?.url}`
                          ?.slice(-4)
                          .toLowerCase() // Obtém a extensão do arquivo

                      const renderFilePreview = () => {
                        switch (fileExtension) {
                          case ".pdf":
                            return (
                              <p className="m-0">
                                <a
                                  href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                  target="_blank"
                                  className="hover:text-blue-500 hover:underline"
                                  rel="noreferrer"
                                >
                                  [Abrir Link]
                                </a>
                              </p>
                            )

                          case ".mp3":
                            return (
                              <>
                                <p className="m-0">
                                  <a
                                    href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    target="_blank"
                                    className="hover:text-blue-500 hover:underline"
                                    rel="noreferrer"
                                  >
                                    [Abrir Link]
                                  </a>
                                </p>
                                <audio controls>
                                  <source
                                    src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    type="audio/mpeg"
                                  />
                                  Your browser does not support the audio
                                  element.
                                </audio>
                              </>
                            )

                          case ".mp4":
                            return (
                              <>
                                <p className="m-0">
                                  <a
                                    href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    target="_blank"
                                    className="hover:text-blue-500 hover:underline"
                                    rel="noreferrer"
                                  >
                                    [Abrir Link]
                                  </a>
                                </p>
                                <video width="500" height="300" controls>
                                  <source
                                    src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </>
                            )

                          case ".png":
                          case ".jpg":
                          case ".jpeg":
                            return (
                              <>
                                <p className="m-0">
                                  <a
                                    href={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    target="_blank"
                                    className="hover:text-blue-500 hover:underline"
                                    rel="noreferrer"
                                  >
                                    [Abrir Link]
                                  </a>
                                </p>
                                <div className="card flex justify-content-center">
                                  <Image
                                    src={`${api_link}${value.ficheiro?.data?.attributes?.url}`}
                                    alt={value.titulo}
                                    width="500"
                                    preview
                                  />
                                </div>
                              </>
                            )

                          default:
                            return null // Ignora tipos de arquivo não suportados
                        }
                      }

                      return (
                        <AccordionTab key={index} header={value.titulo}>
                          {renderFilePreview()}
                        </AccordionTab>
                      )
                    }
                  )}
                </Accordion>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {!loading &&
          (user ? (
            <>
              <div className="mt-10 sm:mt-0">
                <div
                  id="AvaliaçaoJuri"
                  className="md:grid md:grid-cols-3 md:gap-6"
                >
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Avaliaçao dos Jurados
                      </h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <p className="mb-2">
                          <span className="text-red-500 font-bold text-lg">
                            *
                          </span>{" "}
                          Notas da Avaliaçao por parte de cada jurado
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <div className="mb-5 font-bold text-gray-500">
                      <h1>Categoria: {categoria_pnp}</h1>
                    </div>
                    <div>
                      {/* aqui vica o code da nova votação */}
                      <Votacao edicaoId={7} inscricaoId={286} userId={1} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block" aria-hidden="true">
                <div className="py-5">
                  <div className="border-t border-gray-200" />
                </div>
              </div>

              <div id="votacaoPublica" className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="px-4 sm:px-0">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Votaçao Publica
                      </h3>
                      <div className="mt-1 text-sm text-gray-600">
                        <p className="mb-2">
                          <span className="text-red-500 font-bold text-lg">
                            *
                          </span>{" "}
                          Votaçao publica por parte do publico
                        </p>
                        <p className="mb-2">
                          <span className="text-red-500 font-bold text-lg">
                            *
                          </span>{" "}
                          Apos fornecer o email use o botao de &quot;votar&quot;
                          para enviar o seu voto
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 md:col-span-2 md:mt-0">
                    <form className="" onSubmit={handleSubmit(onVotar)}>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          id="nome"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Sr. premio nacional de publicidade"
                          {...register("nome", {
                            required: true,
                          })}
                        />
                        {errors.email && (
                          <span className="text-red-500">
                            O email é obrigatorio!
                          </span>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="exemplo@pnp.cv"
                          {...register("email", {
                            required: true,
                          })}
                        />
                        {errors.email && (
                          <span className="text-red-500">
                            O email é obrigatorio!
                          </span>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="mt-5 w-full text-white bg-amarelo-ouro hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Votar
                        <svg
                          width="20"
                          height="20"
                          fill={cor}
                          aria-hidden="true"
                          className="ml-2"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          />
                        </svg>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div id="votacaoPublica" className="mt-10 sm:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                  <div className="px-4 sm:px-0">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Votaçao Publica
                    </h3>
                    <div className="mt-1 text-sm text-gray-600">
                      <p className="mb-2">
                        <span className="text-red-500 font-bold text-lg">
                          *
                        </span>{" "}
                        Votação pública por parte do público
                      </p>
                      <p className="mb-2">
                        <span className="text-red-500 font-bold text-lg">
                          *
                        </span>{" "}
                        Após digitar o seu email use o botao de
                        &quot;votar&quot; para enviar o seu voto
                      </p>
                      <p className="mb-2">
                        <span className="text-red-500 font-bold text-lg">
                          *
                        </span>{" "}
                        A votação só pode ser feita uma única vez
                      </p>
                      <p className="mb-2">
                        <span className="text-red-500 font-bold text-lg">
                          *
                        </span>{" "}
                        E-mails inválidos não serão contabilizados
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <form className="" onSubmit={handleSubmit(onVotar)}>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        id="nome"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Sr. premio nacional de publicidade"
                        {...register("nomeVota", {
                          required: true,
                        })}
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          O email é obrigatorio!
                        </span>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="exemplo@pnp.cv"
                        {...register("emailVota", {
                          required: true,
                        })}
                      />
                      {errors.email && (
                        <span className="text-red-500">
                          O email é obrigatorio!
                        </span>
                      )}
                    </div>

                    <button
                      id="votaPublico"
                      type="submit"
                      className={`mt-5 w-full text-white ${blockCor} hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                      disabled={isBlock}
                    >
                      Votar
                      <svg
                        width="20"
                        height="20"
                        fill={cor}
                        aria-hidden="true"
                        className="ml-2"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Layout>
  )
}

export default VpublicaDetalhes

// This gets called on every request
export async function getServerSideProps({ params, query }: any) {
  // Fetch data from external API
  // console.log(query);
  const { id } = query

  const queri = qs.stringify(
    {
      sort: ["N_Edicao:desc"], // Ordena pela edição mais recente
    },
    { encodeValuesOnly: true }
  )

  // GET: links das edicoes
  const edicoes = await fetcher(
    `${api_link}/api/edicoes?populate[categoria][fields]=titulo,id&[populate][inscricoes][fields]=titulo&${queri}`
  )
  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`)
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/api/contato`)
  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/api/menus?populate=deep`)
  // GET: dados dos projetos inscritos
  const inscritos = await fetcher(
    `${api_link}/api/inscricoes/${id}?populate[fileLink][populate][ficheiro][fields]=url`
  )
  //get links for menu
  let dlink: any = []
  navbar.data.map((value: any) => {
    value.attributes.items.data.map((value: any, index: any) => {
      // value.attributes.title;
      // value.attributes.url;
      // console.log(value);
      dlink[index] = {
        name: value.attributes.title,
        link: value.attributes.url,
      }
    })
  })
  //   console.log("inscritos");
  //   console.log(inscritos);

  // Pass data to the page via props
  return {
    props: {
      edicoes,
      social: rsocials,
      contato,
      navbar: dlink,
      inscricao: inscritos,
    },
  }
}
