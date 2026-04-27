import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" })
  }

  const { email } = req.query
  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email inválido" })
  }

  const apiKey = process.env.MAILS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: "Configuração do servidor incompleta." })
  }

  try {
    const response = await fetch(`https://api.mails.so/v1/validate?email=${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { "x-mails-api-key": apiKey },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: "Erro ao verificar o e-mail" })
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error("Erro na validação de email:", error)
    return res.status(500).json({ error: "Erro no servidor ao verificar o e-mail." })
  }
}
