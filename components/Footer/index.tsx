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
    { name: "Sobre Nós",             link: "/sobreus" },
    { name: "Termos de Serviço",     link: "/sobreus/terms" },
    { name: "Política de Privacidade", link: "/sobreus/policy" },
  ]

  const siteLinks = [
    { name: "Home",          link: "/" },
    { name: "Regulamentos",  link: "/regulamentos" },
    { name: "Edições",       link: "/edicoes" },
    { name: "Parceiros",     link: "/parceiros" },
    { name: "Blog",          link: "/posts" },
    { name: "Contatos",      link: "/contatos" },
  ]

  const year = new Date().getFullYear()

  return (
    <footer style={{ position: "relative", zIndex: 50 }}>
      <style jsx global>{`
        .ft-root {
          background: #070503;
          border-top: 1px solid rgba(194,161,43,0.16);
          font-family: 'DM Sans', sans-serif;
        }
        .ft-col-head {
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(194,161,43,0.38);
          margin-bottom: 1.4rem;
          font-family: 'DM Sans', sans-serif;
        }
        .ft-link {
          display: block;
          font-size: 0.8rem;
          color: rgba(240,216,144,0.32);
          text-decoration: none;
          padding: 4px 0;
          letter-spacing: 0.02em;
          transition: color 0.25s ease, padding-left 0.25s ease;
          font-family: 'DM Sans', sans-serif;
        }
        .ft-link:hover { color: #c2a12b; padding-left: 7px; }

        .ft-contact-text {
          font-size: 0.78rem;
          line-height: 2;
          color: rgba(240,216,144,0.28);
          font-family: 'DM Sans', sans-serif;
        }

        .ft-nl-input {
          flex: 1;
          min-width: 0;
          background: rgba(194,161,43,0.05);
          border: 1px solid rgba(194,161,43,0.18);
          border-right: none;
          border-radius: 8px 0 0 8px;
          padding: 9px 13px;
          font-size: 0.78rem;
          color: #f0e0a0;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, background 0.3s;
          outline: none;
        }
        .ft-nl-input::placeholder { color: rgba(194,161,43,0.22); }
        .ft-nl-input:focus {
          border-color: rgba(194,161,43,0.48);
          background: rgba(194,161,43,0.08);
        }
        .ft-nl-btn {
          background: linear-gradient(135deg, #a8861a 0%, #c2a12b 40%, #e8c84a 70%, #c2a12b 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 0 8px 8px 0;
          padding: 9px 18px;
          font-size: 0.63rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #120e03;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background-position 0.4s, box-shadow 0.3s;
        }
        .ft-nl-btn:hover {
          background-position: right center;
          box-shadow: 0 4px 18px rgba(194,161,43,0.28);
        }

        .ft-nl-desc {
          font-size: 0.76rem;
          color: rgba(240,216,144,0.28);
          line-height: 1.65;
          margin-bottom: 1.1rem;
          font-family: 'DM Sans', sans-serif;
        }

        .ft-bottom {
          background: #040302;
          border-top: 1px solid rgba(194,161,43,0.09);
        }
        .ft-bottom-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .ft-copy {
          font-size: 0.65rem;
          color: rgba(194,161,43,0.28);
          letter-spacing: 0.08em;
          font-family: 'DM Sans', sans-serif;
        }
        .ft-social {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(194,161,43,0.25);
          color: rgba(194,161,43,0.5);
          font-size: 0.68rem;
          font-weight: 600;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, color 0.3s, background 0.3s;
        }
        .ft-social:hover {
          border-color: #c2a12b;
          color: #f0d060;
          background: rgba(194,161,43,0.1);
        }

        .ft-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem;
        }
        @media (max-width: 1024px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .ft-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
      `}</style>

      <Toaster position="bottom-right" reverseOrder={false} />

      <div className="ft-root">
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "3.5rem 2rem 3rem" }}>
          <div className="ft-grid">

            {/* Col 1 — Logo + contact */}
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <Image src={logo} alt="PNP" width={118} height={42} style={{ objectFit: "contain", opacity: 0.88 }} />
              </div>
              <p className="ft-contact-text">
                {contact?.Local  && <>{contact.Local}<br /></>}
                {contact?.phone  && <>{contact.phone}<br /></>}
                {contact?.email  && <>{contact.email}</>}
              </p>
            </div>

            {/* Col 2 — Links Úteis */}
            <div>
              <p className="ft-col-head">Links Úteis</p>
              {usefulLinks.map((l) => (
                <Link key={l.name} href={l.link} className="ft-link">{l.name}</Link>
              ))}
            </div>

            {/* Col 3 — Navegação */}
            <div>
              <p className="ft-col-head">Navegação</p>
              {siteLinks.map((l) => (
                <Link key={l.link} href={l.link} className="ft-link">{l.name}</Link>
              ))}
            </div>

            {/* Col 4 — Newsletter */}
            <div>
              <p className="ft-col-head">Newsletter</p>
              <p className="ft-nl-desc">
                {contact?.newsletterTitle || "Receba as últimas novidades do PNP directamente no seu email."}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
                <input
                  type="email"
                  className="ft-nl-input"
                  placeholder="email@pnp.cv"
                  {...register("email", { required: true })}
                />
                <button type="submit" className="ft-nl-btn">Subscrever</button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <div className="ft-bottom-inner">
            <span className="ft-copy">
              PNP &copy; {year} · Todos os direitos reservados.
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              {(Array.isArray(rsocial) ? rsocial : []).map((s) => (
                <Link key={s.name} href={s.link} target={s.target} className="ft-social" aria-label={s.name}>
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
