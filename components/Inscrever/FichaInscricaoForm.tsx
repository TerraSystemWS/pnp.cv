import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"

interface Inputs {
  nome_completo: string
  email: string
  sede: string
  nif: number
  telefone: number
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
}

export default function FichaInscricaoForm({ cid, apiLink, defaults }: Props) {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues: defaults })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            nome_completo: data.nome_completo,
            NIF: data.nif || 0,
            email: data.email,
            sede: data.sede,
            telefone: data.telefone || 0,
          },
        }),
      })

      toast.promise(Promise.resolve(res.ok ? true : Promise.reject()), {
        loading: "Guardando...",
        success: "FICHA DE INSCRIÇÃO GUARDADO COM SUCESSO!",
        error: "ERRO NA FICHA DE INSCRIÇÃO",
      })
    } catch {
      toast.error("ERRO NA FICHA DE INSCRIÇÃO")
    }
  }

  return (
    <div className="mt-10 sm:mt-0">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-xl font-semibold text-gray-900">FICHA DE INSCRIÇÃO</h3>
            <p className="mt-2 text-sm text-gray-600">Concurso do Prémio Nacional de Publicidade</p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="overflow-hidden shadow-xl sm:rounded-xl">
              <div className="bg-white px-6 py-8 sm:p-8 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Nome Completo (Empresa ou candidato individual)", name: "nome_completo", type: "text", autoComplete: "given-name", colSpan: "" },
                    { label: "NIF", name: "nif", type: "number", autoComplete: "off", colSpan: "" },
                    { label: "Email", name: "email", type: "email", autoComplete: "email", colSpan: "" },
                    { label: "Sede ou Local de Residência", name: "sede", type: "text", autoComplete: "street-address", colSpan: "col-span-1 sm:col-span-2 lg:col-span-3" },
                    { label: "Telefone", name: "telefone", type: "tel", autoComplete: "tel", colSpan: "col-span-1 sm:col-span-2 lg:col-span-1" },
                  ].map((field) => (
                    <div key={field.name} className={field.colSpan || "col-span-1"}>
                      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        id={field.name}
                        autoComplete={field.autoComplete}
                        className="mt-2 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                        {...register(field.name as keyof Inputs)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 text-right sm:px-6 rounded-b-lg">
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
