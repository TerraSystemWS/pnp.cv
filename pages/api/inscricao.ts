import { NextApiRequest, NextApiResponse } from "next"
import { v4 as uuidv4 } from "uuid"

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
    const secretKey = process.env.CLOUDFLARE_SECRET_KEY
    if (!secretKey) {
      return res.status(500).json({ error: { message: "Configuração do servidor incompleta." } })
    }
    const verificationUrl =
      "https://challenges.cloudflare.com/turnstile/v0/siteverify"

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
        return res.status(200).json({
          data: {
            id: uuidv4(),
            message: "Inscrição realizada com sucesso.",
          },
        })
      } else {
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
