import { useForm, SubmitHandler } from "react-hook-form"
import { useState, useEffect } from "react"
import JSConfetti from "js-confetti"
import Swal from "sweetalert2"
// import Votacao from "../../components/Votacao"
import { getTokenFromLocalCookie } from "../../lib/auth"
import { getAvaliacaos } from "../../lib/utils"

interface FormValues {
  criteria1: string
}

const getBackgroundColor = (nota: any) => {
  switch (nota?.toLowerCase()) {
    case "insuficiente":
      return "bg-red-400"
    case "suficiente":
      return "bg-yellow-400"
    case "bom":
      return "bg-blue-400"
    default:
      return "bg-green-400"
  }
}

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const Votacao = ({ edicaoId, inscricaoId, userId }: any) => {
  const jwt = getTokenFromLocalCookie()
  // gaurdar para usal mais tarde
  const [avaliacao, setAvaliacao] = useState<any>(null)

  // getAvaliacaos(inscricaoId, userId)
  // .then(avaliacao => {
  //   console.log(avaliacao);  // Access the resolved data
  // })
  // .catch(error => {
  //   console.error("Error fetching data:", error);  // Handle any errors
  // });

  useEffect(() => {
    getAvaliacaos(inscricaoId, userId, jwt)
      .then((avaliacao2) => {
        setAvaliacao(avaliacao2) // Atualize o estado com a avaliação
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }, [inscricaoId, userId, jwt]) // Dependências para chamar novamente se mudar

  // const avaliacao = avaliacaos.find(
  //   (avaliacao: any) =>
  //     avaliacao.attributes.user_id?.data.id === userId && // Agora está comparando com o userId carregado
  //     avaliacao.attributes.inscricoe?.data.id === inscricaoId
  // )

  // Estado para armazenar o userId
  // const [userId, setUserId] = useState<string | null>(null)

  // if (avaliacao) {
  //   console.log("avaliacao: ")
  //   console.log(avaliacao.attributes.notas)
  // } else {
  //   console.log("Nao tem avaliacao: ")
  // }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()
  const [result, setResult] = useState<string>("")
  const [isBlock, setBlock] = useState(false)
  const [blockCor, setBlockCor] = useState("bg-amarelo-ouro")

  // Mapeamento dos números para palavras, cores e classes
  const numberToWord: Record<number, string> = {
    1: "insuficiente",
    2: "Insuficiente",
    3: "Suficiente",
    4: "Bom",
    5: "Excelente",
  }

  const numberToText: Record<number, string> = {
    1: "Nota 1: Insuficiente - A resposta é considerada insatisfatória e não atende aos requisitos mínimos.",
    2: "Nota 2: Insuficiente - A resposta ainda não é adequada, mas mostra algum entendimento básico.",
    3: "Nota 3: Suficiente - A resposta atende aos requisitos mínimos e mostra uma compreensão adequada.",
    4: "Nota 4: Bom - A resposta é boa e demonstra uma compreensão sólida com poucos erros.",
    5: "Nota 5: Excelente - A resposta é excelente e demonstra uma compreensão profunda e completa.",
  }

  const numberToColor: Record<number, string> = {
    1: "bg-red-400",
    2: "bg-red-400",
    3: "bg-yellow-400",
    4: "bg-blue-400",
    5: "bg-green-400",
  }

  // Obtenha o valor selecionado em tempo real
  const selectedValue = watch("criteria1")

  // console.log("User Token: " + jwt)
  // console.log("user_ids: " + userId)

  // console.log("inscricoe: " + inscricaoId)
  // console.log("value: " + value)
  // console.log("Nota: " + numberToWord[value])
  // console.log("comentario:" + numberToText[value])
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    const jsConfetti = new JSConfetti()

    const value = parseInt(data.criteria1)
    const colorClass = numberToColor[value]
    const resultText = `<span class="${colorClass} text-white p-2 rounded">${numberToWord[value]}</span>`
    setResult(resultText)

    // Enviar a avaliação para a API do Strapi
    try {
      const response = await fetch(`${api_link}/api/avaliacaos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Caso você tenha autenticação JWT, pode incluir o token de autorização aqui
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            notas: numberToWord[value], // Envia o nome da avaliação, ex: "Insuficiente", "Suficiente", etc.
            comentario: numberToText[value],
            // Ajustar para passar os IDs do usuário e da inscrição
            user_id: userId, // ID do usuário jurado
            inscricoe: inscricaoId, // ID da inscrição
          },
        }),
      })

      if (response.ok) {
        const registrada: string = "criada"
        setBlock(true)
        setBlockCor("bg-gray-500")
        setAvaliacao({
          sim: true,
          notas: numberToWord[value],
          comentario: numberToText[value],
        })
        jsConfetti.addConfetti({
          emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
          emojiSize: 10,
          confettiNumber: 500,
        })

        Swal.fire({
          icon: "success",
          title: "Votação Concluída",
          text: `Sua avaliação foi ${registrada} com sucesso!`,
        })

        // Desabilitar o botão após o primeiro envio
        setIsButtonDisabled(true)
      } else {
        throw new Error("Erro ao criar a avaliação.")
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível enviar sua avaliação. Tente novamente.",
      })
    }
  }

  return (
    <div className="mx-auto p-6 bg-white shadow-md rounded-lg">
      {avaliacao && avaliacao.sim ? (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Avaliado
          </h1>
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full">
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full ${getBackgroundColor(
                  avaliacao.notas
                )}`}
              >
                <span className="text-white font-bold text-lg">
                  {avaliacao.notas[0]}{" "}
                  {/* Mostra apenas a primeira letra para ícones simples */}
                </span>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xl font-semibold">{avaliacao.comentario}</p>
                <p className="text-gray-600 mt-2 text-lg">{avaliacao.notas}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center">Avaliação</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              {errors.criteria1 && (
                <span className="text-red-500">
                  Escolha do número é obrigatória!
                </span>
              )}
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label key={value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`c1-${value}`}
                      value={value}
                      {...register("criteria1", { required: true })}
                      className="hidden"
                    />
                    <span
                      className={`cursor-pointer text-2xl w-12 h-12 flex items-center justify-center text-white font-bold rounded-full ${
                        numberToColor[value]
                      } ${
                        parseInt(selectedValue || "0") === value
                          ? "ring-4 ring-black"
                          : ""
                      }`}
                      onClick={() =>
                        setResult(
                          `<span class="${numberToColor[value]} text-white p-2 rounded">${numberToWord[value]}</span>`
                        )
                      }
                    >
                      {value}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-amarelo-ouro text-white font-bold rounded-lg hover:bg-yellow-500"
              disabled={isButtonDisabled}
            >
              Enviar Avaliação
            </button>
          </form>
        </>
      )}

      {result && (
        <div className="mt-6 text-center">
          <p dangerouslySetInnerHTML={{ __html: result }} />
          {selectedValue && (
            <div className="mt-6 text-center text-lg">
              <p>{numberToText[parseInt(selectedValue)]}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Votacao
