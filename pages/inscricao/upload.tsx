import React, { useState } from "react"

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [response, setResponse] = useState<unknown>(null)
  const [inscricaoId] = useState(2)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files ?? []))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (files.length === 0) {
      alert("Por favor, selecione pelo menos um arquivo.")
      return
    }

    setIsUploading(true)

    try {
      // Criar FormData e adicionar arquivos
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file) // Adicionando cada arquivo
      })

      // Adicionar os metadados ao FormData
      // formData.append("ref", "api::inscricao.inscricao") // Nome da coleção onde o arquivo será armazenado
      // formData.append("refId", inscricaoId) // ID da inscrição a ser atualizada
      // formData.append("field", "fileLink") // Campo onde o arquivo será armazenado (no caso, fileLink)

      // Enviar requisição para o Strapi e obter os arquivos carregados
      const uploadRes = await fetch("https://api.pnp.cv/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        throw new Error("Erro ao fazer o upload dos arquivos")
      }

      const uploadData = await uploadRes.json()
      console.log("uploadData", uploadData)

      // Verificando se os dados de 'ficheiro' são retornados corretamente
      if (uploadData) {
        // Obter os dados atuais da inscrição
        const inscricaoRes = await fetch(
          `https://api.pnp.cv/api/inscricoes/${inscricaoId}?populate[fileLink][populate][ficheiro][fields]=name,width,height,hash,ext,mime,size,url,provider`
        )
        const inscricaoData = await inscricaoRes.json()

        console.log("inscricaoData")
        console.log(inscricaoData)

        // Atualizar a lista de arquivos, mantendo os antigos e adicionando os novos
        // try to hard write the media fields kkkk
        const existingFiles = inscricaoData.data.attributes.fileLink || []

        console.log("existingFiles")
        console.log(existingFiles[0])

        const fileIds = [
          ...existingFiles, // Manter os arquivos existentes
          ...uploadData.map((file: { id: number; name: string }) => ({
            titulo: file.name, // Nome do arquivo
            publico: true,
            ficheiro: {
              id: file.id, // ID do arquivo
            },
          })),
        ]

        console.log("fields")
        console.log(fileIds)

        // Preparar o objeto de dados para atualizar a inscrição
        const data = {
          data: {
            fileLink: fileIds, // Associando arquivos à inscrição
          },
        }

        // Atualizar a inscrição com os arquivos carregados
        const res = await fetch(
          `https://api.pnp.cv/api/inscricoes/${inscricaoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        )

        if (!res.ok) {
          throw new Error("Erro ao associar os arquivos à inscrição")
        }

        const responseData = await res.json()
        setResponse(responseData) // Exibir a resposta com os dados atualizados
      } else {
        throw new Error("Dados de arquivo não foram retornados corretamente.")
      }
    } catch (error) {
      console.error(error)
      alert("Erro no upload. Tente novamente.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h1>Upload de Arquivo(s)</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} multiple />
        <button type="submit" disabled={isUploading}>
          {isUploading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {response !== null && (
        <div>
          <h2>Resposta do Strapi:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
