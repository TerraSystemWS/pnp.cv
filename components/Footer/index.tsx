import Link from "next/link"
import Image from "next/image"
import { useForm, SubmitHandler } from "react-hook-form"
import toast, { Toaster } from "react-hot-toast"
import logo from "public/logo1.png"
import { NavLink } from "../../lib/parseNavbar"
import { GOLD, GOLD_BRIGHT, DARK_BG, DARK_BG_ALT, DARK_BORDER, LIGHT_TEXT, LIGHT_TEXT_SOFT, FONT, FONT_IMPORT } from "../../lib/theme"

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
    { name: "Regulamento", link: "/regulamentos" },
    { name: "Edições",      link: "/edicoes" },
    { name: "Parceiros",    link: "/parceiros" },
    { name: "Blog",         link: "/posts" },
    { name: "Contatos",     link: "/contatos" },
  ]

  const year = new Date().getFullYear()

  return (
    <footer style={{ position: "relative", zIndex: 50, fontFamily: FONT }}>
      <style>{`
        ${FONT_IMPORT}

        .ft-nl-input:focus {
          border-color: ${GOLD} !important;
          outline: none;
        }
        .ft-nl-input::placeholder { color: ${LIGHT_TEXT_SOFT}88; }

        .ft-link-item:hover { color: ${GOLD_BRIGHT} !important; padding-left: 4px !important; }
        .ft-social-pill:hover {
          border-color: ${GOLD} !important;
          color: ${GOLD_BRIGHT} !important;
          background: ${GOLD}18 !important;
        }
        .ft-nl-btn:hover { background: ${GOLD_BRIGHT} !important; }
      `}</style>

      <Toaster position="bottom-right" reverseOrder={false} />

      {/* ── Gold accent line at top ── */}
      <div style={{
        height: "3px",
        background: `linear-gradient(90deg, #8d741c, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD}, #8d741c)`,
      }} />

      {/* ── Main footer body ── */}
      <div style={{ background: DARK_BG, borderTop: `1px solid ${DARK_BORDER}` }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem 3.5rem" }}>

          <p style={{
            fontFamily: FONT,
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
            color: GOLD,
            textAlign: "center",
            marginBottom: "3rem",
          }}>
            Prémio Nacional de Publicidade
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
                <Image src={logo} alt="PNP" width={120} height={44} style={{ objectFit: "contain" }} />
              </div>
              <div style={{ fontSize: "0.9rem", lineHeight: 1.9, color: LIGHT_TEXT_SOFT, fontFamily: FONT }}>
                {contact?.Local && <span style={{ display: "block" }}>{contact.Local}</span>}
                {contact?.phone && <span style={{ display: "block" }}>{contact.phone}</span>}
                {contact?.email && <span style={{ display: "block" }}>{contact.email}</span>}
              </div>
            </div>

            {/* Col 2 — Links Úteis */}
            <div>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: LIGHT_TEXT,
                marginBottom: "1.2rem",
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
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    color: LIGHT_TEXT_SOFT,
                    textDecoration: "none",
                    padding: "5px 0",
                    transition: "color 0.2s, padding-left 0.2s",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Col 3 — Navegação */}
            <div>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: LIGHT_TEXT,
                marginBottom: "1.2rem",
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
                    fontFamily: FONT,
                    fontSize: "0.9rem",
                    color: LIGHT_TEXT_SOFT,
                    textDecoration: "none",
                    padding: "5px 0",
                    transition: "color 0.2s, padding-left 0.2s",
                  }}
                >
                  {l.name}
                </Link>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.85rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: LIGHT_TEXT,
                marginBottom: "1.2rem",
              }}>
                Newsletter
              </p>
              <p style={{
                fontFamily: FONT,
                fontSize: "0.88rem",
                lineHeight: 1.6,
                color: LIGHT_TEXT_SOFT,
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
                    background: `${GOLD}0d`,
                    border: `1px solid ${DARK_BORDER}`,
                    borderRight: "none",
                    borderRadius: "8px 0 0 8px",
                    padding: "10px 13px",
                    fontSize: "0.88rem",
                    color: LIGHT_TEXT,
                    fontFamily: FONT,
                    transition: "border-color 0.2s",
                  }}
                />
                <button
                  type="submit"
                  className="ft-nl-btn"
                  style={{
                    background: GOLD,
                    border: "none",
                    borderRadius: "0 8px 8px 0",
                    padding: "10px 18px",
                    fontSize: "0.8rem",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: FONT,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "background 0.2s",
                  }}
                >
                  Subscrever
                </button>
              </form>
            </div>
          </div>

          {/* ── Divider ── */}
          <div style={{
            height: "1px",
            background: DARK_BORDER,
            margin: "3rem 0 0",
          }} />
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ background: DARK_BG_ALT, borderTop: `1px solid ${DARK_BORDER}` }}>
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
              fontFamily: FONT,
              fontSize: "0.8rem",
              color: LIGHT_TEXT_SOFT,
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
                    border: `1px solid ${DARK_BORDER}`,
                    color: LIGHT_TEXT_SOFT,
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    fontFamily: FONT,
                    transition: "border-color 0.2s, color 0.2s, background 0.2s",
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
