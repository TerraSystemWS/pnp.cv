import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"

interface Inputs {
  coord_prod: string
  dir_foto: string
  dir_art: string
  realizador: string
  editor: string
  autor_jingle: string
  designer: string
  outras_consideracoes: string
  data_producao: string
  data_divulgacao: string
  data_apresentacao_publica: string
}

interface Props {
  cid: string
  apiLink: string
  defaults: Partial<Inputs>
}

const TEAM_FIELDS: { name: keyof Inputs; label: string }[] = [
  { name: "coord_prod", label: "COORD PROD" },
  { name: "dir_foto", label: "DIR FOTO" },
  { name: "dir_art", label: "DIR ART" },
  { name: "realizador", label: "REALIZADOR" },
  { name: "editor", label: "EDITOR" },
  { name: "autor_jingle", label: "AUTOR JINGLE" },
  { name: "designer", label: "DESIGNER" },
]

const DATE_FIELDS: { name: keyof Inputs; label: string }[] = [
  { name: "data_producao", label: "Data da sua produção" },
  { name: "data_divulgacao", label: "Data da divulgação" },
  { name: "data_apresentacao_publica", label: "Data da sua apresentação pública (se trabalho universitário)" },
]

export default function EquipaForm({ cid, apiLink, defaults }: Props) {
  const { register, handleSubmit } = useForm<Inputs>({ defaultValues: defaults })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })

      toast.promise(Promise.resolve(res.ok ? true : Promise.reject()), {
        loading: "Guardando...",
        success: "FICHA DA EQUIPA GUARDADA COM SUCESSO!",
        error: "ERRO NA FICHA DE EQUIPA",
      })
    } catch {
      toast.error("ERRO NA FICHA DE EQUIPA")
    }
  }

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-xl font-semibold text-gray-900">Equipa do Projeto</h3>
            <p className="mt-2 text-sm text-gray-600">Informações sobre as equipas e colaboradores do projeto</p>
          </div>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow-xl sm:overflow-hidden sm:rounded-lg">
              <div className="space-y-6 bg-white px-6 py-8 sm:p-8 rounded-lg">
                {TEAM_FIELDS.map((field) => (
                  <div key={field.name} className="col-span-6 sm:col-span-4">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.name}
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                      {...register(field.name)}
                    />
                  </div>
                ))}

                <div className="col-span-6 sm:col-span-4">
                  <label htmlFor="outras_consideracoes" className="block text-sm font-medium text-gray-700">
                    Outro (considerações adicionais)
                  </label>
                  <textarea
                    id="outras_consideracoes"
                    rows={3}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Descreva seu projeto"
                    {...register("outras_consideracoes")}
                  />
                </div>

                {DATE_FIELDS.map((field) => (
                  <div key={field.name} className="col-span-6 sm:col-span-4">
                    <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
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
