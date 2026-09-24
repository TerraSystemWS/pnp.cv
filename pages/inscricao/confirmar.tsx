import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import AccountShell from "../../components/Conta/AccountShell"
import { fetcher } from "../../lib/api"
import { getTokenFromLocalCookie, openLogin } from "../../lib/auth"
import { getLayoutProps } from "../../lib/layoutProps"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

// Destino do link do email enviado ao submeter a candidatura (?token=...).
// A confirmação é um clique explícito (POST) — os scanners de links dos
// clientes de email só fazem GET e não confirmam sozinhos.
const ConfirmarCandidatura = ({ social, contato, navbar }: any) => {
  const router = useRouter()
  const token = typeof router.query.token === "string" ? router.query.token : ""
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const confirmar = async () => {
    setError(null)
    setSending(true)
    try {
      const res = await fetcher(`${api_link}/api/inscricoes/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
      // Com sessão, volta diretamente ao portal das candidaturas.
      if (getTokenFromLocalCookie()) {
        router.replace("/inscricao?confirmada=1")
        return
      }
      setDone(res?.data?.nome_projeto || "")
    } catch {
      setError("O link é inválido, já foi usado ou o prazo de confirmação terminou.")
    } finally {
      setSending(false)
    }
  }

  if (done !== null) {
    return (
      <AccountShell social={social} contato={contato} navbar={navbar} title="Candidatura confirmada">
        <div className="acc-alert acc-alert-ok">
          {done ? <>A candidatura <strong>{done}</strong> foi confirmada.</> : "A sua candidatura foi confirmada."}{" "}
          Obrigado pela sua participação no Prémio Nacional de Publicidade.
        </div>
        <button className="acc-btn" onClick={openLogin}>Entrar e ver as minhas candidaturas →</button>
      </AccountShell>
    )
  }

  return (
    <AccountShell
      social={social}
      contato={contato}
      navbar={navbar}
      title="Confirmar candidatura"
      subtitle="Último passo para concluir a sua candidatura."
    >
      {router.isReady && !token ? (
        <div className="acc-alert acc-alert-err">
          Link incompleto. Abra novamente o link do email ou peça um novo em{" "}
          <Link href="/inscricao" className="acc-link">As minhas candidaturas</Link>.
        </div>
      ) : (
        <>
          {error && <div className="acc-alert acc-alert-err">{error}</div>}
          <div className="acc-alert acc-alert-ok">
            Declaro, sob compromisso de honra, que as informações submetidas nesta candidatura são verdadeiras
            e que desejo participar no Prémio Nacional de Publicidade, de acordo com o{" "}
            <Link href="/regulamentos" className="acc-link">regulamento</Link> do concurso.
          </div>
          <button className="acc-btn" onClick={confirmar} disabled={sending || !token}>
            {sending ? "A confirmar…" : "Confirmo e quero participar"}
          </button>
        </>
      )}
    </AccountShell>
  )
}

export default ConfirmarCandidatura

export async function getServerSideProps() {
  return { props: await getLayoutProps() }
}
