import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import qs from "qs"
import Head from "next/head"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"
import Swal from "sweetalert2"
import { useFetchUser } from "../../lib/authContext"
import HeroSection from "../../components/HeroSection"
import { useEffect } from "react"

// URL da API
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// Tipos para os dados do formulário
type Inputs = {
  code: string
  ncode: string
  calc: string
}

const Inscreve = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const router = useRouter()

  // Valor final do cálculo
  const num1 = 5

  // Configuração do react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      ncode: "pnp-i", // Código padrão
    },
  })

  // Função para buscar inscrição pelo código
  const onSubmitcode: SubmitHandler<Inputs> = async (data) => {
    const { code } = data

    try {
      // Extrair ID do código
      const id = code.split("i")[1]

      // Buscar dados da inscrição
      const res = await fetch(`${api_link}/api/inscricoes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!res.ok) {
        throw new Error(`Erro HTTP! Status: ${res.status}`)
      }

      const dados = await res.json()

      // Exibir loading com SweetAlert2
      let timerInterval: any
      Swal.fire({
        title: "Procurando inscrição...",
        html: `Pesquisando o ID #pnp-i<b></b>...`,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer()?.querySelector("b")
          if (b) {
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()?.toString() || ""
            }, 100)
          }
        },
        willClose: () => {
          clearInterval(timerInterval)
        },
      })

      // Redirecionar para a página de inscrição
      router.push(
        `/inscricao/${dados.data.attributes.url}?cd=${code}&cid=${id}`
      )
    } catch (err) {
      console.error("Erro ao buscar inscrição:", err)
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao buscar inscrição. Verifique o código e tente novamente.",
      })
    }
  }

  // Função para criar nova inscrição
  const onSubmitncode: SubmitHandler<Inputs> = async (data) => {
    const { calc }: any = data

    // Verificar cálculo
    if (calc - 10 !== num1) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "O valor está incorreto. Tente novamente.",
      })
      return
    }

    // Exibir confirmação com SweetAlert2
    const result = await Swal.fire({
      title: "Prémio Nacional De Publicidade",
      text: "Antes de iniciar a candidatura, leia os regulamentos do concurso.",
      footer: '<a href="/regulamentos">Regulamentos</a>',
      imageUrl:
        "https://res.cloudinary.com/dkz8fcpla/image/upload/v1672960467/Captura_de_ecra_de_2023_01_05_22_13_23_ae07a3a795.png?updated_at=2023-01-05T23:14:27.822Z",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "PNP Gala",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2a12b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, inscrever",
    })

    if (result.isConfirmed) {
      const uurl = uuidv4()

      try {
        // Criar nova inscrição
        const res = await fetch(`${api_link}/api/inscricoes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              code: data.ncode,
              url: uurl,
              publishedAt: null,
            },
          }),
        })

        const responseData = await res.json()

        if (!responseData.data || !responseData.data.id) {
          throw new Error("Dados da inscrição não encontrados.")
        }

        const code = data.ncode + responseData.data.id
        const id = responseData.data.id

        // Exibir loading com SweetAlert2
        let timerInterval: any
        Swal.fire({
          title: "Criando sua inscrição",
          html: `Criando ID de inscrição ${data.ncode}<b></b>...`,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer()?.querySelector("b")
            if (b) {
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()?.toString() || ""
              }, 100)
            }
          },
          willClose: () => {
            clearInterval(timerInterval)
          },
        })

        // Calcular diferença de dias
        const dataInicio = new Date("2025-01-01") // Data de início
        const dataFim = new Date("2025-01-31") // Data de término
        const dataAtual = new Date() // Data atual

        // Calcular a diferença de tempo entre a data atual e a data final
        const diffTime = dataFim.getTime() - dataAtual.getTime()

        // Calcular o número de dias restantes
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) // Usar Math.ceil para arredondar para cima

        // Exibir mensagem de sucesso
        setTimeout(() => {
          Swal.fire(
            "Inscrito",
            `Sua inscrição foi efetuada com sucesso. Você tem ${diffDays} dias para finalizar o processo.`,
            "success"
          )
        }, 2500)

        // Redirecionar para a página de inscrição
        router.push(`/inscricao/${uurl}?cd=${code}&cid=${id}`)
      } catch (err) {
        console.error("Erro ao criar inscrição:", err)
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Erro ao criar inscrição. Tente novamente.",
        })
      }
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição - Prémio Nacional De Publicidade</title>
        <meta
          name="description"
          content="Para acessar sua inscrição, insira o código que foi criado como participante do PNP. Use esse código para verificar ou fazer alterações na sua inscrição."
        />
      </Head>

      <HeroSection
        title={"PRÉMIO NACIONAL DE PUBLICIDADE"}
        subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
      />

      <div className="p-11">
        {/* Formulário para acessar inscrição existente */}
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Acessar sua inscrição
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Insira o código que foi criado como participante do PNP para
                  acessar sua inscrição.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitcode)}>
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Código de acesso
                      </label>
                      <input
                        id="code"
                        autoComplete="code"
                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                        {...register("code", { required: false })}
                      />
                      {errors.code && (
                        <span className="text-red-500">
                          O código de acesso é obrigatório.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-amarelo-escuro focus:ring-offset-2"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        {/* Formulário para nova inscrição */}
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Iniciar uma inscrição
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Crie sua inscrição para o Prémio Nacional de Publicidade.
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitncode)}>
                <input type="hidden" {...register("ncode")} />
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="calc"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Qual o valor?
                      </label>
                      <p>{num1} + 10</p>
                      <input
                        id="calc"
                        autoComplete="calc"
                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                        {...register("calc", { required: false })}
                      />
                      {errors.calc && (
                        <span className="text-red-500">
                          O valor é obrigatório.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-amarelo-escuro focus:ring-offset-2"
                  >
                    Abrir inscrição
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Inscreve

// Função para buscar dados no servidor
export async function getServerSideProps() {
  const query = qs.stringify(
    {
      sort: ["N_Edicao:asc"],
    },
    {
      encodeValuesOnly: true,
    }
  )

  try {
    const [rsocials, contato, edicao, navbar] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes/1?populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])

    const dlink = navbar.data.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    return {
      props: {
        social: rsocials,
        contato,
        edicao,
        navbar: dlink,
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return {
      props: {
        social: { data: null },
        contato: { data: null },
        edicao: { data: null },
        navbar: [],
      },
    }
  }
}
