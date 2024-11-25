import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { useForm, SubmitHandler } from "react-hook-form"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { useState } from "react"
// link para a URL do API
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Inputs = {
  name: string
  email: string
  message: string
}

const CONTATOS = ({ social, contato, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
    // setStatus,
  } = useForm<Inputs>()

  const [statusMessage, setStatusMessage] = useState("")

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // Limpa o status anterior
    setStatusMessage("")
    try {
      // Envia os dados para o backend
      const url = `${api_link}/contato`
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
        }),
      })

      const result = await response.json()

      if (response.status === 200) {
        setStatusMessage("Sua mensagem foi enviada com sucesso!")
      } else {
        setStatusMessage(
          "Houve um erro ao enviar sua mensagem. Tente novamente mais tarde."
        )
      }
    } catch (error) {
      setStatusMessage("Erro ao enviar a mensagem. Tente novamente.")
      console.error("Erro no envio do formulário:", error)
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Contatos - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Página de contatos" />
      </Head>

      <section className="text-gray-600 body-font relative mt-5">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              marginHeight={0}
              marginWidth={0}
              scrolling="no"
              src={contato.data.attributes.mapa}
            ></iframe>
            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  ENDEREÇO
                </h2>
                <p className="mt-1">{contato.data.attributes.Local}</p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs">
                  EMAIL
                </h2>
                <a className="text-indigo-500 leading-relaxed">
                  {contato.data.attributes.email}
                </a>
                <h2 className="title-font font-semibold text-gray-900 tracking-widest text-xs mt-4">
                  Contato
                </h2>
                <p className="leading-relaxed">
                  {contato.data.attributes.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0"
          >
            <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">
              Contate-nos
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600">
              Para saber ou ter mais informações sobre o PNP, envie-nos um email
            </p>

            {/* Campo Nome */}
            <div className="relative mb-4">
              <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                {...register("name", { required: "Nome é obrigatório" })}
              />
              {errors.name && (
                <span className="text-red-500">{errors.name.message}</span>
              )}
            </div>

            {/* Campo Email */}
            <div className="relative mb-4">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                {...register("email", { required: "Email é obrigatório" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>

            {/* Campo Mensagem */}
            <div className="relative mb-4">
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-600"
              >
                Mensagem
              </label>
              <textarea
                id="message"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                {...register("message", { required: "Mensagem é obrigatória" })}
              ></textarea>
              {errors.message && (
                <span className="text-red-500">{errors.message.message}</span>
              )}
            </div>

            {/* Botão de Envio */}
            <button
              type="submit"
              className="text-white bg-yellow-600 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-500 rounded text-lg"
            >
              Enviar
            </button>

            {/* Mensagem de Status */}
            {statusMessage && (
              <p className="text-xs mt-3 text-gray-500">{statusMessage}</p>
            )}

            <p className="text-xs text-gray-500 mt-3">
              *Os seus dados são privados e serão protegidos.
            </p>
          </form>
        </div>
      </section>
    </Layout>
  )
}

export default CONTATOS

// Função para buscar dados do servidor
export async function getServerSideProps() {
  const rsocials = await fetcher(`${api_link}/api/redes-social?populate=*`)
  const contato = await fetcher(`${api_link}/api/contato`)
  const navbar = await fetcher(`${api_link}/api/menus?populate=deep`)

  let dlink: any = []
  navbar.data.map((value: any) => {
    value.attributes.items.data.map((item: any, index: any) => {
      dlink[index] = {
        name: item.attributes.title,
        link: item.attributes.url,
      }
    })
  })

  return { props: { social: rsocials, contato, navbar: dlink } }
}
