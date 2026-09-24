import { useState } from "react"
import Swal from "sweetalert2"
import { apiClient } from "../../lib/api"
import { getTokenFromLocalCookie } from "../../lib/auth"
import { FileLink } from "../../types/strapi"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER } from "../../lib/theme"

interface Props {
  url: string
  apiLink: string
  // Candidatura já aceite — não se pode enviar nem apagar ficheiros.
  readOnly?: boolean
  existingFiles: FileLink[]
  onFilesUpdated: (files: FileLink[]) => void
}

interface UploadingFile {
  name: string
  progress: number
  status: "uploading" | "done" | "error"
}

export default function FileUploadSection({ url, apiLink, readOnly = false, existingFiles, onFilesUpdated }: Props) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const jwt = getTokenFromLocalCookie() ?? ""
  const authHeader = { Authorization: `Bearer ${jwt}` }

  const deleteFile = async (file: FileLink) => {
    const fileId = file.ficheiro.data?.id
    if (!fileId) return
    const result = await Swal.fire({
      title: "Apagar ficheiro?",
      text: `"${file.titulo}" será removido da candidatura. Esta ação não pode ser desfeita.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#8a8170",
      confirmButtonText: "Sim, apagar",
      cancelButtonText: "Cancelar",
    })
    if (!result.isConfirmed) return

    setDeletingId(fileId)
    try {
      const res = await apiClient.deleteWithAuth(`/api/inscricoes/mine/${url}/files/${fileId}`, jwt)
      onFilesUpdated(res.data?.attributes?.fileLink ?? [])
    } catch (err) {
      console.error("Erro ao apagar ficheiro:", err)
      Swal.fire({ icon: "error", title: "Erro", text: "Não foi possível apagar o ficheiro. Tente novamente." })
    } finally {
      setDeletingId(null)
    }
  }

  const processFiles = async (selectedFiles: FileList) => {
    const list: UploadingFile[] = Array.from(selectedFiles).map((f) => ({
      name: f.name,
      progress: 0,
      status: "uploading" as const,
    }))
    setUploading(list)

    for (let i = 0; i < selectedFiles.length; i++) {
      await uploadFile(selectedFiles[i], i, list)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
  }

  // Ficheiros grandes enviados de ligações lentas/instáveis (ex: Cabo Verde)
  // nunca completam um único POST antes de a ligação ser cortada (~60s).
  // Por isso o envio é feito em pedaços pequenos, cada um curto o suficiente
  // para terminar mesmo em ligações fracas, com retry por pedaço.
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB
  const MAX_CHUNK_RETRIES = 3

  const uploadChunkWithRetry = (
    uploadId: string,
    chunkIndex: number,
    blob: Blob,
    onChunkProgress: (loaded: number) => void
  ): Promise<void> => {
    const attempt = (retriesLeft: number): Promise<void> =>
      new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append("chunk", blob)

        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) onChunkProgress(event.loaded)
        }

        xhr.onreadystatechange = () => {
          if (xhr.readyState !== XMLHttpRequest.DONE) return

          if (xhr.status === 200) {
            resolve()
          } else if (retriesLeft > 0) {
            onChunkProgress(0)
            setTimeout(() => {
              attempt(retriesLeft - 1).then(resolve, reject)
            }, 800 * (MAX_CHUNK_RETRIES - retriesLeft + 1))
          } else {
            reject(new Error(`Falha ao enviar pedaço ${chunkIndex}`))
          }
        }

        xhr.open("POST", `${apiLink}/api/chunked-upload/${uploadId}/chunks/${chunkIndex}`)
        xhr.setRequestHeader("Authorization", `Bearer ${jwt}`)
        xhr.send(formData)
      })

    return attempt(MAX_CHUNK_RETRIES)
  }

  const uploadFile = (file: File, index: number, list: UploadingFile[]): Promise<void> =>
    (async () => {
      try {
        const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

        const initRes = await fetch(`${apiLink}/api/chunked-upload/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({
            filename: file.name,
            mimetype: file.type || "application/octet-stream",
            size: file.size,
            totalChunks,
          }),
        })
        if (!initRes.ok) throw new Error("Não foi possível iniciar o upload")
        const { uploadId } = await initRes.json()

        let bytesSentBeforeCurrentChunk = 0
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
          const start = chunkIndex * CHUNK_SIZE
          const end = Math.min(start + CHUNK_SIZE, file.size)
          const blob = file.slice(start, end)

          // eslint-disable-next-line no-await-in-loop
          await uploadChunkWithRetry(uploadId, chunkIndex, blob, (loadedInChunk) => {
            const percent = Math.round(
              ((bytesSentBeforeCurrentChunk + loadedInChunk) * 100) / file.size
            )
            setUploading((prev) => {
              const next = [...prev]
              next[index] = { ...next[index], progress: percent }
              return next
            })
          })

          bytesSentBeforeCurrentChunk += end - start
        }

        const completeRes = await fetch(`${apiLink}/api/chunked-upload/${uploadId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({}),
        })
        if (!completeRes.ok) throw new Error("Não foi possível concluir o upload")
        const uploadData = await completeRes.json()

        // Associa o ficheiro à candidatura no servidor (que confirma que é do utilizador).
        const attached = await apiClient.post(
          `/api/inscricoes/mine/${url}/files`,
          { fileIds: uploadData.map((f: { id: number }) => f.id) },
          jwt
        )
        onFilesUpdated(attached.data?.attributes?.fileLink ?? [])

        setUploading((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], progress: 100, status: "done" }
          return next
        })
      } catch {
        setUploading((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], status: "error" }
          return next
        })
      }
    })()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Existing files table */}
      {existingFiles.length > 0 && (
        <div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.75rem" }}>
            Ficheiros Submetidos ({existingFiles.length})
          </p>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
            {existingFiles.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.85rem 1.25rem",
                  background: i % 2 === 0 ? CARD : BG_ALT,
                  borderBottom: i < existingFiles.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.99rem", color: INK, overflowWrap: "anywhere" }}>
                    {f.titulo}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <a
                    href={`${apiLink}${f.ficheiro.data?.attributes?.url}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.858rem", fontWeight: 700, color: INK, textDecoration: "none", padding: "4px 12px", border: `1px solid ${BORDER}`, borderRadius: "100px" }}
                  >
                    Abrir
                  </a>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => deleteFile(f)}
                      disabled={deletingId !== null}
                      aria-label={`Apagar ${f.titulo}`}
                      style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.858rem", fontWeight: 700, color: "#c0392b", background: "none", padding: "4px 12px", border: "1px solid #c0392b55", borderRadius: "100px", cursor: deletingId !== null ? "default" : "pointer", opacity: deletingId !== null && deletingId !== f.ficheiro.data?.id ? 0.5 : 1 }}
                    >
                      {deletingId === f.ficheiro.data?.id ? "A apagar…" : "Apagar"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      {!readOnly && (
      <div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.75rem" }}>
          Adicionar Ficheiros
        </p>

        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            padding: "2.5rem",
            border: `2px dashed ${isDragging ? GOLD : BORDER}`,
            borderRadius: "12px",
            background: isDragging ? `${GOLD}0a` : BG_ALT,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={GOLD_DARK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.99rem", color: INK, margin: "0 0 0.25rem" }}>
              Arraste ficheiros ou <span style={{ color: GOLD_DARK, textDecoration: "underline" }}>clique para selecionar</span>
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.858rem", color: INK_SOFT, margin: 0 }}>
              PNG, JPG, PDF, MP3, AAC, MP4
            </p>
          </div>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.pdf,.mp3,.aac,.mp4"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Obs */}
        <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: BG_ALT, border: `1px solid ${BORDER}`, borderRadius: "8px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.935rem", color: INK, margin: "0 0 0.4rem", fontWeight: 700 }}>
            Documentos obrigatórios:
          </p>
          {[
            "Cópia do estatuto da empresa e NIF (empresas)",
            "Bilhete de identidade e NIF (candidatura individual)",
            "BI, NIF e certificado de matrícula (estudante universitário)",
            "Comprovativo de pagamento e ficha técnica do trabalho",
          ].map((item, i) => (
            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.935rem", color: INK_SOFT, margin: "0.3rem 0 0", display: "flex", gap: "0.5rem" }}>
              <span style={{ color: GOLD_DARK, flexShrink: 0 }}>·</span> {item}
            </p>
          ))}
        </div>
      </div>

      )}

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", fontWeight: 700, color: GOLD_DARK, margin: 0 }}>
            A enviar…
          </p>
          {uploading.map((f, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.968rem", color: INK }}>{f.name}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.902rem", fontWeight: 700, color: f.status === "error" ? "#c0392b" : f.status === "done" ? GOLD_DARK : INK_SOFT }}>
                  {f.status === "error" ? "Erro" : f.status === "done" ? "✓ Concluído" : `${f.progress}%`}
                </span>
              </div>
              <div style={{ height: "4px", background: BORDER, borderRadius: "100px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${f.progress}%`,
                  background: f.status === "error" ? "#c0392b" : GOLD,
                  borderRadius: "100px",
                  transition: "width 0.2s",
                }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
