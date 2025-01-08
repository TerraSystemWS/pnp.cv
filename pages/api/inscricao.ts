import { NextApiRequest, NextApiResponse } from "next"

interface FormData {
  ncode: string
  turnstileResponse: string
}

interface CloudflareCaptchaResponse {
  success: boolean
  "error-codes"?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method === "POST") {
    const { ncode, turnstileResponse }: FormData = req.body.data // Dados do formulário (incluindo 'turnstileResponse')

    // 1. Validar o CAPTCHA com a API do Cloudflare
    const secretKey = process.env.CLOUDFLARE_SECRET_KEY || " " // Adicione sua chave secreta no arquivo .env.local
    const verificationUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"

    console.log("#### secrete key ##: ")
    console.log(secretKey)

    try {
      const response = await fetch(verificationUrl, {
        method: "POST",
        body: new URLSearchParams({
          secret: secretKey, // Sua chave secreta do Cloudflare
          response: turnstileResponse, // Resposta do CAPTCHA fornecida pelo usuário
        }),
      })
      const result: CloudflareCaptchaResponse = await response.json()

      // 2. Verificar se o CAPTCHA foi validado com sucesso
      if (result.success) {
        console.log("Captcha validado com sucesso!")

        // Agora você pode processar a inscrição (ex: salvar no banco de dados)
        // Aqui, estou apenas simulando o processo com um ID fictício
        const userId = Math.floor(Math.random() * 10000) // ID fictício

        return res.status(200).json({
          data: {
            id: userId,
            message: "Inscrição realizada com sucesso.",
          },
        })
      } else {
        console.log("Falha na validação do CAPTCHA.")
        return res.status(400).json({
          error: {
            message: "Falha na validação do CAPTCHA.",
          },
        })
      }
    } catch (error) {
      console.error("Erro ao verificar CAPTCHA:", error)
      return res.status(500).json({
        error: {
          message: "Erro no servidor ao verificar CAPTCHA.",
        },
      })
    }
  } else {
    // Se o método da requisição não for POST, retorna erro
    return res.status(405).json({ error: "Método não permitido" })
  }
}
