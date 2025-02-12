export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"
}

export function getStrapiMedia(url: string | null) {
  if (url == null) return null
  if (url.startsWith("data:")) return url
  if (url.startsWith("http") || url.startsWith("//")) return url
  return `${getStrapiURL()}${url}`
}

// const formatDateTime = (dateTimeString) => {
//   const date = new Date(dateTimeString);
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();

//   return `${hours}:${minutes} ${day}-${month}-${year}`;
// };

export const formatDateTime = (dateTimeString: string): string => {
  const date = new Date(dateTimeString)
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  return `${hours}:${minutes} ${day}-${month}-${year}`
}

// Função para verificar um e-mail usando a API Hunter
export async function verificarEmail(email: any) {
  const apiKey = "0eea5ef3ee42e576bc7e33feb1bd96b0995c96a3" // Sua chave da API
  const url = `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${apiKey}`

  try {
    // Fazendo a solicitação GET à API
    const response = await fetch(url)

    // Verificando se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao verificar o e-mail")
    }

    // Convertendo a resposta para JSON
    const data = await response.json()

    console.log("verificar email")
    console.log(data)

    // Verificando o resultado da verificação
    if (data.data) {
      console.log("Resultado da verificação de e-mail:", data.data)
      return data.data
    } else {
      console.log("Erro na verificação do e-mail:", data)
      return null
    }
  } catch (error) {
    console.error("Erro na requisição:", error)
  }
}

// // Exemplo de uso
// const email = 'patrick@stripe.com'; // Substitua pelo e-mail que deseja verificar
// verificarEmail(email);
