import { useState } from "react"
import Link from "next/link"
import { useForm, SubmitHandler } from "react-hook-form"
import AccountShell from "../../components/Conta/AccountShell"
import { ApiError, fetcher } from "../../lib/api"
import { openLogin } from "../../lib/auth"
import { getLayoutProps } from "../../lib/layoutProps"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Inputs = { nome: string; email: string; password: string; confirm: string }

// Verificação opcional de entregabilidade (mails.so, via rota server-side).
// Se o serviço falhar, não bloqueia o registo — só rejeita o que é
// garantidamente inválido.
const isUndeliverable = async (email: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/validate-email?email=${encodeURIComponent(email)}`)
    if (!res.ok) return false
    const data = await res.json()
    return data?.data?.result === "undeliverable"
  } catch {
    return false
  }
}

const Registar = ({ social, contato, navbar }: any) => {
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [resend, setResend] = useState<"idle" | "sending" | "sent">("idle")
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null)
    const email = data.email.trim().toLowerCase()

    if (await isUndeliverable(email)) {
      setError("Este email não parece válido. Verifique se está bem escrito.")
      return
    }

    try {
      await fetcher(`${api_link}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, email, password: data.password, nome: data.nome.trim() }),
      })
      setSentTo(email)
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : ""
      setError(
        /already taken/i.test(msg)
          ? "Já existe uma conta com este email. Entre ou recupere a password."
          : "Não foi possível criar a conta. Tente novamente."
      )
    }
  }

  const resendConfirmation = async () => {
    if (!sentTo) return
    setResend("sending")
    try {
      await fetcher(`${api_link}/api/auth/send-email-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: sentTo }),
      })
    } catch (err) {
      console.error("Resend confirmation failed:", err)
    }
    setResend("sent")
  }

  if (sentTo) {
    return (
      <AccountShell social={social} contato={contato} navbar={navbar} title="Verifique o seu email">
        <div className="acc-alert acc-alert-ok">
          Enviámos um link de confirmação para <b>{sentTo}</b>. Abra-o para ativar a conta — só depois
          poderá entrar e candidatar-se. Se não o encontrar, veja a pasta de spam.
        </div>
        <button className="acc-btn-ghost" onClick={resendConfirmation} disabled={resend !== "idle"}>
          {resend === "sent" ? "Email reenviado" : resend === "sending" ? "A reenviar…" : "Reenviar email de confirmação"}
        </button>
      </AccountShell>
    )
  }

  return (
    <AccountShell
      social={social}
      contato={contato}
      navbar={navbar}
      title="Criar conta"
      subtitle="Com uma conta pode candidatar os seus projetos ao Prémio e votar na votação pública."
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="acc-field">
          <label className="acc-label" htmlFor="nome">Nome completo</label>
          <input id="nome" className="acc-input" autoComplete="name"
            {...register("nome", { required: "Nome obrigatório", minLength: { value: 3, message: "Nome demasiado curto" } })} />
          {errors.nome && <p className="acc-err">{errors.nome.message}</p>}
        </div>

        <div className="acc-field">
          <label className="acc-label" htmlFor="email">Email</label>
          <input id="email" className="acc-input" type="email" autoComplete="email" placeholder="nome@email.com"
            {...register("email", {
              required: "Email obrigatório",
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
            })} />
          {errors.email && <p className="acc-err">{errors.email.message}</p>}
        </div>

        <div className="acc-field">
          <label className="acc-label" htmlFor="password">Password</label>
          <input id="password" className="acc-input" type="password" autoComplete="new-password"
            {...register("password", { required: "Password obrigatória", minLength: { value: 8, message: "Mínimo 8 caracteres" } })} />
          {errors.password && <p className="acc-err">{errors.password.message}</p>}
        </div>

        <div className="acc-field">
          <label className="acc-label" htmlFor="confirm">Confirmar password</label>
          <input id="confirm" className="acc-input" type="password" autoComplete="new-password"
            {...register("confirm", {
              required: "Confirme a password",
              validate: (v) => v === watch("password") || "As passwords não coincidem",
            })} />
          {errors.confirm && <p className="acc-err">{errors.confirm.message}</p>}
        </div>

        {error && <div className="acc-alert acc-alert-err">{error}</div>}

        <button type="submit" className="acc-btn" disabled={isSubmitting}>
          {isSubmitting ? "A criar conta…" : "Criar conta →"}
        </button>
      </form>

      <p className="acc-foot">
        Já tem conta?{" "}
        <button type="button" onClick={openLogin} className="acc-link" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", font: "inherit" }}>
          Entrar
        </button>
        {" · "}
        <Link href="/regulamentos" className="acc-link">Regulamento</Link>
      </p>
    </AccountShell>
  )
}

export default Registar

export async function getServerSideProps() {
  return { props: await getLayoutProps() }
}
