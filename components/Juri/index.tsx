import Link from "next/link"
import { StrapiImage } from "../custom/StrapiImage"

const Juri = ({ dados }: { dados: any[] }) => {
  // Função para dividir os dados em grupos de 3
  const groupItems = (items: any[]) => {
    const grouped = []
    for (let i = 0; i < items.length; i += 3) {
      grouped.push(items.slice(i, i + 3)) // Cria grupos de 3 itens
    }
    return grouped
  }

  // Função para truncar o HTML com segurança
  const truncateHtml = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = html
    let text = tempDiv.textContent || tempDiv.innerText
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-amarelo-ouro dark:text-white">
            JÚRI DA {dados[0]?.edicao}ª EDIÇÃO
          </h2>
          <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
            Conheça mais sobre a comissão dos jurados
          </p>
        </div>

        {/* Organizando em grupos de 3 */}
        <div className="flex flex-col items-center gap-8 mb-6 lg:mb-16">
          {groupItems(dados).map((group, groupIndex) => (
            <div key={groupIndex} className="flex justify-center gap-8 w-full">
              {group.map((value, index) => (
                <div
                  key={value.idd}
                  className="flex flex-col items-center bg-gray-50 rounded-lg shadow sm:flex-row dark:bg-gray-800 dark:border-gray-700 w-[30rem]"
                >
                  <Link href={`/juris/${value.idd}?edicao=${value.edicao}`}>
                    <StrapiImage
                      className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                      src={value.j_foto}
                      alt={value.j_nome}
                      height={300}
                      width={300}
                    />
                  </Link>
                  <div className="p-5">
                    <h3 className="text-xl font-bold tracking-tight text-amarelo-ouro dark:text-white">
                      <Link href={`/juris/${value.idd}?edicao=${value.edicao}`}>
                        {value.j_nome}
                      </Link>
                    </h3>
                    <span className="text-gray-800 dark:text-gray-400">
                      {value.j_titulo}
                    </span>
                    <p className="mt-3 mb-4 font-light text-gray-500 dark:text-gray-400">
                      {/* Truncando a descrição HTML e renderizando corretamente */}
                      {typeof value.j_descricao === "string" ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: truncateHtml(value.j_descricao, 100),
                          }}
                        />
                      ) : (
                        ""
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Juri
