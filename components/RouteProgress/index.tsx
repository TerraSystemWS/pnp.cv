import { useEffect, useState } from "react"
import Router from "next/router"
import { GOLD } from "../../lib/theme"

// Barra de progresso fina no topo, ligada aos eventos reais de navegação do
// Next.js — substitui o spinner de tela cheia que ficava 2s fixos em toda
// página, sem depender do carregamento de dado nenhum.
const RouteProgress = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout>

    const start = () => {
      clearTimeout(hideTimeout)
      setVisible(true)
    }
    const done = () => {
      // pequeno atraso evita o "flash" em navegações muito rápidas (SSG/cache)
      hideTimeout = setTimeout(() => setVisible(false), 150)
    }

    Router.events.on("routeChangeStart", start)
    Router.events.on("routeChangeComplete", done)
    Router.events.on("routeChangeError", done)
    return () => {
      Router.events.off("routeChangeStart", start)
      Router.events.off("routeChangeComplete", done)
      Router.events.off("routeChangeError", done)
      clearTimeout(hideTimeout)
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes route-progress-sweep {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          zIndex: 9999,
          overflow: "hidden",
          background: visible ? `${GOLD}33` : "transparent",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "100%",
            background: GOLD,
            animation: visible ? "route-progress-sweep 0.9s ease-in-out infinite" : "none",
          }}
        />
      </div>
    </>
  )
}

export default RouteProgress
