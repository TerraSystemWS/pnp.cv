import Layout from "../../components/Layout"
import { fetcher, apiClient, ApiError } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form"
import Swal from "sweetalert2"
import UserProfileCard from "../../components/custom/sidemenu"
import { getTokenFromLocalCookie, setToken, unsetToken } from "../../lib/auth"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type PasswordForm = {
  currentPassword: string
  password: string
  passwordConfirmation: string
}

const roleLabels: Record<string, string> = {
  jurado: "Jurado",
  responsavel: "Responsável",
  authenticated: "Utilizador",
}

const Perfil = ({ social, contato, navbar }: any) => {
  const { user, role, loading } = useFetchUser()
  const router = useRouter()

  const [email, setEmail] = useState<string | null>(null)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaving, setPwSaving] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  useEffect(() => {
    const jwt = getTokenFromLocalCookie()
    if (!jwt) return
    apiClient
      .getWithAuth("/api/users/me?fields=email", jwt)
      .then((data: { email?: string }) => setEmail(data?.email ?? null))
      .catch(() => setEmail(null))
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>()

  const onChangePassword: SubmitHandler<PasswordForm> = async (data) => {
    setPwError(null)
    setPwSaving(true)
    const jwt = getTokenFromLocalCookie()
    try {
      const res = await fetcher(`${api_link}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify(data),
      })
      reset()
      await Swal.fire({
        icon: "success",
        title: "Password alterada",
        text: "A sua password foi atualizada com sucesso.",
        confirmButtonColor: GOLD,
      })
      setToken(res)
    } catch (err) {
      setPwError(
        err instanceof ApiError && err.status === 400
          ? "Password atual incorreta."
          : "Não foi possível alterar a password. Tente novamente."
      )
    } finally {
      setPwSaving(false)
    }
  }

  if (loading || !user) {
    return null
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Perfil - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Configurações da sua conta no Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .perfil-card { background: ${CARD}; border: 1px solid ${BORDER}; border-radius: 16px; padding: 2rem; animation: fadeUp 0.5s ease both; }
        .perfil-label { display: block; font-size: 0.82rem; font-weight: 600; color: ${INK}; margin-bottom: 6px; }
        .perfil-input { width: 100%; background: ${BG}; border: 1px solid ${BORDER}; border-radius: 9px; padding: 11px 14px; font-size: 0.92rem; font-family: ${FONT}; color: ${INK}; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
        .perfil-input:focus { border-color: ${GOLD}; }
        .perfil-btn { background: ${GOLD}; border: none; border-radius: 10px; padding: 13px 24px; font-family: ${FONT}; font-size: 0.9rem; font-weight: 700; color: ${INK}; cursor: pointer; transition: background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .perfil-btn:hover:not(:disabled) { background: #d4aa40; transform: translateY(-2px); box-shadow: 0 10px 24px rgba(194,161,43,0.28); }
        .perfil-btn:disabled { opacity: 0.65; cursor: default; }
        .perfil-btn-ghost { background: transparent; border: 1px solid ${GOLD_DARK}55; border-radius: 10px; padding: 11px 22px; font-family: ${FONT}; font-size: 0.87rem; font-weight: 600; color: ${GOLD_DARK}; cursor: pointer; transition: background 0.2s; }
        .perfil-btn-ghost:hover { background: ${GOLD}14; }
        .perfil-err { color: #c0392b; font-size: 0.8rem; margin: -0.55rem 0 0.7rem; }
      `}</style>

      {/* Hero */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Área do Utilizador
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          Dados da conta e preferências.
        </p>
      </div>

      <div style={{ background: BG, padding: "4rem 2rem 6rem", fontFamily: FONT }}>
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <UserProfileCard user={user} role={role} />

          <div className="col-span-4 sm:col-span-9" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Dados da conta */}
            <div className="perfil-card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: INK, margin: "0 0 1.25rem" }}>Dados da Conta</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: "0.7rem" }}>
                  <span style={{ color: INK_SOFT, fontSize: "0.88rem" }}>Utilizador</span>
                  <span style={{ color: INK, fontWeight: 600 }}>{user}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${BORDER}`, paddingBottom: "0.7rem" }}>
                  <span style={{ color: INK_SOFT, fontSize: "0.88rem" }}>Email</span>
                  <span style={{ color: INK, fontWeight: 600 }}>{email ?? "—"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: INK_SOFT, fontSize: "0.88rem" }}>Papel</span>
                  <span style={{ color: INK, fontWeight: 600 }}>{role ? (roleLabels[role.toLowerCase()] ?? role) : "—"}</span>
                </div>
              </div>
            </div>

            {/* Alterar password */}
            <div className="perfil-card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: INK, margin: "0 0 0.35rem" }}>Alterar Password</h2>
              <p style={{ color: INK_SOFT, fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                Escolha uma password com pelo menos 6 caracteres.
              </p>

              <form onSubmit={handleSubmit(onChangePassword)} style={{ maxWidth: "420px" }}>
                <label className="perfil-label">Password atual</label>
                <input type="password" className="perfil-input" style={{ marginBottom: errors.currentPassword ? "0" : "0.9rem" }} {...register("currentPassword", { required: "Password atual obrigatória" })} />
                {errors.currentPassword && <p className="perfil-err">{errors.currentPassword.message}</p>}

                <label className="perfil-label" style={{ marginTop: "0.5rem" }}>Nova password</label>
                <input type="password" className="perfil-input" style={{ marginBottom: errors.password ? "0" : "0.9rem" }} {...register("password", { required: "Nova password obrigatória", minLength: { value: 6, message: "Mínimo de 6 caracteres" } })} />
                {errors.password && <p className="perfil-err">{errors.password.message}</p>}

                <label className="perfil-label" style={{ marginTop: "0.5rem" }}>Confirmar nova password</label>
                <input
                  type="password"
                  className="perfil-input"
                  style={{ marginBottom: errors.passwordConfirmation ? "0" : "0.9rem" }}
                  {...register("passwordConfirmation", {
                    required: "Confirmação obrigatória",
                    validate: (value) => value === watch("password") || "As passwords não coincidem",
                  })}
                />
                {errors.passwordConfirmation && <p className="perfil-err">{errors.passwordConfirmation.message}</p>}

                {pwError && <p className="perfil-err" style={{ marginTop: "0.3rem" }}>{pwError}</p>}

                <button type="submit" className="perfil-btn" disabled={pwSaving} style={{ marginTop: "0.6rem", width: "100%" }}>
                  {pwSaving ? "A guardar..." : "Guardar nova password"}
                </button>
              </form>
            </div>

            {/* Sessão */}
            <div className="perfil-card">
              <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: INK, margin: "0 0 1rem" }}>Sessão</h2>
              <button className="perfil-btn-ghost" onClick={() => unsetToken()}>Sair da conta</button>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Perfil

export async function getServerSideProps() {
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: {
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        navbar: parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Error fetching server-side data:", error)
    return {
      props: { social: [], contato: {}, navbar: [] },
    }
  }
}
