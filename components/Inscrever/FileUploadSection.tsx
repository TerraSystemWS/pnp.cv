import { useState } from "react"
import { Table } from "flowbite-react"
import { IoTrashOutline } from "react-icons/io5"
import { FileLink } from "../../types/strapi"

interface Props {
  cid: string
  apiLink: string
  existingFiles: FileLink[]
  onConfirm: () => void
}

export default function FileUploadSection({ cid, apiLink, existingFiles, onConfirm }: Props) {
  const [files, setFiles] = useState<(File & { progress: number })[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles) return

    const updatedFiles = Array.from(selectedFiles).map((file) =>
      Object.assign(file, { progress: 0 })
    )
    setFiles(updatedFiles)

    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadFile(selectedFiles[i], i)
    }
  }

  const uploadFile = (file: File, index: number): Promise<void> =>
    new Promise((resolve) => {
      const formData = new FormData()
      formData.append("files", file)

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total)
          setFiles((prev) => {
            const next = [...prev]
            next[index] = Object.assign(next[index], { progress: percent })
            return next
          })
        }
      }

      xhr.onreadystatechange = async () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return

        if (xhr.status === 200) {
          setIsUploading(true)
          try {
            const uploadData = JSON.parse(xhr.responseText)
            const inscricaoRes = await fetch(
              `${apiLink}/api/inscricoes/${cid}?populate[fileLink][populate][ficheiro][fields]=name,hash,ext,mime,url`
            )
            const inscricaoData = await inscricaoRes.json()
            const existing = inscricaoData.data?.attributes?.fileLink ?? []

            const fileIds = [
              ...existing.map((f: FileLink) => ({
                titulo: f.titulo,
                publico: f.publico,
                ficheiro: { id: f.ficheiro.data?.id },
              })),
              ...uploadData.map((f: { id: number; name: string }) => ({
                titulo: f.name,
                publico: false,
                ficheiro: { id: f.id },
              })),
            ]

            await fetch(`${apiLink}/api/inscricoes/${cid}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: { fileLink: fileIds } }),
            })
          } catch (error) {
            console.error("Erro ao associar arquivo:", error)
            alert("Erro ao associar o arquivo. Por favor, tente novamente.")
          } finally {
            setIsUploading(false)
          }
        }
        resolve()
      }

      xhr.open("POST", `${apiLink}/api/upload`)
      xhr.send(formData)
    })

  return (
    <>
      {/* Documentos submetidos */}
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Documentos Submetidos</h3>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
              <Table hoverable={true}>
                <Table.Head className="bg-gray-100">
                  <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm">Documento</Table.HeadCell>
                  <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm">Link</Table.HeadCell>
                  <Table.HeadCell className="text-gray-700 font-medium py-3 px-4 text-sm"><span className="sr-only">Remover</span></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y divide-gray-200">
                  {existingFiles.map((value, index) => (
                    <Table.Row key={index} className="bg-white hover:bg-gray-50 transition-all duration-300">
                      <Table.Cell className="whitespace-nowrap py-3 px-4 text-gray-900 font-medium">{value.titulo}</Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        <a
                          href={`${apiLink}${value.ficheiro.data?.attributes.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
                        >
                          {value.ficheiro.data?.attributes.hash}
                        </a>
                      </Table.Cell>
                      <Table.Cell className="py-3 px-4">
                        <span className="cursor-pointer text-red-600 hover:text-red-800 transition-all duration-300">
                          <IoTrashOutline />
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5"><div className="border-t border-gray-200" /></div>
      </div>

      {/* Upload de ficheiros */}
      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-xl font-semibold text-gray-900">OBS:</h3>
              <p className="mt-2 text-sm text-gray-600">
                <span className="text-red-500 font-bold">*</span> É necessário o envio da cópia do estatuto da empresa e do NIF.<br />
                <span className="text-red-500 font-bold">*</span> Bilhete de identidade e NIF, se for candidatura individual.<br />
                <span className="text-red-500 font-bold">*</span> Bilhete de identidade, NIF e certificado de matrícula, se for estudante universitário.<br />
                <span className="text-red-500 font-bold">*</span> Comprovativo de pagamento e ficha técnica do trabalho que apresenta a concurso.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Documentos (<span className="text-red-500 font-bold">*</span>) – só é permitido imagem (png, jpg, jpeg, gif), pdf, áudio (mp3, aac), vídeos (mp4).
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3,.aac,.mp4"
                      className="w-full py-2 px-4 border border-gray-300 rounded-md"
                      multiple
                    />
                    <div className="pt-8">
                      {files.map((file, index) => (
                        <div key={index}>
                          Ficheiro #{index} progress: {Math.round(file.progress)}%
                        </div>
                      ))}
                    </div>
                    <div>
                      <button
                        className="bg-amarelo-ouro text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded mt-10 hover:bg-castanho-claro duration-500"
                        onClick={onConfirm}
                        disabled={isUploading}
                        type="button"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
