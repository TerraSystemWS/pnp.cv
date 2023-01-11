import Head from "next/head";
import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
const qs = require("qs");
import toast, { Toaster } from "react-hot-toast";
import { Table } from "flowbite-react";
import { IoTrashOutline } from "react-icons/io5";
// import { normalizeRouteRegex } from "next/dist/lib/load-custom-routes";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

type Inputs = {
  nome_completo: string;
  email: string;
  sede: string;
  nif: number;
  telefone: number;
  nome_projeto: string;
  categoria: string;
  con_criativo: string;
  coord_prod: string;
  dir_foto: string;
  dir_art: string;
  realizador: string;
  editor: string;
  autor_jingle: string;
  designer: string;
  outras_consideracoes: string;
  data_producao: Date;
  data_divulgacao: Date;
  data_apresentacao_publica: Date;
  fileLink: string[];
};

// function isUUID(uuid: any) {
//   let s = "" + uuid;

//   s = s.match(
//     "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
//   );
//   if (s === null) {
//     return false;
//   }
//   return true;
// }

const Inscrever = ({ social, contato, edicao, navbar, inscricao }: any) => {
  const router = useRouter();
  const { id, cd, cid } = router.query;
  // console.log(router);
  // console.log("id::cd");
  // console.log(id + ":" + cd + ":" + cid);

  // if (!isUUID(id)) {
  //   if (typeof window === "undefined") return null;
  //   router.push(`/404`); // se nao é uuid manda para 404
  //   // console.log("uuid ss");
  // }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      nome_completo: inscricao.data.attributes.nome_completo,
      email: inscricao.data.attributes.email,
      sede: inscricao.data.attributes.sede,
      nif: inscricao.data.attributes.NIF,
      telefone: inscricao.data.attributes.telefone,
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
      fileLink: inscricao.data.attributes.fileLink,
    },
  });
  // dados de categorias
  let Categoria: any = [];
  // create cateoria lists
  edicao.data?.attributes.categoria.map((categs: any, index: any) => {
    Categoria[index] = {
      id: index,
      titulo: categs.titulo,
      slug: categs.titulo.replace(/ /g, "_"),
      descricao: categs.descricao,
    };
  });

  // const watchShowAge = watch(["NIF", "nome_completo"], false); // you can supply default value as second argument
  // const watchAllFields = watch();// ver tudo
  // formularios do grupo I
  // const watchFieldsg1 = watch([
  //   "nif",
  //   "nome_completo",
  //   "email",
  //   "sede",
  //   "telefone",
  // ]);
  // console.log("whatch fields");
  // console.log(watchFieldsg1);

  /* let num: number = 1;
  let code = "pnp-p0" + num; */

  // submits de PUT (atualizacao) para inscricao
  const onSubmitInscricao: SubmitHandler<Inputs> = async (data: any) => {
    // alert("submeter ficha de inscricao");
    // console.log(data);
    let dados = data;
    // alert("submeter ficha de dados");
    // console.log(dados);
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");

      const res: any = await fetch(`${api_link}/inscricoes/${cid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            nome_completo: dados.nome_completo,
            NIF: dados.nif || 0,
            email: dados.email,
            sede: dados.sede,
            telefone: dados.telefone || 0,
          },
        }),
      });

      console.log(res);

      const data = await res.json();
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao

      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true);
        } else {
          myReject(false);
        }
      });

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DE INSCRIÇÃO GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE INSCRIÇÃO",
      });
    } catch (err) {
      // console.log("erro:" + err);
    }
  };

  const onSubmitftecnica: SubmitHandler<Inputs> = async (data: any) => {
    let dados = data;
    // console.log("submeter ficha de dados de ftecnica");
    // console.log(dados);
    let categ: string = "";
    dados.categoria.map((value: any) => {
      categ += value + ",";
    });
    // console.log("categorias");
    // console.log(categ);
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");
      const res: any = await fetch(`${api_link}/inscricoes/${cid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            categoria: categ,
            nome_projeto: dados.nome_projeto,
            con_criativo: dados.con_criativo,
          },
        }),
      });
      const data = await res.json();
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao
      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true);
        } else {
          myReject(false);
        }
      });

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DE TÉCNICA GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE INSCRIÇÃO",
      });
    } catch (err) {
      // console.log("erro:" + err);
    }
  };

  const onSubmitEquipa: SubmitHandler<Inputs> = async (data: any) => {
    // console.log("submeter ficha de dados de equipa");
    // console.log(data);
    let dados = data;
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");
      const res: any = await fetch(`${api_link}/inscricoes/${cid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            coord_prod: dados.coord_prod,
            dir_foto: dados.dir_foto,
            dir_art: dados.dir_art,
            realizador: dados.realizador,
            editor: dados.editor,
            autor_jingle: dados.autor_jingle,
            designer: dados.designer,
            outras_consideracoes: dados.outras_consideracoes,
            data_producao: dados.data_producao,
            data_divulgacao: dados.data_divulgacao,
            data_apresentacao_publica: dados.data_apresentacao_publica,
          },
        }),
      });
      const data = await res.json();
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao
      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true);
        } else {
          myReject(false);
        }
      });

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DA EQUIPA GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE EQUIPA",
      });
    } catch (err) {
      // console.log("erro:" + err);
    }
  };

  // submeter os ficheiros
  const onSubmitFicheiros: SubmitHandler<Inputs> = async (data: any) => {
    alert("submeter ficheiro");
  };

  const deleteFile = async () => {
    alert("deleteFile");
  };

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar}>
      <Head>
        <title>Inscrição - Prémio Nacional De Publicidade</title>
      </Head>
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block text-amarelo-ouro">
                PRÉMIO NACIONAL DE PUBLICIDADE
              </span>
              <span className="block ">
                Seu codigo é: <span className="bg-amarelo-ouro">{cd}</span>
              </span>
              <p className="text-sm">
                guarde seu codigo para aceder a sua inscrição mais tarde
              </p>
            </h2>
          </div>
        </div>
      </div>
      <div className="p-11">
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
              <form onSubmit={handleSubmit(onSubmitInscricao)}>
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
                        <input
                          type="text"
                          id="first-name"
                          autoComplete="given-name"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          {...register("nome_completo")}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="nif"
                          className="block text-sm font-medium text-gray-700"
                        >
                          NIF
                        </label>
                        <input
                          type="Number"
                          id="last-name"
                          autoComplete="000 000 000"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          {...register("nif", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="email-address"
                          autoComplete="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          {...register("email")}
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="street-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sede ou Local de Residência
                        </label>
                        <input
                          type="text"
                          id="street-address"
                          autoComplete="street-address"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          {...register("sede")}
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Telefone
                        </label>
                        <input
                          type="number"
                          id="phone-code"
                          autoComplete="postal-code"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          {...register("telefone")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    {/* {watchShowAge && <input type="number" {...register("age", { min: 50 })} />} */}
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      // {  ? 'disabled' : ' '}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

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
              <form onSubmit={handleSubmit(onSubmitftecnica)}>
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
                        <select
                          multiple
                          id="countries"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          {...register("categoria")}
                        >
                          <option key={0} selected>
                            Escolha uma Categoria
                          </option>
                          {Categoria.map((value: any, index: number) => (
                            <option key={index + 1} value={value.titulo}>
                              {value.titulo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="proj_nome"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nome do Projeto
                      </label>
                      <input
                        type="text"
                        id="proj_nome"
                        autoComplete="nome projecto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("nome_projeto")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Conceito Criativo
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="descreva seu projeto"
                          defaultValue={""}
                          {...register("con_criativo")}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Breve descrição sobre seu projeto e outros observações
                      </p>
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
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

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
              <form onSubmit={handleSubmit(onSubmitEquipa)}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Coordenador / Produtor
                      </label>
                      <input
                        type="text"
                        id="coo_prod"
                        autoComplete="Coodernador / Produtor"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("coord_prod")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Diretor de Fotografia
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("dir_foto")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Diretor de Arte
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("dir_art")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Realizador
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("realizador")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Editor
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("editor")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Autoria do Jingle
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("autor_jingle")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Designer
                      </label>
                      <input
                        type="text"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("designer")}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="about"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Outro (considerações adicionais)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="outros"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="descreva seu projeto"
                          defaultValue={""}
                          {...register("outras_consideracoes")}
                        />
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
                      <input
                        type="date"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("data_producao")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data da divulgação
                      </label>
                      <input
                        type="date"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("data_divulgacao")}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="coo_prod"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Data da sua apresentação pública (se trabalho
                        universitário)
                      </label>
                      <input
                        type="date"
                        id="d_foto"
                        autoComplete="d_foto"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        {...register("data_apresentacao_publica")}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {/* lista de documentos submetidos */}
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Documentos submetidos:.
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg pointer">
                      <IoTrashOutline />
                    </span>{" "}
                    remove um ficheiro
                  </p>
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <Table hoverable={true}>
                  <Table.Head>
                    <Table.HeadCell>Documento</Table.HeadCell>
                    <Table.HeadCell>Link</Table.HeadCell>
                    <Table.HeadCell>
                      <span className="sr-only">Remover</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {/* loop para o array */}
                    {inscricao.data.attributes.fileLink &&
                      inscricao.data.attributes.fileLink.map(
                        (value: any, index: number) => (
                          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                              {value.titulo}
                            </Table.Cell>
                            <Table.Cell>
                              <a
                                href={value.file_link}
                                target="_blank"
                                className="hover:text-blue-500 hover:underline"
                              >
                                {value.file_link}
                              </a>
                            </Table.Cell>

                            <Table.Cell>
                              <span
                                onClick={deleteFile}
                                className="cursor-pointer text-red-500 hover:underline dark:text-red-500"
                              >
                                <IoTrashOutline />
                              </span>
                            </Table.Cell>
                          </Table.Row>
                        )
                      )}
                  </Table.Body>
                </Table>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {/* formulario de upload de ficheiros */}
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  OBS:.
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg">*</span> É
                    necessário o envio da cópia do estatuto da empresa e do NIF;
                  </p>
                  {/* <br /> */}
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg">*</span>{" "}
                    Bilhete de identidade e NIF, se for candidatura individual;
                  </p>
                  {/* <br /> */}
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg">*</span>{" "}
                    Bilhete de identidade, NIF e certificado de matrícula, se
                    for estudante universitário;
                  </p>
                  {/* <br /> */}
                  <p className="mb-2">
                    <span className="text-red-500 font-bold text-lg">*</span>
                    Comprovativo de pagamento e ficha técnica do trabalho que
                    apresenta a concurso.
                  </p>
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Documentos
                </label>
                <form onSubmit={handleSubmit(onSubmitFicheiros)}>
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
                          className="relative cursor-pointer rounded-md bg-white font-medium text-amarelo-ouro focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-amarelo-escuro"
                        >
                          <span>Upload dos Ficheiros</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">(link ainda não disponivel)</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 20MB
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inscrever;

// This gets called on every request
export async function getServerSideProps({ params, query }: any) {
  // Fetch data from external API
  // console.log("params");
  // console.log(params);

  // console.log("query");
  const { cid } = query;
  // console.log(cid);

  const queri = qs.stringify(
    {
      sort: ["N_Edicao:asc"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados para banners
  // const banners = await fetcher(`${api_link}/banners?populate=deep`);
  // GET: dados dos juris, categorias
  /**
   * tem que muda keli urgenti
   */
  const edicao = await fetcher(`${api_link}/edicoes/1?populate=deep&${queri}`);
  // GET: dados dos parceiros
  // const parceiros = await fetcher(`${api_link}/parceiros?populate=deep`);
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

  const inscricao = await fetcher(
    `${api_link}/inscricoes/${cid}?populate=deep`
  );

  // console.log("edicoesTT");
  // console.log(edicao);

  // Pass data to the page via props
  return {
    props: { social: rsocials, contato, edicao, navbar: dlink, inscricao },
  };
}
