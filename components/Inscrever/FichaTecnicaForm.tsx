import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"
import { Categoria } from "../../types/strapi"

interface Inputs {
  categoria: string
  nome_projeto: string
  con_criativo: string
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
  categorias: Categoria[]
}

export default function FichaTecnicaForm({ cid, apiLink, defaults, categorias }: Props) {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues: defaults })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            categoria: data.categoria,
            nome_projeto: data.nome_projeto,
            con_criativo: data.con_criativo,
          },
        }),
      })

      toast.promise(Promise.resolve(res.ok ? true : Promise.reject()), {
        loading: "Guardando...",
        success: "FICHA TÉCNICA GUARDADA COM SUCESSO!",
        error: "ERRO NA FICHA TÉCNICA",
      })
    } catch {
      toast.error("ERRO NA FICHA TÉCNICA")
    }
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-xl font-semibold text-gray-900">FICHA TÉCNICA</h3>
            <p className="mt-2 text-sm text-gray-600">
              Especifica quais as categorias a concorrer e detalhes sobre o projeto
            </p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow-xl sm:overflow-hidden sm:rounded-lg">
              <div className="space-y-6 bg-white px-6 py-8 sm:p-8 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-700">
                      Categoria de Prémio a que concorre
                    </label>
                    <select
                      id="categoria"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                      {...register("categoria")}
                    >
                      <option>Escolha uma Categoria</option>
                      {categorias.map((cat, i) => (
                        <option key={i} value={cat.titulo}>{cat.titulo}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="nome_projeto" className="block text-sm font-medium text-gray-700">
                      Nome do Projeto
                    </label>
                    <input
                      type="text"
                      id="nome_projeto"
                      className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      {...register("nome_projeto")}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="con_criativo" className="block text-sm font-medium text-gray-700">
                      Conceito Criativo
                    </label>
                    <textarea
                      id="con_criativo"
                      rows={4}
                      className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Descreva seu projeto"
                      {...register("con_criativo")}
                    />
                    <p className="mt-2 text-sm text-gray-500">Breve descrição sobre seu projeto e outras observações</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 text-right sm:px-6 rounded-b-lg">
                <button type="submit" className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-6 text-sm font-medium text-white shadow-md hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300">
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
