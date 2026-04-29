import Image from "next/image"
import React, { useState, useEffect } from "react"
import logo from "public/logo1.png"
import Link from "next/link"
import { fetcher } from "../../lib/api"
import { setToken, unsetToken } from "../../lib/auth"
import { useUser } from "../../lib/authContext"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = { email: string; password: string }

const Nav = ({ navbar }: any) => {
  const { user, loading } = useUser()
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const res = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: data.email, password: data.password }),
        }
      )
      setToken(res)
      setVisible(false)
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  const logout = () => unsetToken()

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        /* ── PrimeReact Dialog dark override ── */
        .p-dialog {
          background: #0f0c07 !important;
          border: 1px solid rgba(194,161,43,0.28) !important;
          border-radius: 18px !important;
          box-shadow: 0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(194,161,43,0.06) !important;
          overflow: hidden !important;
        }
        .p-dialog .p-dialog-header {
          background: #0f0c07 !important;
          border-bottom: 1px solid rgba(194,161,43,0.12) !important;
          padding: 1.5rem 2rem 1.25rem !important;
        }
        .p-dialog .p-dialog-header .p-dialog-title {
          font-family: 'Cormorant Garamond', serif !important;
          font-size: 1.4rem !important;
          font-weight: 300 !important;
          color: #f5e8b8 !important;
          letter-spacing: 0.08em !important;
        }
        .p-dialog .p-dialog-header-icon {
          color: rgba(194,161,43,0.4) !important;
          border-radius: 50% !important;
        }
        .p-dialog .p-dialog-header-icon:hover {
          color: #c2a12b !important;
          background: rgba(194,161,43,0.1) !important;
        }
        .p-dialog .p-dialog-content {
          background: #0f0c07 !important;
          padding: 1.75rem 2rem !important;
        }
        .p-dialog .p-dialog-footer {
          background: #0f0c07 !important;
          border-top: 1px solid rgba(194,161,43,0.1) !important;
          padding: 1rem 2rem !important;
        }
        .p-button.p-button-text {
          color: rgba(194,161,43,0.5) !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.78rem !important;
          letter-spacing: 0.08em !important;
        }
        .p-button.p-button-text:hover {
          color: #c2a12b !important;
          background: rgba(194,161,43,0.07) !important;
        }

        /* ── Navbar ── */
        .nav-root {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
          background: rgba(8,6,4,0.82);
          transition: background 0.4s ease, box-shadow 0.4s ease;
        }
        .nav-root.nav-scrolled {
          background: rgba(6,5,3,0.95);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 1px 0 rgba(194,161,43,0.13), 0 8px 32px rgba(0,0,0,0.5);
        }
        .nav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Desktop links */
        .nav-desktop {
          display: flex;
          align-items: center;
          gap: 2.25rem;
        }
        .nav-link {
          position: relative;
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.3s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: linear-gradient(90deg, #c2a12b, #f0d060);
          transition: width 0.35s ease;
        }
        .nav-link:hover { color: #e8c84a; }
        .nav-link:hover::after { width: 100%; }

        .nav-user {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          font-weight: 300;
          color: #c2a12b;
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-user:hover { color: #f0d060; }

        .nav-btn-login {
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #c2a12b;
          border: 1px solid rgba(194,161,43,0.4);
          border-radius: 100px;
          padding: 7px 22px;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, background 0.3s, color 0.3s, box-shadow 0.3s;
        }
        .nav-btn-login:hover {
          border-color: #c2a12b;
          background: rgba(194,161,43,0.09);
          color: #f0d060;
          box-shadow: 0 0 16px rgba(194,161,43,0.15);
        }

        .nav-btn-logout {
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(194,161,43,0.5);
          border: 1px solid rgba(194,161,43,0.18);
          border-radius: 100px;
          padding: 7px 22px;
          background: transparent;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, color 0.3s;
        }
        .nav-btn-logout:hover {
          border-color: rgba(194,161,43,0.45);
          color: #c2a12b;
        }

        /* Hamburger */
        .nav-burger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
        }
        .nav-burger span {
          display: block;
          width: 22px; height: 1px;
          background: rgba(194,161,43,0.75);
          transition: transform 0.35s ease, opacity 0.35s ease, width 0.35s ease;
          transform-origin: center;
        }
        .nav-burger.open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .nav-burger.open span:nth-child(2) { opacity: 0; width: 0; }
        .nav-burger.open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        /* Mobile overlay + drawer */
        .nav-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 98;
          opacity: 0; pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .nav-overlay.open { opacity: 1; pointer-events: all; }

        .nav-drawer {
          position: fixed;
          top: 0; right: 0;
          width: min(300px, 82vw);
          height: 100dvh;
          background: #060503;
          border-left: 1px solid rgba(194,161,43,0.18);
          z-index: 99;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.4,0,0.2,1);
          display: flex;
          flex-direction: column;
          padding: 5.5rem 2rem 2.5rem;
        }
        .nav-drawer.open { transform: translateX(0); }

        .nav-drawer-link {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem;
          font-weight: 300;
          color: rgba(240,216,144,0.5);
          text-decoration: none;
          padding: 0.65rem 0;
          border-bottom: 1px solid rgba(194,161,43,0.07);
          letter-spacing: 0.02em;
          transition: color 0.3s, padding-left 0.3s;
        }
        .nav-drawer-link:hover { color: #e8c84a; padding-left: 10px; }

        /* Login form inside dialog */
        .nlf-label {
          display: block;
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(194,161,43,0.45);
          margin-bottom: 7px;
          font-family: 'DM Sans', sans-serif;
        }
        .nlf-input {
          width: 100%;
          background: rgba(194,161,43,0.05);
          border: 1px solid rgba(194,161,43,0.2);
          border-radius: 9px;
          padding: 10px 14px;
          font-size: 0.85rem;
          color: #f0e0a0;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          margin-bottom: 0.85rem;
        }
        .nlf-input::placeholder { color: rgba(194,161,43,0.22); }
        .nlf-input:focus {
          outline: none;
          border-color: rgba(194,161,43,0.55);
          background: rgba(194,161,43,0.08);
          box-shadow: 0 0 0 3px rgba(194,161,43,0.07);
        }
        .nlf-err {
          font-size: 0.7rem;
          color: rgba(248,113,113,0.75);
          margin-top: -0.6rem;
          margin-bottom: 0.6rem;
          font-family: 'DM Sans', sans-serif;
        }
        .nlf-submit {
          width: 100%;
          background: linear-gradient(135deg, #a8861a 0%, #c2a12b 30%, #e8c84a 60%, #c2a12b 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 9px;
          padding: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #140f04;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: background-position 0.5s, transform 0.2s, box-shadow 0.3s;
        }
        .nlf-submit:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(194,161,43,0.28);
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none; }
          .nav-burger  { display: flex; }
        }
      `}</style>

      {/* Dark overlay */}
      <div className={`nav-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />

      {/* Mobile drawer */}
      <div className={`nav-drawer ${open ? "open" : ""}`}>
        {(navbar ?? []).map((link: any) => (
          <Link
            key={link.name}
            href={link.link}
            target={link.target ?? "_self"}
            className="nav-drawer-link"
            onClick={() => setOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        {!loading && user && (
          <Link href="/perfil" className="nav-drawer-link" onClick={() => setOpen(false)}>
            Perfil
          </Link>
        )}
        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          {!loading && (user ? (
            <button className="nav-btn-logout" style={{ width: "100%" }} onClick={() => { logout(); setOpen(false) }}>
              Logout
            </button>
          ) : (
            <button className="nav-btn-login" style={{ width: "100%" }} onClick={() => { setVisible(true); setOpen(false) }}>
              Login
            </button>
          ))}
        </div>
      </div>

      {/* Navbar bar */}
      <nav className={`nav-root ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logo} alt="PNP" width={128} height={46} style={{ objectFit: "contain" }} />
          </Link>

          <div className="nav-desktop">
            {(navbar ?? []).map((link: any) => (
              <Link key={link.name} href={link.link} target={link.target ?? "_self"} className="nav-link">
                {link.name}
              </Link>
            ))}
            {!loading && user && (
              <Link href="/perfil" className="nav-user">{user}</Link>
            )}
            {!loading && (user ? (
              <button className="nav-btn-logout" onClick={logout}>Logout</button>
            ) : (
              <button className="nav-btn-login" onClick={() => setVisible(true)}>Login</button>
            ))}
          </div>

          <button className={`nav-burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Login Dialog */}
      <Dialog
        header="Acesso"
        visible={visible}
        position="center"
        style={{ width: "min(420px, 92vw)" }}
        onHide={() => setVisible(false)}
        footer={
          <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
        }
        draggable={false}
        resizable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="nlf-label">Email</label>
          <input
            type="email"
            placeholder="nome@email.com"
            className="nlf-input"
            {...register("email", { required: "Email obrigatório" })}
          />
          {errors.email && <p className="nlf-err">{errors.email.message}</p>}

          <label className="nlf-label">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="nlf-input"
            {...register("password", { required: "Password obrigatória" })}
          />
          {errors.password && <p className="nlf-err">{errors.password.message}</p>}

          <button type="submit" className="nlf-submit">Entrar</button>
        </form>
      </Dialog>
    </>
  )
}

export default Nav
