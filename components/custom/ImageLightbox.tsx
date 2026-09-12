import { useEffect } from "react"

// Lightbox nativo (sem dependência externa): clique numa imagem pra ver em
// tamanho grande, Escape ou clique fora fecha. Usado na Galeria e nos
// ficheiros/documentos de um projeto.
const ImageLightbox = ({ image, onClose }: { image: { url: string; title: string } | null; onClose: () => void }) => {
  useEffect(() => {
    if (!image) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [image, onClose])

  if (!image) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", cursor: "zoom-out" }}
    >
      <button
        onClick={onClose}
        aria-label="Fechar"
        style={{ position: "fixed", top: "1.5rem", right: "1.5rem", background: "transparent", border: "none", color: "#fff", cursor: "pointer", padding: "6px" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.url}
        alt={image.title}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: "8px", boxShadow: "0 30px 80px rgba(0,0,0,0.6)", cursor: "default" }}
      />
    </div>
  )
}

export default ImageLightbox
