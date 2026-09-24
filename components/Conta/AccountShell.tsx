import Head from "next/head"
import { ReactNode } from "react"
import Layout from "../Layout"
import { useFetchUser } from "../../lib/authContext"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

interface Props {
  social: any
  contato: any
  navbar: any
  title: string
  subtitle?: string
  children: ReactNode
}

// Moldura comum das páginas /conta/* — cartão centrado no estilo de /inscricao.
// As classes .acc-* ficam disponíveis para os formulários dentro do cartão.
export default function AccountShell({ social, contato, navbar, title, subtitle, children }: Props) {
  const { user } = useFetchUser()

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>{`${title} — Prémio Nacional De Publicidade`}</title>
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes accFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .acc-page { background: ${BG}; min-height: 80vh; font-family: ${FONT}; padding: 7rem 1rem 6rem; }
        .acc-card {
          max-width: 460px; margin: 0 auto;
          background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 20px;
          padding: 2.5rem; animation: accFadeUp 0.5s ease both;
        }
        .acc-title { font-size: 1.9rem; font-weight: 700; color: ${INK}; margin: 0 0 0.4rem; }
        .acc-sub { font-size: 0.95rem; color: ${INK_SOFT}; line-height: 1.6; margin: 0 0 2rem; }
        .acc-label { display: block; font-size: 0.8rem; font-weight: 600; color: ${INK}; margin-bottom: 8px; }
        .acc-field { margin-bottom: 1.1rem; }
        .acc-input {
          width: 100%; box-sizing: border-box;
          background: ${BG}; border: 1px solid ${BORDER}; border-radius: 10px;
          padding: 12px 16px; font-size: 0.95rem; color: ${INK}; font-family: ${FONT};
          transition: border-color 0.2s;
        }
        .acc-input:focus { outline: none; border-color: ${GOLD}; }
        .acc-input[readonly] { background: ${BG_ALT}; color: ${INK_SOFT}; }
        .acc-btn {
          width: 100%; background: ${GOLD}; border: none; border-radius: 10px;
          padding: 13px 24px; font-family: ${FONT}; font-size: 0.92rem; font-weight: 700; color: ${INK};
          cursor: pointer; transition: background 0.2s, transform 0.15s;
        }
        .acc-btn:hover:not(:disabled) { background: #d4aa40; transform: translateY(-1px); }
        .acc-btn:disabled { opacity: 0.6; cursor: default; }
        .acc-btn-ghost {
          background: transparent; border: 1px solid ${BORDER}; border-radius: 10px;
          padding: 11px 20px; font-family: ${FONT}; font-size: 0.88rem; font-weight: 600; color: ${INK};
          cursor: pointer; width: 100%;
        }
        .acc-err { color: #c0392b; font-size: 0.82rem; margin-top: 5px; }
        .acc-alert { border-radius: 10px; padding: 0.9rem 1.1rem; font-size: 0.9rem; line-height: 1.55; margin-bottom: 1.25rem; }
        .acc-alert-ok { background: ${BG_ALT}; border: 1px solid ${BORDER}; color: ${INK}; }
        .acc-alert-err { background: #fdecea; border: 1px solid #f5c6c0; color: #8e2a1f; }
        .acc-link { color: ${GOLD_DARK}; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .acc-foot { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: ${INK_SOFT}; }
        @media (max-width: 520px) { .acc-card { padding: 2rem 1.4rem; } }
      `}</style>

      <div className="acc-page">
        <div className="acc-card">
          <h1 className="acc-title">{title}</h1>
          {subtitle && <p className="acc-sub">{subtitle}</p>}
          {children}
        </div>
      </div>
    </Layout>
  )
}
