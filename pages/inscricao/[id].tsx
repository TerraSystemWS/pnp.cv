import Head from "next/head"
import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form"
const qs = require("qs")
import toast, { Toaster } from "react-hot-toast"
import { Table } from "flowbite-react"
import { IoTrashOutline } from "react-icons/io5"
// import { useS3Upload } from "next-s3-upload"
import { useState } from "react"
import { useFetchUser } from "../../lib/authContext"
import HeroSection from "../../components/HeroSection"

//import Fileupload from "../../components/Fileupload";
//import FileList from "../../components/FileList";
// import { normalizeRouteRegex } from "next/dist/lib/load-custom-routes";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Inputs = {
  nome_completo: string
  email: string
  sede: string
  nif: number
  telefone: number
  nome_projeto: string
  categoria: string
  con_criativo: string
  coord_prod: string
  dir_foto: string
  dir_art: string
  realizador: string
  editor: string
  autor_jingle: string
  designer: string
  outras_consideracoes: string
  data_producao: Date
  data_divulgacao: Date
  data_apresentacao_publica: Date
  fileLink: string[]
}

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
  const { user, loading } = useFetchUser()
  const router = useRouter()
  const { id, cd, cid } = router.query
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
    },
  })
  // dados de categorias
  let Categoria: any = []
  // create cateoria lists
  edicao.data?.attributes.categoria.map((categs: any, index: any) => {
    Categoria[index] = {
      id: index,
      titulo: categs.titulo,
      slug: categs.titulo.replace(/ /g, "_"),
      descricao: categs.descricao,
    }
  })

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
    let dados = data
    // alert("submeter ficha de dados");
    // console.log(dados);
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");

      const res: any = await fetch(`${api_link}/api/inscricoes/${cid}`, {
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
      })

      console.log(res)

      const data = await res.json()
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao

      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true)
        } else {
          myReject(false)
        }
      })

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DE INSCRIÇÃO GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE INSCRIÇÃO",
      })
    } catch (err) {
      // console.log("erro:" + err);
    }
  }

  const onSubmitftecnica: SubmitHandler<Inputs> = async (data: any) => {
    let dados = data
    // console.log("submeter ficha de dados de ftecnica");
    // console.log(dados.categoria);
    // let categ: string = "";
    // dados.categoria.map((value: any) => {
    //   categ += value + ",";
    // });
    // return;
    // console.log("categorias");
    // console.log(categ);
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");
      const res: any = await fetch(`${api_link}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            categoria: dados.categoria,
            nome_projeto: dados.nome_projeto,
            con_criativo: dados.con_criativo,
          },
        }),
      })
      const data = await res.json()
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao
      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true)
        } else {
          myReject(false)
        }
      })

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DE TÉCNICA GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE INSCRIÇÃO",
      })
    } catch (err) {
      // console.log("erro:" + err);
    }
  }

  const onSubmitEquipa: SubmitHandler<Inputs> = async (data: any) => {
    // console.log("submeter ficha de dados de equipa");
    // console.log(data);
    let dados = data
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");
      const res: any = await fetch(`${api_link}/api/inscricoes/${cid}`, {
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
      })
      const data = await res.json()
      // console.log("data: apos await.res");
      // console.log(data);
      // code = ncode + data.data.id; // id da nova inscricao
      let myPromise = new Promise(function (myResolve, myReject) {
        if (res.status == 200) {
          myResolve(true)
        } else {
          myReject(false)
        }
      })

      toast.promise(myPromise, {
        loading: "Guardando...",
        success: "FICHA DA EQUIPA GUARDADO COM SUCESSO!",
        error: "ERRRO NA FICHA DE EQUIPA",
      })
    } catch (err) {
      // console.log("erro:" + err);
    }
  }

  /**
   * seccao para upload de arquivos
   * 
   
   * 
   */

  let deleteFile = async (fileId: string) => {
    // alert("O arquivo vai ser apadago!")
    // try {
    //   // 1. Deletar o arquivo usando o ID fornecido
    //   const deleteRes = await fetch(`${api_link}/api/upload/files/${fileId}`, {
    //     method: "DELETE",
    //   })
    //   if (!deleteRes.ok) {
    //     throw new Error("Erro ao deletar o arquivo.")
    //   }
    //   const deleteData = await deleteRes.json()
    //   alert("Arquivo deletado com sucesso:")
    //   // 2. Obter os dados atuais da inscrição (buscar fileLink)
    //   const inscricaoRes = await fetch(
    //     `${api_link}/api/inscricoes/${cid}?populate[fileLink][populate][ficheiro][fields]=id`,
    //     {
    //       method: "GET",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   if (!inscricaoRes.ok) {
    //     throw new Error("Erro ao recuperar a inscrição.")
    //   }
    //   const inscricaoData = await inscricaoRes.json()
    //   const currentFileLinks = inscricaoData.data.attributes.fileLink || []
    //   console.log("inscricaoData", inscricaoData)
    //   console.log("currentFileLinks", currentFileLinks)
    //   // 3. Filtrar o fileLink para remover o arquivo deletado
    //   const updatedFileLinks = currentFileLinks.filter(
    //     (link: any) => link.id !== fileId
    //   )
    //   console.log("currentFileLinks2", currentFileLinks)
    //   // 4. Atualizar a inscrição com o novo fileLink
    //   const updateRes = await fetch(`${api_link}/api/inscricoes/${cid}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       data: {
    //         fileLink: updatedFileLinks, // Atualizando com os links de arquivos restantes
    //       },
    //     }),
    //   })
    //   if (!updateRes.ok) {
    //     throw new Error("Erro ao atualizar a inscrição.")
    //   }
    //   const updateData = await updateRes.json()
    //   // console.log("Inscrição atualizada com sucesso:", updateData)
    //   // 5. Atualizar o estado local (remover o arquivo deletado da lista de arquivos)
    //   setFiles((prevFiles) =>
    //     prevFiles.filter((file: any) => file.id !== fileId)
    //   )
    // } catch (error) {
    //   // console.error("Erro ao deletar o arquivo:", error)
    //   alert("Erro ao deletar o arquivo. Tente novamente.")
    // }
  }

  const Atualizar = () => {
    router.reload()
  }

  // ${api_link}/api/inscricoes/${cid}

  let [files, setFiles] = useState<File[]>([]) // Store files locally

  let handleFileChange = async (event: any) => {
    let selectedFiles = event.target.files
    console.log("Selected files:", selectedFiles)
    setFiles(event.target.files)

    try {
      // Criar FormData e adicionar arquivos
      const formData = new FormData()

      // Usando diretamente o selectedFiles em vez de "files" (que pode não ter sido atualizado)
      Array.from(selectedFiles).forEach((file: any) => {
        formData.append("files", file) // Adicionando cada arquivo
      })

      // Enviar requisição para o Strapi e obter os arquivos carregados
      const uploadRes = await fetch(`${api_link}/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Erro ao fazer o upload dos arquivos")
      }

      const uploadData = await uploadRes.json()
      console.log("uploadData", uploadData)

      if (uploadData) {
        // Obter os dados atuais da inscrição
        const inscricaoRes = await fetch(
          `${api_link}/api/inscricoes/${cid}?populate[fileLink][populate][ficheiro][fields]=name,width,height,hash,ext,mime,size,url,provider`
        )
        const inscricaoData = await inscricaoRes.json()
        console.log("inscricaoData", inscricaoData)

        // Atualizar a lista de arquivos, mantendo os antigos e adicionando os novos
        const existingFiles = inscricaoData.data.attributes.fileLink || []
        console.log("existingFiles", existingFiles)

        const fileIds = [
          ...existingFiles.map((file: any) => ({
            titulo: file.titulo, // Nome do arquivo
            publico: file.publico,
            ficheiro: {
              id: file.ficheiro.data.id, // ID do arquivo
            },
          })),
          ...uploadData.map((file: any) => ({
            titulo: file.name, // Nome do arquivo
            publico: false,
            ficheiro: {
              id: file.id, // ID do arquivo
            },
          })),
        ]

        // Preparar o objeto de dados para atualizar a inscrição
        const data = {
          data: {
            fileLink: fileIds, // Associando arquivos à inscrição
          },
        }

        //return
        // Atualizar a inscrição com os arquivos carregados
        const res = await fetch(`${api_link}/api/inscricoes/${cid}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!res.ok) {
          throw new Error("Erro ao associar os arquivos à inscrição")
        }

        const responseData = await res.json()
        console.log("Resposta de atualização:", responseData)
        // setResponse(responseData) // Exibir a resposta com os dados atualizados
      } else {
        throw new Error("Dados de arquivo não foram retornados corretamente.")
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Erro ao enviar os arquivos. Por favor, tente novamente.")
    }
  }

  // let handleFileChange = async (event: any) => {
  //   let selectedFiles = event.target.files

  //   console.log("Selected files:")
  //   console.log(selectedFiles)

  //   let doc = []

  //   // Loop over the files and create an object for each file
  //   for (let i = 0; i < selectedFiles.length; i++) {
  //     let file = selectedFiles[i]
  //     console.log("file:", file.name)

  //     // Create a local link (this could be a path, data URL, or similar if needed)
  //     let fileLink = URL.createObjectURL(file) // This will generate a local URL for the file

  //     // Add file information to the doc array
  //     doc.push({
  //       titulo: file.name,
  //       file_link: fileLink,
  //     })
  //   }

  //   // Optionally, store the files in state
  //   setFiles(selectedFiles)
  //   setLinks(doc.map((file) => file.file_link)) // Store all links

  //   // Attempt to send the files to the Strapi backend
  //   try {
  //     // Get existing data to update
  //     const res_old: any = await fetch(
  //       `${api_link}/api/inscricoes/${cid}?populate=deep`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     )
  //     const data_old = await res_old.json()

  //     console.log("data_old")
  //     console.log(data_old)

  //     // Add new files to the old ones
  //     data_old.data.attributes.fileLink.map((value: string, index: number) => {
  //       doc.push({
  //         titulo: value?.titulo,
  //         file_link: value?.file_link,
  //       })
  //     })

  //     // Update the database with new file links
  //     const res: any = await fetch(`${api_link}/api/inscricoes/${cid}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         data: {
  //           fileLink: doc,
  //         },
  //       }),
  //     })

  //     const data = await res.json()

  //     // Promise to trigger success or error messages
  //     let myPromise = new Promise(function (myResolve, myReject) {
  //       if (res.status == 200) {
  //         myResolve(true)
  //       } else {
  //         myReject(false)
  //       }
  //     })

  //     // Trigger the toast notification
  //     toast.promise(myPromise, {
  //       loading: "Guardando...",
  //       success: "DOCUMENTO SUBMETIDO COM SUCESSO",
  //       error: "ERRO NA FICHA DE EQUIPA",
  //     })
  //   } catch (error) {
  //     console.error("Error uploading files:", error)
  //   }
  // }

  // submit files
  //   let { uploadToS3, files } = useS3Upload()
  //   let [link, setLink] = useState("")

  //   // let [doc, setDoc] = useState([]);

  //   let handleFileChange = async (event: any) => {
  //     // alert("terrq");
  //     // setLink("");
  //     let file = event.target.files[0]

  //     console.log("file:")
  //     console.log(file.name)

  //     let { url } = await uploadToS3(file)
  //     setLink(url)

  //     console.log("url:")
  //     console.log(url)

  //     // if (url) {
  //     let doc = []

  //     doc[0] = {
  //       // @ts-ignore
  //       titulo: file?.name,
  //       file_link: url,
  //     }
  //     // }

  //     // console.log("doc");
  //     // console.log(doc);

  //     // guardar o link e fileName no DB (strapi)
  //     try {
  //       // get all the old data
  //       const res_old: any = await fetch(
  //         `${api_link}/api/inscricoes/${cid}?populate=deep`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       )

  //       const data_old = await res_old.json()

  //       // console.log("docs 0");

  //       // console.log(doc);

  //       // let docs: any[];

  //       data_old.data.attributes.fileLink.map((value: string, index: number) => {
  //         console.log("data_old")
  //         console.log(index)
  //         // @ts-ignore
  //         doc[index + 1] = {
  //           // @ts-ignore
  //           titulo: value.titulo,
  //           // @ts-ignore
  //           file_link: value.file_link,
  //         }
  //       })

  //       // console.log("docs lasts");
  //       // console.log(doc);
  //       // console.log(doc[0].titulo);
  //       // console.log("Antes New docs");

  //       // let old_swap_new_docs: string[] = [];
  //       // old_swap_new_docs = data_old.data.fileLink;
  //       // console.log("old swap New docs");
  //       // console.log(old_swap_new_docs);
  //       // let new_docs = old_swap_new_docs.push(doc);
  //       // console.log("New docs");
  //       // console.log(new_docs);

  //       // return;
  //       const res: any = await fetch(`${api_link}/api/inscricoes/${cid}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           data: {
  //             fileLink: doc,
  //           },
  //         }),
  //       })

  //       const data = await res.json()

  //       // console.log("controle de uploads");
  //       // console.log("res");
  //       // console.log(res);
  //       // // =================
  //       // console.log("data");
  //       // console.log(data);

  //       // listen de promise
  //       let myPromise = new Promise(function (myResolve, myReject) {
  //         if (res.status == 200) {
  //           myResolve(true)
  //         } else {
  //           myReject(false)
  //         }
  //       })

  //       // triguer the toast
  //       toast.promise(myPromise, {
  //         loading: "Guardando...",
  //         success: "DOCUMENTO SUBMETIDO COM SUCESSO",
  //         error: "ERRRO NA FICHA DE EQUIPA",
  //       })
  //     } catch (error) {}
  //   }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Para aceder a sua inscrição introduza o codigo que foi criado
          como participante do PNP, use esse codigo para verificar a sua
          inscrição e ou fazer alterações"
        />
      </Head>

      <Toaster position="bottom-right" reverseOrder={false} />

      {/* hero header */}
      <HeroSection
        title={"PRÉMIO NACIONAL DE PUBLICIDADE"}
        subtitle={`guarde seu codigo para aceder a sua inscrição mais tarde`}
      />
      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block ">
                Seu codigo é: <span className="bg-amarelo-ouro">{cd}</span>
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="p-11">
        {/* Ficha de inscricao */}
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-semibold text-gray-900">
                  FICHA DE INSCRIÇÃO
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Concurso do Prémio Nacional de Publicidade
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitInscricao)}>
                <div className="overflow-hidden shadow-xl sm:rounded-xl">
                  <div className="bg-white px-6 py-8 sm:p-8 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="col-span-1">
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
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("nome_completo")}
                        />
                      </div>

                      <div className="col-span-1">
                        <label
                          htmlFor="nif"
                          className="block text-sm font-medium text-gray-700"
                        >
                          NIF
                        </label>
                        <input
                          type="number"
                          id="nif"
                          autoComplete="off"
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("nif", { valueAsNumber: true })}
                        />
                      </div>

                      <div className="col-span-1">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email-address"
                          autoComplete="email"
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("email")}
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                        <label
                          htmlFor="sede"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Sede ou Local de Residência
                        </label>
                        <input
                          type="text"
                          id="sede"
                          autoComplete="street-address"
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("sede")}
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Telefone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          autoComplete="tel"
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("telefone")}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 text-right sm:px-6 rounded-b-lg">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-6 text-sm font-medium text-white shadow-md hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
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

        {/* Ficha tecnica */}
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-semibold text-gray-900">
                  FICHA TÉCNICA
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Especifica quais as categorias a concorrer e detalhes sobre o
                  projeto
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitftecnica)}>
                <div className="shadow-xl sm:overflow-hidden sm:rounded-lg">
                  <div className="space-y-6 bg-white px-6 py-8 sm:p-8 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="col-span-1 sm:col-span-2">
                        <label
                          htmlFor="categoria"
                          className="block mb-2 text-sm font-medium text-gray-700"
                        >
                          Categoria de Prémio a que concorre
                        </label>
                        <select
                          id="categoria"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                          {...register("categoria")}
                        >
                          <option key={0} selected>
                            Escolha uma Categoria
                          </option>
                          {Categoria.map((value: any, index: any) => (
                            <option key={index + 1} value={value.titulo}>
                              {value.titulo}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-1 sm:col-span-2">
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
                          className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register("nome_projeto")}
                        />
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <label
                          htmlFor="con_criativo"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Conceito Criativo
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="con_criativo"
                            rows={4}
                            className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Descreva seu projeto"
                            defaultValue={""}
                            {...register("con_criativo")}
                          />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Breve descrição sobre seu projeto e outras observações
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-6 py-4 text-right sm:px-6 rounded-b-lg">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-6 text-sm font-medium text-white shadow-md hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
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

        {/* Equipa do projeto */}
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-xl font-semibold text-gray-900">
                  Equipa do Projeto
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Informações sobre as equipas e colaboradores do projeto
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitEquipa)}>
                <div className="shadow-xl sm:overflow-hidden sm:rounded-lg">
                  <div className="space-y-6 bg-white px-6 py-8 sm:p-8 rounded-lg">
                    {/* Coordinators and team members */}
                    {[
                      "coord_prod",
                      "dir_foto",
                      "dir_art",
                      "realizador",
                      "editor",
                      "autor_jingle",
                      "designer",
                    ].map((field, index) => (
                      <div key={index} className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor={field}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.replace("_", " ").toUpperCase()}
                        </label>
                        <input
                          type="text"
                          id={field}
                          autoComplete={field}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register(field)}
                        />
                      </div>
                    ))}

                    {/* Additional Considerations */}
                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="outras_consideracoes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Outro (considerações adicionais)
                      </label>
                      <textarea
                        id="outras_consideracoes"
                        rows={3}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Descreva seu projeto"
                        defaultValue={""}
                        {...register("outras_consideracoes")}
                      />
                    </div>

                    {/* Date Fields */}
                    {[
                      { label: "Data da sua produção", name: "data_producao" },
                      { label: "Data da divulgação", name: "data_divulgacao" },
                      {
                        label:
                          "Data da sua apresentação pública (se trabalho universitário)",
                        name: "data_apresentacao_publica",
                      },
                    ].map((field, index) => (
                      <div key={index} className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor={field.name}
                          className="block text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </label>
                        <input
                          type="date"
                          id={field.name}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                          {...register(field.name)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="bg-gray-50 px-6 py-4 text-right sm:px-6 rounded-b-lg">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-6 text-sm font-medium text-white shadow-md hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300"
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
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Documentos Submetidos
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="text-red-500 font-bold text-lg cursor-pointer">
                    <IoTrashOutline />
                  </span>{" "}
                  {/* Remove a document */}
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
                <Table hoverable={true}>
                  <Table.Head className="bg-gray-100">
                    <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm">
                      Documento
                    </Table.HeadCell>
                    <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm">
                      Link
                    </Table.HeadCell>
                    <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm">
                      <span className="sr-only">Remover</span>
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y divide-gray-200">
                    {inscricao.data.attributes.fileLink &&
                      inscricao.data.attributes.fileLink.map((value, index) => (
                        <Table.Row
                          key={index}
                          className="bg-white hover:bg-gray-50 transition-all duration-300"
                        >
                          <Table.Cell className="whitespace-nowrap py-3 px-4 text-gray-900 font-medium">
                            {value.titulo}
                          </Table.Cell>
                          <Table.Cell className="py-3 px-4">
                            <a
                              href={`${api_link}${value.ficheiro.data.attributes.url}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
                              rel="noreferrer"
                            >
                              {value.ficheiro.data.attributes.hash}
                            </a>
                          </Table.Cell>
                          <Table.Cell className="py-3 px-4">
                            <span
                              onClick={() => deleteFile(value.id)}
                              className="cursor-pointer text-red-600 hover:text-red-800 transition-all duration-300"
                            >
                              <IoTrashOutline />
                            </span>
                          </Table.Cell>
                        </Table.Row>
                      ))}
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
                <h3 className="text-xl font-semibold text-gray-900">OBS:</h3>
                <p className="mt-2 text-sm text-gray-600">
                  <p className="mb-2">
                    <span className="text-red-500 font-bold">*</span> É
                    necessário o envio da cópia do estatuto da empresa e do NIF.
                  </p>
                  <p className="mb-2">
                    <span className="text-red-500 font-bold">*</span> Bilhete de
                    identidade e NIF, se for candidatura individual.
                  </p>
                  <p className="mb-2">
                    <span className="text-red-500 font-bold">*</span> Bilhete de
                    identidade, NIF e certificado de matrícula, se for estudante
                    universitário.
                  </p>
                  <p className="mb-2">
                    <span className="text-red-500 font-bold">*</span>{" "}
                    Comprovativo de pagamento e ficha técnica do trabalho que
                    apresenta a concurso.
                  </p>
                </p>
              </div>
            </div>

            {/* <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Documentos (<span className="text-red-500 font-bold">*</span>)
                  – só é permitido documentos dos tipos imagem (
                  <span className="text-red-500 font-bold">png</span>,{" "}
                  <span className="text-red-500 font-bold">jpg</span>,{" "}
                  <span className="text-red-500 font-bold">jpeg</span>,{" "}
                  <span className="text-red-500 font-bold">gif</span>),{" "}
                  <span className="text-red-500 font-bold">pdf</span>, áudio (
                  <span className="text-red-500 font-bold">mp3</span>,{" "}
                  <span className="text-red-500 font-bold">aac</span>), vídeos (
                  <span className="text-red-500 font-bold">mp4</span>).
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Outros tipos de documentos não serão submetidos (o progresso
                  ficará a 0%).
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
                    <div>
                      {/* <input
                        onChange={handleFileChange}
                        type="file"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md"
                      /> * /}
                      <input
                        onChange={handleFileChange}
                        type="file"
                        accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3,.aac,.mp4"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md"
                      />

                      <div className="pt-8">
                        {files.map((file, index) => (
                          <div key={index}>
                            Ficheiro #{index} progress:{" "}
                            {Math.round(file.progress)}% ::{" "}
                            <a
                              href={file?.link} // Make sure `file.link` is the correct link to the file
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-500 underline"
                            >
                              link do documento
                            </a>
                          </div>
                        ))}
                      </div>

                      <div>
                        <button
                          className="bg-amarelo-ouro text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded mt-10 hover:bg-castanho-claro duration-500"
                          onClick={Atualizar}
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
            <div className="mt-5 md:col-span-2 md:mt-0">
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700"
                >
                  Documentos (<span className="text-red-500 font-bold">*</span>)
                  – só é permitido documentos dos tipos imagem (
                  <span className="text-red-500 font-bold">png</span>,{" "}
                  <span className="text-red-500 font-bold">jpg</span>,{" "}
                  <span className="text-red-500 font-bold">jpeg</span>,{" "}
                  <span className="text-red-500 font-bold">gif</span>),{" "}
                  <span className="text-red-500 font-bold">pdf</span>, áudio (
                  <span className="text-red-500 font-bold">mp3</span>,{" "}
                  <span className="text-red-500 font-bold">aac</span>), vídeos (
                  <span className="text-red-500 font-bold">mp4</span>).
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Outros tipos de documentos não serão submetidos (o progresso
                  ficará a 0%).
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
                    <div>
                      <input
                        id="file-upload"
                        onChange={handleFileChange}
                        type="file"
                        accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3,.aac,.mp4"
                        className="w-full py-2 px-4 border border-gray-300 rounded-md"
                        multiple
                      />

                      <div className="pt-8">
                        {/* Exibindo a lista de arquivos com seu progresso */}
                        {/* {files.length > 0 &&
                          files.map((file, index) => (
                            <div key={index} className="mb-4">
                              <div className="font-medium text-gray-800">
                                Ficheiro #{index + 1}
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Progresso:</strong>{" "}
                                {Math.round(file.progress)}%
                              </div>
                              {file.link && (
                                <div>
                                  <a
                                    href={file.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 underline"
                                  >
                                    Ver documento
                                  </a>
                                </div>
                              )}
                            </div>
                          ))} */}
                      </div>

                      <div>
                        <button
                          className="bg-amarelo-ouro text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded mt-10 hover:bg-castanho-claro duration-500"
                          onClick={Atualizar}
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Inscrever

export async function getServerSideProps({ query }: any) {
  const { cid } = query

  const queri = qs.stringify(
    {
      sort: ["N_Edicao:asc"],
    },
    { encodeValuesOnly: true } // prettify URL
  )

  try {
    // Fetch data from external APIs concurrently
    const [rsocials, contato, edicao, navbar, inscricao] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes/1?populate=deep&${queri}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes/${cid}?populate=deep`),
    ])

    // Process navbar data into the desired format
    const navbarLinks = navbar.data.flatMap((menu: any) =>
      menu.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    // Return data as props
    return {
      props: {
        social: rsocials,
        contato,
        edicao,
        navbar: navbarLinks,
        inscricao,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    // Return default or error state if something fails
    return {
      props: {
        social: [],
        contato: {},
        edicao: null,
        navbar: [],
        inscricao: null,
      },
    }
  }
}
