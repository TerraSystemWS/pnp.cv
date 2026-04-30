import { useState } from "react"
import { FileLink } from "../../types/strapi"

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_MID    = "#0d0a05"

interface Props {
  cid: string
  apiLink: string
  existingFiles: FileLink[]
  onFilesUpdated: (files: FileLink[]) => void
}

interface UploadingFile {
  name: string
  progress: number
  status: "uploading" | "done" | "error"
}

export default function FileUploadSection({ cid, apiLink, existingFiles, onFilesUpdated }: Props) {
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

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

  const uploadFile = (file: File, index: number, list: UploadingFile[]): Promise<void> =>
    new Promise((resolve) => {
      const formData = new FormData()
      formData.append("files", file)

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total)
          setUploading((prev) => {
            const next = [...prev]
            next[index] = { ...next[index], progress: percent }
            return next
          })
        }
      }

      xhr.onreadystatechange = async () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return

        if (xhr.status === 200) {
          try {
            const uploadData = JSON.parse(xhr.responseText)

            // Fetch current inscription file list
            const inscricaoRes = await fetch(
              `${apiLink}/api/inscricoes/${cid}?populate[fileLink][populate][ficheiro][fields]=name,hash,ext,mime,url`
            )
            const inscricaoData = await inscricaoRes.json()
            const existing: FileLink[] = inscricaoData.data?.attributes?.fileLink ?? []

            const merged = [
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

            const putRes = await fetch(`${apiLink}/api/inscricoes/${cid}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ data: { fileLink: merged } }),
            })

            if (putRes.ok) {
              // Fetch final file list to update parent
              const finalRes = await fetch(
                `${apiLink}/api/inscricoes/${cid}?populate[fileLink][populate][ficheiro][fields]=name,hash,ext,mime,url`
              )
              const finalData = await finalRes.json()
              onFilesUpdated(finalData.data?.attributes?.fileLink ?? [])

              setUploading((prev) => {
                const next = [...prev]
                next[index] = { ...next[index], progress: 100, status: "done" }
                return next
              })
            }
          } catch {
            setUploading((prev) => {
              const next = [...prev]
              next[index] = { ...next[index], status: "error" }
              return next
            })
          }
        } else {
          setUploading((prev) => {
            const next = [...prev]
            next[index] = { ...next[index], status: "error" }
            return next
          })
        }
        resolve()
      }

      xhr.open("POST", `${apiLink}/api/upload`)
      xhr.send(formData)
    })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Existing files table */}
      {existingFiles.length > 0 && (
        <div>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.75rem" }}>
            Ficheiros Submetidos ({existingFiles.length})
          </p>
          <div style={{ border: `1px solid ${GOLD}22`, borderRadius: "10px", overflow: "hidden" }}>
            {existingFiles.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.85rem 1.25rem",
                  background: i % 2 === 0 ? DARK_CARD : `${DARK_CARD}cc`,
                  borderBottom: i < existingFiles.length - 1 ? `1px solid ${GOLD}12` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: `${GOLD_BRIGHT}99` }}>
                    {f.titulo}
                  </span>
                </div>
                <a
                  href={`${apiLink}${f.ficheiro.data?.attributes?.url}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: `${GOLD}77`, textDecoration: "none", padding: "4px 12px", border: `1px solid ${GOLD}28`, borderRadius: "100px" }}
                >
                  Abrir
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload zone */}
      <div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, marginBottom: "0.75rem" }}>
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
            border: `2px dashed ${isDragging ? GOLD + "88" : GOLD + "28"}`,
            borderRadius: "12px",
            background: isDragging ? `${GOLD}08` : DARK_CARD,
            cursor: "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: `${GOLD_BRIGHT}77`, margin: "0 0 0.25rem" }}>
              Arraste ficheiros ou <span style={{ color: GOLD, textDecoration: "underline" }}>clique para selecionar</span>
            </p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: `${GOLD}44`, margin: 0 }}>
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
        <div style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: `${GOLD}08`, border: `1px solid ${GOLD}18`, borderRadius: "8px" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: `${GOLD}77`, margin: "0 0 0.4rem", fontWeight: 500 }}>
            Documentos obrigatórios:
          </p>
          {[
            "Cópia do estatuto da empresa e NIF (empresas)",
            "Bilhete de identidade e NIF (candidatura individual)",
            "BI, NIF e certificado de matrícula (estudante universitário)",
            "Comprovativo de pagamento e ficha técnica do trabalho",
          ].map((item, i) => (
            <p key={i} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: `${GOLD}55`, margin: "0.2rem 0 0", display: "flex", gap: "0.5rem" }}>
              <span style={{ color: GOLD, flexShrink: 0 }}>·</span> {item}
            </p>
          ))}
        </div>
      </div>

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: `${GOLD}66`, margin: 0 }}>
            A enviar…
          </p>
          {uploading.map((f, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: `${GOLD_BRIGHT}88` }}>{f.name}</span>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: f.status === "error" ? "#e74c3c" : f.status === "done" ? `${GOLD_BRIGHT}99` : `${GOLD}77` }}>
                  {f.status === "error" ? "Erro" : f.status === "done" ? "✓ Concluído" : `${f.progress}%`}
                </span>
              </div>
              <div style={{ height: "4px", background: `${GOLD}18`, borderRadius: "100px", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${f.progress}%`,
                  background: f.status === "error" ? "#e74c3c" : `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})`,
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
