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
import { GOLD, GOLD_DARK, GOLD_BRIGHT, INK, BG, CARD, BORDER, BORDER_STRONG, FONT, FONT_IMPORT } from "../../lib/theme"

type Inputs = { email: string; password: string }

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
      {/* ── Global keyframes + PrimeReact light override ── */}
      <style>{`
        ${FONT_IMPORT}

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
          50%      { box-shadow: 0 0 18px 4px rgba(194,161,43,0.3); }
        }

        .pnp-login-dialog.p-dialog {
          background: ${CARD} !important;
          border: 1px solid ${BORDER} !important;
          border-radius: 16px !important;
          overflow: hidden !important;
          box-shadow: 0 30px 80px rgba(36,31,15,0.18) !important;
        }
        .pnp-login-dialog .p-dialog-header {
          background: ${CARD} !important;
          border-bottom: 1px solid ${BORDER} !important;
          padding: 1.5rem 2rem !important;
        }
        .pnp-login-dialog .p-dialog-header .p-dialog-title {
          font-family: ${FONT} !important;
          font-size: 1.3rem !important;
          font-weight: 700 !important;
          color: ${INK} !important;
          letter-spacing: 0 !important;
        }
        .pnp-login-dialog .p-dialog-header-icon {
          color: ${INK}99 !important;
        }
        .pnp-login-dialog .p-dialog-header-icon:hover {
          color: ${INK} !important;
          background: ${GOLD}18 !important;
        }
        .pnp-login-dialog .p-dialog-content {
          background: ${CARD} !important;
          padding: 2rem !important;
        }
        .pnp-login-dialog .p-dialog-footer {
          background: ${CARD} !important;
          border-top: 1px solid ${BORDER} !important;
          padding: 1rem 2rem !important;
        }
        .pnp-login-dialog .p-button.p-button-text {
          color: ${INK}99 !important;
          font-family: ${FONT} !important;
          font-size: 0.85rem !important;
          font-weight: 500 !important;
        }
        .pnp-login-dialog .p-button.p-button-text:hover {
          color: ${INK} !important;
          background: ${GOLD}18 !important;
        }
      `}</style>

      {/* ── Overlay (mobile) ── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(36,31,15,0.45)",
            backdropFilter: "blur(4px)",
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
        background: BG,
        borderLeft: `1px solid ${BORDER}`,
        zIndex: 99,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)",
        display: "flex",
        flexDirection: "column",
        padding: "5.5rem 2rem 2.5rem",
        fontFamily: FONT,
        boxShadow: open ? "-20px 0 60px rgba(36,31,15,0.12)" : "none",
      }}>
        <p style={{ fontFamily: FONT, fontSize: "0.7rem", letterSpacing: "0.14em", color: GOLD_DARK, textTransform: "uppercase", fontWeight: 600, marginBottom: "1.5rem" }}>
          Prémio Nacional de Publicidade
        </p>

        {(navbar ?? []).map((link: any) => (
          <Link
            key={link.name}
            href={link.link}
            target={link.target ?? "_self"}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: FONT,
              fontSize: "1.15rem",
              fontWeight: 600,
              color: INK,
              textDecoration: "none",
              padding: "0.7rem 0",
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            {link.name}
          </Link>
        ))}
        {!loading && user && (
          <Link
            href="/perfil"
            onClick={() => setOpen(false)}
            style={{ fontFamily: FONT, fontSize: "1.05rem", fontWeight: 600, color: GOLD_DARK, textDecoration: "none", padding: "0.7rem 0", borderBottom: `1px solid ${BORDER}` }}
          >
            {user}
          </Link>
        )}

        <div style={{ marginTop: "auto" }}>
          {!loading && (user ? (
            <button
              onClick={() => { logout(); setOpen(false) }}
              style={{ width: "100%", background: "transparent", border: `1px solid ${BORDER_STRONG}`, borderRadius: "8px", padding: "11px", fontFamily: FONT, fontSize: "0.85rem", fontWeight: 600, color: INK, cursor: "pointer" }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { setVisible(true); setOpen(false) }}
              style={{ width: "100%", background: GOLD, border: "none", borderRadius: "8px", padding: "12px", fontFamily: FONT, fontSize: "0.85rem", color: "#fff", fontWeight: 700, cursor: "pointer" }}
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
        background: scrolled ? `${BG}f5` : BG,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: `1px solid ${scrolled ? BORDER_STRONG : BORDER}`,
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        boxShadow: scrolled ? "0 4px 20px rgba(36,31,15,0.06)" : "none",
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
                  fontFamily: FONT,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: hovered === link.name ? GOLD_DARK : INK,
                  textDecoration: "none",
                  transition: "color 0.2s",
                  position: "relative",
                }}
              >
                {link.name}
                {hovered === link.name && (
                  <span style={{
                    position: "absolute", bottom: "-6px", left: 0, right: 0,
                    height: "2px",
                    background: GOLD,
                    borderRadius: "2px",
                  }} />
                )}
              </Link>
            ))}

            {!loading && user && (
              <Link
                href="/perfil"
                style={{ fontFamily: FONT, fontSize: "0.9rem", fontWeight: 700, color: GOLD_DARK, textDecoration: "none" }}
              >
                {user}
              </Link>
            )}

            {!loading && (user ? (
              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: `1px solid ${BORDER_STRONG}`,
                  borderRadius: "100px",
                  padding: "8px 22px",
                  fontFamily: FONT,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: INK,
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => setVisible(true)}
                style={{
                  background: GOLD,
                  border: "none",
                  borderRadius: "100px",
                  padding: "9px 26px",
                  fontFamily: FONT,
                  fontSize: "0.85rem",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = GOLD_BRIGHT }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = GOLD }}
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
            <span style={{ display: "block", width: "22px", height: "2px", background: INK, borderRadius: "2px", transition: "transform 0.35s", transform: open ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "16px", height: "2px", background: INK, borderRadius: "2px", transition: "opacity 0.35s, width 0.35s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: INK, borderRadius: "2px", transition: "transform 0.35s", transform: open ? "translateY(-7px) rotate(-45deg)" : "none" }} />
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
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: INK, marginBottom: "7px", fontFamily: FONT }}>
            Email
          </label>
          <input
            type="email"
            placeholder="nome@email.com"
            {...register("email", { required: "Email obrigatório" })}
            style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.95rem", color: INK, fontFamily: FONT, outline: "none", marginBottom: "0.85rem", boxSizing: "border-box" }}
          />
          {errors.email && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "-0.6rem", marginBottom: "0.6rem" }}>{errors.email.message}</p>}

          {/* Password */}
          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: INK, marginBottom: "7px", fontFamily: FONT }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password obrigatória" })}
            style={{ width: "100%", background: BG, border: `1px solid ${BORDER}`, borderRadius: "9px", padding: "11px 14px", fontSize: "0.95rem", color: INK, fontFamily: FONT, outline: "none", marginBottom: "1rem", boxSizing: "border-box" }}
          />
          {errors.password && <p style={{ color: "#c0392b", fontSize: "0.8rem", marginTop: "-0.6rem", marginBottom: "0.6rem" }}>{errors.password.message}</p>}

          <button
            type="submit"
            style={{ width: "100%", background: GOLD, border: "none", borderRadius: "9px", padding: "13px", fontFamily: FONT, fontSize: "0.9rem", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Entrar
          </button>
        </form>
      </Dialog>
    </>
  )
}

export default Nav
