import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import AccountShell from "../../components/Conta/AccountShell"
import { fetcher } from "../../lib/api"
import { getLayoutProps } from "../../lib/layoutProps"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type Inputs = { email: string }

const EsqueciPassword = ({ social, contato, navbar }: any) => {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async ({ email }) => {
    try {
      await fetcher(`${api_link}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
    } catch (err) {
      console.error("Forgot password failed:", err)
    }
    // Mesma resposta haja ou não conta com este email.
    setSent(true)
  }

  return (
    <AccountShell
      social={social}
      contato={contato}
      navbar={navbar}
      title="Recuperar password"
      subtitle={sent ? undefined : "Indique o email da sua conta e enviamos um link para definir uma nova password."}
    >
      {sent ? (
        <div className="acc-alert acc-alert-ok">
          Se existir uma conta com esse email, vai receber um link para redefinir a password dentro de momentos.
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="acc-field">
            <label className="acc-label" htmlFor="email">Email</label>
            <input id="email" className="acc-input" type="email" autoComplete="email"
              {...register("email", { required: "Email obrigatório" })} />
            {errors.email && <p className="acc-err">{errors.email.message}</p>}
          </div>
          <button type="submit" className="acc-btn" disabled={isSubmitting}>
            {isSubmitting ? "A enviar…" : "Enviar link →"}
          </button>
        </form>
      )}
    </AccountShell>
  )
}

export default EsqueciPassword

export async function getServerSideProps() {
  return { props: await getLayoutProps() }
}
