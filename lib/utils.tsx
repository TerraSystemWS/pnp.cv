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

// const email = 'example@example.com';
// const apiKey = 'fa6b6859-5d0a-40b6-b65f-bfb0174dd4ad';

// fetch(`https://api.mails.so/v1/validate?email=${email}`, {
//   method: 'GET',
//   headers: {
//     'x-mails-api-key': apiKey
//   }
// })
// .then(response => response.json())
// .then(data => console.log(data))
// .catch(error => console.error('Error:', error));

// Função para verificar um e-mail usando a API Hunter
export async function verificarEmail(email: any) {
  const apiKey = "fa6b6859-5d0a-40b6-b65f-bfb0174dd4ad" // Sua chave da API
  const url = `https://api.mails.so/v1/validate?email=${email}`

  try {
    // Fazendo a solicitação GET à API
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-mails-api-key": apiKey,
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*", // replace this your actual origin
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
      },
    })

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
