import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form"
import AccountShell from "../../components/Conta/AccountShell"
import { fetcher } from "../../lib/api"
import { openLogin } from "../../lib/auth"
import { getLayoutProps } from "../../lib/layoutProps"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Inputs = { password: string; confirm: string }

// Destino do link do email de recuperação (?code=...).
const RedefinirPassword = ({ social, contato, navbar }: any) => {
  const router = useRouter()
  const code = typeof router.query.code === "string" ? router.query.code : ""
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setError(null)
    try {
      await fetcher(`${api_link}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password: data.password, passwordConfirmation: data.confirm }),
      })
      setDone(true)
    } catch {
      setError("O link é inválido ou já expirou. Peça um novo link de recuperação.")
    }
  }

  if (done) {
    return (
      <AccountShell social={social} contato={contato} navbar={navbar} title="Password alterada">
        <div className="acc-alert acc-alert-ok">A sua password foi alterada. Já pode entrar com a nova password.</div>
        <button className="acc-btn" onClick={openLogin}>Entrar →</button>
      </AccountShell>
    )
  }

  return (
    <AccountShell social={social} contato={contato} navbar={navbar} title="Nova password">
      {router.isReady && !code ? (
        <div className="acc-alert acc-alert-err">
          Link incompleto. <Link href="/conta/esqueci-password" className="acc-link">Peça um novo link</Link>.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="acc-field">
            <label className="acc-label" htmlFor="password">Nova password</label>
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
          {error && (
            <div className="acc-alert acc-alert-err">
              {error} <Link href="/conta/esqueci-password" className="acc-link">Novo link</Link>
            </div>
          )}
          <button type="submit" className="acc-btn" disabled={isSubmitting}>
            {isSubmitting ? "A guardar…" : "Guardar password →"}
          </button>
        </form>
      )}
    </AccountShell>
  )
}

export default RedefinirPassword

export async function getServerSideProps() {
  return { props: await getLayoutProps() }
}
