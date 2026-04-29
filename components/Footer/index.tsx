import Link from "next/link"
import Image from "next/image"
import { useForm, SubmitHandler } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import logo from "public/logo1.png"
import { NavLink } from "../../lib/parseNavbar"

interface Contact {
  Local: string
  phone: string
  email: string
  newsletterTitle: string
}

interface FooterProps {
  rsocial: NavLink[]
  contato: { data: { attributes: Contact } } | null
}

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#080604"
const DARK_MID    = "#0d0a05"

const Footer: React.FC<FooterProps> = ({ rsocial, contato = null }) => {
  const contact = contato?.data?.attributes
  const { register, handleSubmit } = useForm<{ email: string }>()

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      if (res.ok) toast.success("E-mail enviado com sucesso!")
      else toast.error("Erro no envio de email")
    } catch {
      toast.error("Erro de ligação.")
    }
  }

  const usefulLinks = [
    { name: "Sobre Nós",               link: "/sobreus" },
    { name: "Termos de Serviço",       link: "/sobreus/terms" },
    { name: "Política de Privacidade", link: "/sobreus/policy" },
  ]

  const siteLinks = [
    { name: "Home",         link: "/" },
    { name: "Regulamentos", link: "/regulamentos" },
    { name: "Edições",      link: "/edicoes" },
    { name: "Parceiros",    link: "/parceiros" },
    { name: "Blog",         link: "/posts" },
    { name: "Contatos",     link: "/contatos" },
  ]

  const year = new Date().getFullYear()

  return (
    <footer style={{ position: "relative", zIndex: 50, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes ftNlBtnShimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }

        .ft-nl-input:focus {
          border-color: ${GOLD}88 !important;
          background: ${GOLD}12 !important;
          outline: none;
        }
        .ft-nl-input::placeholder { color: ${GOLD}44; }

        .ft-link-item:hover { color: ${GOLD_BRIGHT} !important; padding-left: 8px !important; }
        .ft-social-pill:hover {
          border-color: ${GOLD} !important;
          color: ${GOLD_BRIGHT} !important;
          background: ${GOLD}18 !important;
        }
      `}</style>

      <Toaster position="bottom-right" reverseOrder={false} />

      {/* ── Gold accent line at top ── */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, transparent, ${GOLD}88, ${GOLD_BRIGHT}, ${GOLD}88, transparent)`,
      }} />

      {/* ── Main footer body ── */}
      <div style={{ background: DARK, borderTop: `1px solid ${GOLD}18` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem 3.5rem" }}>

          {/* ── Ornament label ── */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.52rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: `${GOLD}50`,
            textAlign: "center",
            marginBottom: "3rem",
          }}>
            ✦ &nbsp; Prémio Nacional de Publicidade &nbsp; ✦
          </p>

          {/* ── 4-column grid ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2.5rem",
          }} className="ft-grid-resp">
            <style>{`
              @media (max-width: 1024px) { .ft-grid-resp { grid-template-columns: repeat(2, 1fr) !important; } }
              @media (max-width: 640px)  { .ft-grid-resp { grid-template-columns: 1fr !important; gap: 2.2rem !important; } }
            `}</style>

            {/* Col 1 — Logo + contact */}
            <div>
              <div style={{ marginBottom: "1.6rem" }}>
                <Image src={logo} alt="PNP" width={120} height={44} style={{ objectFit: "contain", opacity: 0.9 }} />
              </div>
              <div style={{ fontSize: "0.76rem", lineHeight: 2.1, color: `${GOLD_BRIGHT}44`, fontFamily: "'DM Sans', sans-serif" }}>
                {contact?.Local && <span style={{ display: "block" }}>{contact.Local}</span>}
                {contact?.phone && <span style={{ display: "block" }}>{contact.phone}</span>}
                {contact?.email && <span style={{ display: "block" }}>{contact.email}</span>}
              </div>
            </div>

            {/* Col 2 — Links Úteis */}
            <div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: "1.4rem",
              }}>
                Links Úteis
              </p>
              {usefulLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.link}
                  className="ft-link-item"
                  style={{
                    display: "block",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: `${GOLD_BRIGHT}40`,
                    textDecoration: "none",
                    padding: "5px 0",
                    letterSpacing: "0.02em",
                    transition: "color 0.25s, padding-left 0.25s",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Col 3 — Navegação */}
            <div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: "1.4rem",
              }}>
                Navegação
              </p>
              {siteLinks.map((l) => (
                <Link
                  key={l.link}
                  href={l.link}
                  className="ft-link-item"
                  style={{
                    display: "block",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.78rem",
                    color: `${GOLD_BRIGHT}40`,
                    textDecoration: "none",
                    padding: "5px 0",
                    letterSpacing: "0.02em",
                    transition: "color 0.25s, padding-left 0.25s",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.95rem",
                fontWeight: 300,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: "1.4rem",
              }}>
                Newsletter
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.74rem",
                lineHeight: 1.7,
                color: `${GOLD_BRIGHT}38`,
                marginBottom: "1.25rem",
              }}>
                {contact?.newsletterTitle || "Receba as últimas novidades do PNP directamente no seu email."}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
                <input
                  type="email"
                  className="ft-nl-input"
                  placeholder="email@pnp.cv"
                  {...register("email", { required: true })}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: `${GOLD}0a`,
                    border: `1px solid ${GOLD}30`,
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                    padding: "10px 13px",
                    fontSize: "0.78rem",
                    color: "#f0e0a0",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.3s, background 0.3s",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
                    backgroundSize: "200% auto",
                    border: "none",
                    borderRadius: "0 8px 8px 0",
                    padding: "10px 18px",
                    fontSize: "0.62rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#0f0a02",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    animation: "ftNlBtnShimmer 3s ease infinite",
                  }}
                >
                  Subscrever
                </button>
              </form>
            </div>
          </div>

          {/* ── Gold divider ── */}
          <div style={{
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)`,
            margin: "3rem 0 0",
          }} />
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ background: DARK_MID, borderTop: `1px solid ${GOLD}12` }}>
          <div style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1.1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}>
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.62rem",
              color: `${GOLD}55`,
              letterSpacing: "0.1em",
            }}>
              PNP &copy; {year} · Todos os direitos reservados.
            </span>

            <div style={{ display: "flex", gap: "8px" }}>
              {(Array.isArray(rsocial) ? rsocial : []).map((s) => (
                <Link
                  key={s.name}
                  href={s.link}
                  target={s.target}
                  aria-label={s.name}
                  className="ft-social-pill"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    border: `1px solid ${GOLD}35`,
                    color: `${GOLD}70`,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.3s, color 0.3s, background 0.3s",
                  }}
                >
                  {s.name.charAt(0).toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
