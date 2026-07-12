import Layout from "../components/Layout"
import { fetcher } from "../lib/api"
import { parseNavbar } from "../lib/parseNavbar"
import { useForm, SubmitHandler } from "react-hook-form"
import Head from "next/head"
import { useFetchUser } from "../lib/authContext"
import { useState } from "react"
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../lib/theme"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

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
        ${FONT_IMPORT}

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ct-input:focus {
          border-color: ${GOLD} !important;
          outline: none !important;
        }
        .ct-input::placeholder { color: ${INK_SOFT}88; }
        .ct-textarea:focus {
          border-color: ${GOLD} !important;
          outline: none !important;
        }
        .ct-textarea::placeholder { color: ${INK_SOFT}88; }

        .ct-submit-btn:hover {
          background: ${GOLD_BRIGHT} !important;
          box-shadow: 0 6px 20px rgba(194,161,43,0.28) !important;
        }

        .ct-info-card {
          background: ${CARD};
          border: 1px solid ${BORDER};
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
        background: BG_ALT,
        paddingTop: "6rem",
        paddingBottom: "3rem",
        textAlign: "center",
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <p style={{
          fontFamily: FONT,
          fontSize: "0.88rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: GOLD_DARK,
          marginBottom: "1rem",
          animation: "fadeUp 0.6s ease both",
        }}>
          Prémio Nacional de Publicidade
        </p>

        <h1 style={{
          fontFamily: FONT,
          fontSize: "clamp(2.42rem, 6vw, 3.74rem)",
          fontWeight: 700,
          color: INK,
          margin: 0,
          animation: "fadeUp 0.7s ease 0.1s both",
        }}>
          Contactos
        </h1>

        <p style={{
          fontFamily: FONT,
          fontSize: "1.1rem",
          color: INK_SOFT,
          marginTop: "1rem",
          animation: "fadeUp 0.8s ease 0.2s both",
        }}>
          Não hesite em perguntar — fale connosco.
        </p>
      </div>

      {/* ── Main content ── */}
      <div style={{ background: BG, minHeight: "60vh" }}>
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
                border: `1px solid ${BORDER}`,
                minHeight: "380px",
                background: CARD,
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
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                />
              ) : (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: INK_SOFT,
                  fontFamily: FONT,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                }}>
                  Mapa indisponível
                </div>
              )}

              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "3px",
                background: GOLD,
                pointerEvents: "none",
              }} />
            </div>

            {/* Contact info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              {attrs?.Local && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.6rem" }}>
                    Endereço
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK, lineHeight: 1.6 }}>
                    {attrs.Local}
                  </p>
                </div>
              )}
              {attrs?.email && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.6rem" }}>
                    Email
                  </p>
                  <a href={`mailto:${attrs.email}`} style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK, textDecoration: "none", lineHeight: 1.6, wordBreak: "break-all" }}>
                    {attrs.email}
                  </a>
                </div>
              )}
              {attrs?.phone && (
                <div className="ct-info-card">
                  <p style={{ fontFamily: FONT, fontSize: "0.825rem", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "0.6rem" }}>
                    Telefone
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: "0.99rem", color: INK, lineHeight: 1.6 }}>
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
            background: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: "20px",
            padding: "2.5rem",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0,
              height: "3px",
              background: GOLD,
            }} />

            <p style={{
              fontFamily: FONT,
              fontSize: "0.88rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: GOLD_DARK,
              marginBottom: "0.8rem",
            }}>
              Envie uma mensagem
            </p>
            <h2 style={{
              fontFamily: FONT,
              fontSize: "1.87rem",
              fontWeight: 700,
              color: INK,
              marginBottom: "0.4rem",
            }}>
              Fale Connosco
            </h2>
            <p style={{
              fontFamily: FONT,
              fontSize: "0.99rem",
              color: INK_SOFT,
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}>
              Para saber mais sobre o PNP, envie-nos uma mensagem e responderemos em breve.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Nome */}
              <label style={{ display: "block", fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "7px" }}>
                Nome
              </label>
              <input
                type="text"
                className="ct-input"
                placeholder="O seu nome"
                {...register("name", { required: "Nome é obrigatório" })}
                style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "1.012rem", color: INK, fontFamily: FONT, transition: "border-color 0.2s", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.name && <p style={{ color: "#c0392b", fontSize: "0.858rem", marginBottom: "0.8rem" }}>{errors.name.message}</p>}
              {!errors.name && <div style={{ marginBottom: "1rem" }} />}

              {/* Email */}
              <label style={{ display: "block", fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "7px" }}>
                Email
              </label>
              <input
                type="email"
                className="ct-input"
                placeholder="email@exemplo.com"
                {...register("email", { required: "Email é obrigatório" })}
                style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "1.012rem", color: INK, fontFamily: FONT, transition: "border-color 0.2s", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.email && <p style={{ color: "#c0392b", fontSize: "0.858rem", marginBottom: "0.8rem" }}>{errors.email.message}</p>}
              {!errors.email && <div style={{ marginBottom: "1rem" }} />}

              {/* Mensagem */}
              <label style={{ display: "block", fontFamily: FONT, fontSize: "0.88rem", fontWeight: 700, color: INK, marginBottom: "7px" }}>
                Mensagem
              </label>
              <textarea
                className="ct-textarea"
                placeholder="A sua mensagem..."
                rows={5}
                {...register("message", { required: "Mensagem é obrigatória" })}
                style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "1.012rem", color: INK, fontFamily: FONT, transition: "border-color 0.2s", resize: "vertical", marginBottom: "0.25rem", boxSizing: "border-box" }}
              />
              {errors.message && <p style={{ color: "#c0392b", fontSize: "0.858rem", marginBottom: "0.8rem" }}>{errors.message.message}</p>}
              {!errors.message && <div style={{ marginBottom: "1.25rem" }} />}

              {/* Submit */}
              <button
                type="submit"
                className="ct-submit-btn"
                style={{
                  width: "100%",
                  background: GOLD,
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px",
                  fontFamily: FONT,
                  fontSize: "0.99rem",
                  color: INK,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                Enviar Mensagem
              </button>

              {statusMessage && (
                <p style={{
                  marginTop: "1rem",
                  fontFamily: FONT,
                  fontSize: "0.935rem",
                  fontWeight: 700,
                  color: statusOk ? GOLD_DARK : "#c0392b",
                  textAlign: "center",
                }}>
                  {statusMessage}
                </p>
              )}

              <p style={{ marginTop: "1.2rem", fontFamily: FONT, fontSize: "0.858rem", color: INK_SOFT, textAlign: "center" }}>
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
