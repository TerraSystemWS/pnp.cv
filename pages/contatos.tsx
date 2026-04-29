import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import { useForm, SubmitHandler } from "react-hook-form"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { useState } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_CARD   = "#100d07"
const DARK_INPUT  = "#0d0a05"

type Inputs = { name: string; email: string; message: string }

const CONTATOS = ({ social, contato, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const [statusMessage, setStatusMessage] = useState("")
  const [statusOk, setStatusOk]           = useState(false)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setStatusMessage("")
    try {
      const response = await fetch(`${api_link}/contato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, message: data.message }),
      })
      if (response.status === 200) {
        setStatusOk(true)
        setStatusMessage("Mensagem enviada com sucesso!")
      } else {
        setStatusOk(false)
        setStatusMessage("Erro ao enviar. Tente novamente mais tarde.")
      }
    } catch {
      setStatusOk(false)
      setStatusMessage("Erro de ligação. Tente novamente.")
    }
  }

  const attrs = contato?.data?.attributes

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Contatos - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Página de contatos" />
      </Head>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(194,161,43,0); }
          50%      { box-shadow: 0 0 22px 5px rgba(194,161,43,0.22); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .ct-input:focus {
          border-color: ${GOLD}88 !important;
          background: ${GOLD}10 !important;
          outline: none !important;
        }
        .ct-input::placeholder { color: ${GOLD}35; }
        .ct-textarea:focus {
          border-color: ${GOLD}88 !important;
          background: ${GOLD}10 !important;
          outline: none !important;
        }
        .ct-textarea::placeholder { color: ${GOLD}35; }

        .ct-submit-btn:hover {
          background-position: right center !important;
          box-shadow: 0 6px 24px rgba(194,161,43,0.32) !important;
        }

        .ct-info-card {
          background: ${DARK_CARD};
          border: 1px solid ${GOLD}22;
          border-radius: 12px;
          padding: 1.5rem 1.8rem;
        }

        @media (max-width: 768px) {
          .ct-layout { flex-direction: column !important; }
          .ct-map-col { min-height: 320px !important; }
        }
      `}</style>

      {/* ── Hero header ── */}
      <div style={{
        background: DARK,
        paddingTop: "7rem",
        paddingBottom: "4rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* grain texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }} />

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.52rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: `${GOLD}66`,
          marginBottom: "1.2rem",
          animation: "fadeUp 0.6s ease both",
        }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(3rem, 8vw, 5.5rem)",
          fontWeight: 300,
          letterSpacing: "0.06em",
          color: "#f5e8b8",
          margin: 0,
          animation: "fadeUp 0.7s ease 0.1s both",
          background: `linear-gradient(135deg, #c8a84a, ${GOLD_BRIGHT}, #c8a84a)`,
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Contactos
        </h1>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.82rem",
          color: `${GOLD_BRIGHT}50`,
          letterSpacing: "0.08em",
          marginTop: "1rem",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          Não hesite em perguntar — fale connosco.
        </p>

        {/* gold divider */}
        <div style={{
          width: "60px", height: "1px",
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          margin: "2rem auto 0",
          animation: "fadeUp 0.9s ease 0.3s both",
        }} />
      </div>

      {/* ── Main content ── */}
      <div style={{ background: DARK, minHeight: "60vh" }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem 6rem",
          display: "flex",
          gap: "3rem",
          alignItems: "flex-start",
        }} className="ct-layout">

          {/* ── Left: map + contact info ── */}
          <div style={{ flex: "1 1 55%", minWidth: 0 }}>

            {/* Map */}
            <div
              className="ct-map-col"
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                border: `1px solid ${GOLD}25`,
                minHeight: "380px",
                background: DARK_CARD,
                marginBottom: "1.5rem",
              }}
            >
              {attrs?.mapa ? (
                <iframe
                  src={attrs.mapa}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Mapa"
                  scrolling="no"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "grayscale(30%) brightness(0.85)" }}
                />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: `${GOLD}33`,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.1em",
                }}>
                  Mapa indisponível
                </div>
              )}

              {/* gold corner accent */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD})`,
                pointerEvents: "none",
              }} />
            </div>

            {/* Contact info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {attrs?.Local && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.52rem", letterSpacing: "0.24em", textTransform: "uppercase", color: `${GOLD}70`, marginBottom: "0.6rem" }}>
                    Endereço
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: `${GOLD_BRIGHT}70`, lineHeight: 1.7 }}>
                    {attrs.Local}
                  </p>
                </div>
              )}
              {attrs?.email && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.52rem", letterSpacing: "0.24em", textTransform: "uppercase", color: `${GOLD}70`, marginBottom: "0.6rem" }}>
                    Email
                  </p>
                  <a href={`mailto:${attrs.email}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: GOLD, textDecoration: "none", lineHeight: 1.7, wordBreak: "break-all" }}>
                    {attrs.email}
                  </a>
                </div>
              )}
              {attrs?.phone && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.52rem", letterSpacing: "0.24em", textTransform: "uppercase", color: `${GOLD}70`, marginBottom: "0.6rem" }}>
                    Telefone
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: `${GOLD_BRIGHT}70`, lineHeight: 1.7 }}>
                    {attrs.phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: contact form ── */}
          <div style={{
            flex: "1 1 40%",
            minWidth: 0,
            background: DARK_CARD,
            border: `1px solid ${GOLD}25`,
            borderRadius: "20px",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* top gold line */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD})`,
            }} />

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.52rem",
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: `${GOLD}66`,
              marginBottom: "0.8rem",
            }}>
              ✦ &nbsp; Envie uma mensagem
            </p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 300,
              color: "#f5e8b8",
              letterSpacing: "0.05em",
              marginBottom: "0.4rem",
            }}>
              Fale Connosco
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.76rem",
              color: `${GOLD_BRIGHT}40`,
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}>
              Para saber mais sobre o PNP, envie-nos uma mensagem e responderemos em breve.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${GOLD}77`, marginBottom: "7px" }}>
                Nome
              </label>
              <input
                type="text"
                className="ct-input"
                placeholder="O seu nome"
                {...register("name", { required: "Nome é obrigatório" })}
                style={{ width: "100%", background: `${GOLD}08`, border: `1px solid ${GOLD}28`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.82rem", color: "#f0e0a0", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.3s, background 0.3s", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.name && <p style={{ color: "#f87171bb", fontSize: "0.68rem", marginBottom: "0.8rem" }}>{errors.name.message}</p>}
              {!errors.name && <div style={{ marginBottom: "1rem" }} />}

              {/* Email */}
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${GOLD}77`, marginBottom: "7px" }}>
                Email
              </label>
              <input
                type="email"
                className="ct-input"
                placeholder="email@exemplo.com"
                {...register("email", { required: "Email é obrigatório" })}
                style={{ width: "100%", background: `${GOLD}08`, border: `1px solid ${GOLD}28`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.82rem", color: "#f0e0a0", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.3s, background 0.3s", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.email && <p style={{ color: "#f87171bb", fontSize: "0.68rem", marginBottom: "0.8rem" }}>{errors.email.message}</p>}
              {!errors.email && <div style={{ marginBottom: "1rem" }} />}

              {/* Mensagem */}
              <label style={{ display: "block", fontFamily: "'DM Sans', sans-serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: `${GOLD}77`, marginBottom: "7px" }}>
                Mensagem
              </label>
              <textarea
                className="ct-textarea"
                placeholder="A sua mensagem..."
                rows={5}
                {...register("message", { required: "Mensagem é obrigatória" })}
                style={{ width: "100%", background: `${GOLD}08`, border: `1px solid ${GOLD}28`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.82rem", color: "#f0e0a0", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.3s, background 0.3s", resize: "vertical", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.message && <p style={{ color: "#f87171bb", fontSize: "0.68rem", marginBottom: "0.8rem" }}>{errors.message.message}</p>}
              {!errors.message && <div style={{ marginBottom: "1.25rem" }} />}

              {/* Submit */}
              <button
                type="submit"
                className="ct-submit-btn"
                style={{
                  width: "100%",
                  background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
                  backgroundSize: "200% auto",
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#0f0a02",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-position 0.4s, box-shadow 0.3s",
                  animation: "goldPulse 3.5s ease-in-out infinite",
                }}
              >
                Enviar Mensagem
              </button>

              {statusMessage && (
                <p style={{
                  marginTop: "1rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.74rem",
                  color: statusOk ? `${GOLD}cc` : "#f87171bb",
                  textAlign: "center",
                  letterSpacing: "0.04em",
                }}>
                  {statusOk ? "✦ " : ""}{statusMessage}
                </p>
              )}

              <p style={{ marginTop: "1.2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", color: `${GOLD}40`, textAlign: "center", letterSpacing: "0.05em" }}>
                Os seus dados são privados e protegidos.
              </p>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CONTATOS

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
    console.error("Error fetching contatos data:", error)
    return {
      props: { social: [], contato: null, navbar: [] },
    }
  }
}
