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

const GOLD        = "#c2a12b"
const GOLD_BRIGHT = "#f0d060"
const DARK        = "#0a0805"
const DARK_CARD   = "#100d07"

const Nav = ({ navbar }: any) => {
  const { user, loading } = useUser()
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered]   = useState<string | null>(null)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
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
      {/* ── Global keyframes + PrimeReact dark override ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        @keyframes drawerSlide {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes overlayFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(194,161,43,0); }
          50%      { box-shadow: 0 0 20px 4px rgba(194,161,43,0.25); }
        }

        /* PrimeReact dialog — force dark theme */
        .pnp-login-dialog.p-dialog {
          background: ${DARK_CARD} !important;
          border: 1px solid ${GOLD}55 !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 40px 100px #000000cc !important;
        }
        .pnp-login-dialog .p-dialog-header {
          background: ${DARK_CARD} !important;
          border-bottom: 1px solid ${GOLD}22 !important;
          padding: 1.5rem 2rem !important;
        }
        .pnp-login-dialog .p-dialog-header .p-dialog-title {
          font-family: 'Cormorant Garamond', serif !important;
          font-size: 1.5rem !important;
          font-weight: 300 !important;
          color: #f5e8b8 !important;
          letter-spacing: 0.1em !important;
        }
        .pnp-login-dialog .p-dialog-header-icon {
          color: ${GOLD}88 !important;
        }
        .pnp-login-dialog .p-dialog-header-icon:hover {
          color: ${GOLD} !important;
          background: ${GOLD}18 !important;
        }
        .pnp-login-dialog .p-dialog-content {
          background: ${DARK_CARD} !important;
          padding: 2rem !important;
        }
        .pnp-login-dialog .p-dialog-footer {
          background: ${DARK_CARD} !important;
          border-top: 1px solid ${GOLD}18 !important;
          padding: 1rem 2rem !important;
        }
        .pnp-login-dialog .p-button.p-button-text {
          color: ${GOLD}88 !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.75rem !important;
          letter-spacing: 0.1em !important;
        }
        .pnp-login-dialog .p-button.p-button-text:hover {
          color: ${GOLD} !important;
          background: ${GOLD}18 !important;
        }
      `}</style>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 98,
            animation: "overlayFade 0.3s ease",
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: "min(300px, 85vw)",
        height: "100dvh",
        background: DARK,
        borderLeft: `1px solid ${GOLD}40`,
        zIndex: 99,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        padding: "5.5rem 2rem 2.5rem",
        fontFamily: "'Cormorant Garamond', serif",
      }}>
        {/* Ornament */}
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: `${GOLD}55`, textTransform: "uppercase", marginBottom: "1.5rem" }}>
          ✦ &nbsp; Prémio Nacional de Publicidade
        </p>

        {(navbar ?? []).map((link: any) => (
          <Link
            key={link.name}
            href={link.link}
            target={link.target ?? "_self"}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.7rem",
              fontWeight: 300,
              color: `${GOLD_BRIGHT}99`,
              textDecoration: "none",
              padding: "0.6rem 0",
              borderBottom: `1px solid ${GOLD}15`,
              letterSpacing: "0.02em",
              transition: "color 0.25s, padding-left 0.25s",
            }}
            onMouseEnter={e => { (e.target as HTMLElement).style.color = GOLD_BRIGHT; (e.target as HTMLElement).style.paddingLeft = "10px" }}
            onMouseLeave={e => { (e.target as HTMLElement).style.color = `${GOLD_BRIGHT}99`; (e.target as HTMLElement).style.paddingLeft = "0" }}
          >
            {link.name}
          </Link>
        ))}
        {!loading && user && (
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", fontWeight: 300, color: GOLD, textDecoration: "none", padding: "0.6rem 0", borderBottom: `1px solid ${GOLD}15`, fontStyle: "italic" }}
          >
            {user}
          </Link>
        )}

        <div style={{ marginTop: "auto" }}>
          {!loading && (user ? (
            <button
              onClick={() => { logout(); setOpen(false) }}
              style={{ width: "100%", background: "transparent", border: `1px solid ${GOLD}44`, borderRadius: "8px", padding: "10px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: `${GOLD}99`, cursor: "pointer" }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { setVisible(true); setOpen(false) }}
              style={{ width: "100%", background: `linear-gradient(135deg, #a8861a, ${GOLD}, ${GOLD_BRIGHT}, ${GOLD})`, border: "none", borderRadius: "8px", padding: "11px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#100d07", fontWeight: 600, cursor: "pointer" }}
            >
              Login
            </button>
          ))}
        </div>
      </div>

      {/* ── Navbar bar ── */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        background: scrolled ? `${DARK}f5` : `${DARK}dd`,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? GOLD + "55" : GOLD + "25"}`,
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
        /* Gold accent line at very top */
        boxShadow: scrolled
          ? `0 0 0 0 transparent, inset 0 3px 0 ${GOLD}`
          : `inset 0 3px 0 ${GOLD}`,
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 2rem",
          height: "68px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <Image src={logo} alt="PNP" width={130} height={46} style={{ objectFit: "contain" }} />
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="pnp-nav-desktop">
            {(navbar ?? []).map((link: any) => (
              <Link
                key={link.name}
                href={link.link}
                target={link.target ?? "_self"}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: hovered === link.name ? GOLD_BRIGHT : "rgba(240,224,180,0.65)",
                  textDecoration: "none",
                  transition: "color 0.25s",
                  position: "relative",
                }}
              >
                {link.name}
                {hovered === link.name && (
                  <span style={{
                    position: "absolute", bottom: "-4px", left: 0, right: 0,
                    height: "1px",
                    background: `linear-gradient(90deg, ${GOLD}, ${GOLD_BRIGHT})`,
                  }} />
                )}
              </Link>
            ))}

            {!loading && user && (
              <Link
                href="/perfil"
                style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "1rem", fontWeight: 300, color: GOLD, textDecoration: "none" }}
              >
                {user}
              </Link>
            )}

            {!loading && (user ? (
              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: `1px solid ${GOLD}55`,
                  borderRadius: "100px",
                  padding: "7px 22px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: `${GOLD}bb`,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setVisible(true)}
                style={{
                  background: `linear-gradient(135deg, #a8861a 0%, ${GOLD} 40%, ${GOLD_BRIGHT} 70%, ${GOLD} 100%)`,
                  backgroundSize: "200% auto",
                  border: "none",
                  borderRadius: "100px",
                  padding: "8px 24px",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#0f0a02",
                  fontWeight: 600,
                  cursor: "pointer",
                  animation: "goldPulse 3s ease-in-out infinite",
                }}
              >
                Login
              </button>
            ))}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{
              display: "none",
              flexDirection: "column",
              gap: "5px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px",
            }}
            className="pnp-burger"
          >
            <span style={{ display: "block", width: "22px", height: "1px", background: GOLD, transition: "transform 0.35s", transform: open ? "translateY(6px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "16px", height: "1px", background: GOLD, transition: "opacity 0.35s, width 0.35s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "1px", background: GOLD, transition: "transform 0.35s", transform: open ? "translateY(-6px) rotate(-45deg)" : "none" }} />
          </button>
        </div>
      </nav>

      {/* Responsive burger show/hide */}
      <style>{`
        @media (max-width: 768px) {
          .pnp-nav-desktop { display: none !important; }
          .pnp-burger      { display: flex !important; }
        }
      `}</style>

      {/* ── Login Dialog ── */}
      <Dialog
        header="Acesso"
        visible={visible}
        position="center"
        style={{ width: "min(420px, 92vw)" }}
        className="pnp-login-dialog"
        onHide={() => setVisible(false)}
        footer={
          <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
        }
        draggable={false}
        resizable={false}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <label style={{ display: "block", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}77`, marginBottom: "7px", fontFamily: "'DM Sans',sans-serif" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="nome@email.com"
            {...register("email", { required: "Email obrigatório" })}
            style={{ width: "100%", background: `${GOLD}0d`, border: `1px solid ${GOLD}33`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.85rem", color: "#f0e0a0", fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: "0.85rem", boxSizing: "border-box" }}
          />
          {errors.email && <p style={{ color: "#f87171cc", fontSize: "0.7rem", marginTop: "-0.6rem", marginBottom: "0.6rem" }}>{errors.email.message}</p>}

          {/* Password */}
          <label style={{ display: "block", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: `${GOLD}77`, marginBottom: "7px", fontFamily: "'DM Sans',sans-serif" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password obrigatória" })}
            style={{ width: "100%", background: `${GOLD}0d`, border: `1px solid ${GOLD}33`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.85rem", color: "#f0e0a0", fontFamily: "'DM Sans',sans-serif", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }}
          />
          {errors.password && <p style={{ color: "#f87171cc", fontSize: "0.7rem", marginTop: "-0.6rem", marginBottom: "0.6rem" }}>{errors.password.message}</p>}

          <button
            type="submit"
            style={{ width: "100%", background: `linear-gradient(135deg, #a8861a, ${GOLD}, ${GOLD_BRIGHT})`, border: "none", borderRadius: "9px", padding: "12px", fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#0f0a02", fontWeight: 600, cursor: "pointer" }}
          >
            Entrar
          </button>
        </form>
      </Dialog>
    </>
  )
}

export default Nav
