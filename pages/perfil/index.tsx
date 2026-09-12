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
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

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

  // Redireciona para a home se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/")
    }
  }, [user, loading, router])

  // Busca o email — o cookie local só guarda username/id
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
      // Mostra a confirmação antes de guardar o token novo — setToken()
      // recarrega a página quando troca o cookie, o que cortaria o alerta.
      await Swal.fire({
        icon: "success",
        title: "Password alterada",
        text: "A sua password foi atualizada com sucesso.",
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

      <style>{FONT_IMPORT}</style>

      <section>
        <div className="bg-gray-100">
          <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
              <UserProfileCard user={user} role={role} />
              <div className="col-span-4 sm:col-span-9" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                {/* Dados da conta */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4" style={{ fontFamily: FONT, color: INK }}>Área do Utilizador</h2>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem", fontFamily: FONT }}>
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
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-1" style={{ fontFamily: FONT, color: INK }}>Alterar Password</h2>
                  <p style={{ fontFamily: FONT, color: INK_SOFT, fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                    Escolha uma password com pelo menos 6 caracteres.
                  </p>

                  <form onSubmit={handleSubmit(onChangePassword)} style={{ maxWidth: "420px" }}>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: INK, marginBottom: "6px", fontFamily: FONT }}>
                      Password atual
                    </label>
                    <input
                      type="password"
                      {...register("currentPassword", { required: "Password atual obrigatória" })}
                      style={{ width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.92rem", fontFamily: FONT, outline: "none", marginBottom: "0.4rem", boxSizing: "border-box" }}
                    />
                    {errors.currentPassword && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: "0.7rem" }}>{errors.currentPassword.message}</p>}

                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: INK, marginBottom: "6px", marginTop: "0.9rem", fontFamily: FONT }}>
                      Nova password
                    </label>
                    <input
                      type="password"
                      {...register("password", { required: "Nova password obrigatória", minLength: { value: 6, message: "Mínimo de 6 caracteres" } })}
                      style={{ width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.92rem", fontFamily: FONT, outline: "none", marginBottom: "0.4rem", boxSizing: "border-box" }}
                    />
                    {errors.password && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: "0.7rem" }}>{errors.password.message}</p>}

                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: INK, marginBottom: "6px", marginTop: "0.9rem", fontFamily: FONT }}>
                      Confirmar nova password
                    </label>
                    <input
                      type="password"
                      {...register("passwordConfirmation", {
                        required: "Confirmação obrigatória",
                        validate: (value) => value === watch("password") || "As passwords não coincidem",
                      })}
                      style={{ width: "100%", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.92rem", fontFamily: FONT, outline: "none", marginBottom: "0.4rem", boxSizing: "border-box" }}
                    />
                    {errors.passwordConfirmation && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginBottom: "0.7rem" }}>{errors.passwordConfirmation.message}</p>}

                    {pwError && <p style={{ color: "#c0392b", fontSize: "0.85rem", marginTop: "0.5rem" }}>{pwError}</p>}

                    <button
                      type="submit"
                      disabled={pwSaving}
                      style={{ marginTop: "1rem", width: "100%", background: GOLD, border: "none", borderRadius: "9px", padding: "12px", fontFamily: FONT, fontSize: "0.9rem", color: "#fff", fontWeight: 700, cursor: pwSaving ? "default" : "pointer", opacity: pwSaving ? 0.7 : 1 }}
                    >
                      {pwSaving ? "A guardar..." : "Guardar nova password"}
                    </button>
                  </form>
                </div>

                {/* Sessão */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-3" style={{ fontFamily: FONT, color: INK }}>Sessão</h2>
                  <button
                    onClick={() => unsetToken()}
                    style={{ background: "transparent", border: `1px solid ${GOLD_DARK}55`, borderRadius: "9px", padding: "10px 20px", fontFamily: FONT, fontSize: "0.88rem", fontWeight: 600, color: GOLD_DARK, cursor: "pointer" }}
                  >
                    Sair da conta
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
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
