import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import qs from "qs"
import Head from "next/head"
import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/router"
import { v4 as uuidv4 } from "uuid"
import Swal from "sweetalert2"
import { useFetchUser } from "../../lib/authContext"
import { useMemo } from "react"

const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

type AccessForm = { code: string }
type NewForm = { ncode: string; calc: string }

const parseInscricaoId = (code: string): string | null => {
  const match = code.trim().match(/^pnp-i(\d+)$/)
  return match ? match[1] : null
}

const Inscreve = ({ social, contato, edicao, navbar }: any) => {
  const { user } = useFetchUser()
  const router = useRouter()

  const num1 = useMemo(() => Math.floor(Math.random() * 20) + 1, [])
  const num2 = useMemo(() => Math.floor(Math.random() * 10) + 1, [])
  const expectedAnswer = num1 + num2

  const dataFim = edicao?.data?.attributes?.data_fim
    ? new Date(edicao.data.attributes.data_fim)
    : new Date("2025-01-31")
  const diffDays = Math.max(0, Math.ceil((dataFim.getTime() - Date.now()) / 86400000))
  const deadlineStr = dataFim.toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })

  const {
    register: regAccess,
    handleSubmit: handleAccess,
    formState: { errors: errAccess },
  } = useForm<AccessForm>()

  const {
    register: regNew,
    handleSubmit: handleNew,
    formState: { errors: errNew },
  } = useForm<NewForm>({ defaultValues: { ncode: "pnp-i" } })

  const onSubmitcode: SubmitHandler<AccessForm> = async (data) => {
    const id = parseInscricaoId(data.code)
    if (!id) {
      Swal.fire({ icon: "error", title: "Código inválido", text: "O formato correto é pnp-iXXX." })
      return
    }
    try {
      const res = await fetch(`${api_link}/api/inscricoes/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const dados = await res.json()
      const url = dados?.data?.attributes?.url
      if (!url) throw new Error("URL não encontrada")

      let timerInterval: any
      Swal.fire({
        title: "Procurando inscrição...",
        html: `Pesquisando o ID <b>${data.code}</b>...`,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer()?.querySelector("b")
          if (b) timerInterval = setInterval(() => { b.textContent = Swal.getTimerLeft()?.toString() || "" }, 100)
        },
        willClose: () => clearInterval(timerInterval),
      })
      router.push(`/inscricao/${url}?cd=${data.code}&cid=${id}`)
    } catch {
      Swal.fire({ icon: "error", title: "Erro", text: "Erro ao buscar inscrição. Verifique o código e tente novamente." })
    }
  }

  const onSubmitncode: SubmitHandler<NewForm> = async (data) => {
    if (Number(data.calc) !== expectedAnswer) {
      Swal.fire({ icon: "error", title: "Resposta incorreta", text: "Verifique o cálculo e tente novamente." })
      return
    }
    const result = await Swal.fire({
      title: "Prémio Nacional De Publicidade",
      text: "Antes de iniciar a candidatura, leia os regulamentos do concurso.",
      footer: '<a href="/regulamentos">Regulamentos</a>',
      imageUrl: "https://res.cloudinary.com/dkz8fcpla/image/upload/v1672960467/Captura_de_ecra_de_2023_01_05_22_13_23_ae07a3a795.png?updated_at=2023-01-05T23:14:27.822Z",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: "PNP Gala",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c2a12b",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, inscrever",
    })
    if (!result.isConfirmed) return

    const uurl = uuidv4()
    try {
      const res = await fetch(`${api_link}/api/inscricoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { code: data.ncode, url: uurl, publishedAt: null } }),
      })
      const responseData = await res.json()
      if (!responseData.data?.id) throw new Error("Dados não encontrados.")

      const code = data.ncode + responseData.data.id
      const id = responseData.data.id

      let timerInterval: any
      Swal.fire({
        title: "Criando sua inscrição",
        html: `Criando ID <b>${data.ncode}</b>...`,
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer()?.querySelector("b")
          if (b) timerInterval = setInterval(() => { b.textContent = Swal.getTimerLeft()?.toString() || "" }, 100)
        },
        willClose: () => clearInterval(timerInterval),
      })
      setTimeout(() => {
        Swal.fire("Inscrito!", `Inscrição criada. Tem ${diffDays} dias para finalizar o processo.`, "success")
      }, 2500)
      router.push(`/inscricao/${uurl}?cd=${code}&cid=${id}`)
    } catch {
      Swal.fire({ icon: "error", title: "Erro", text: "Erro ao criar inscrição. Tente novamente." })
    }
  }

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Inscrição — Prémio Nacional De Publicidade</title>
        <meta name="description" content="Candidatura ao Prémio Nacional de Publicidade de Cabo Verde." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        @keyframes goldShimmer {
          0%   { background-position: -300% center; }
          100% { background-position:  300% center; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulseGold {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }

        .pnp-page {
          background: #080604;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* grain */
        .pnp-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.04;
          pointer-events: none;
          z-index: 0;
        }

        /* radial glow behind hero */
        .pnp-glow {
          position: absolute;
          top: 0; left: 50%;
          transform: translateX(-50%);
          width: 700px; height: 420px;
          background: radial-gradient(ellipse at center, rgba(194,161,43,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .pnp-hero {
          animation: fadeIn 1s ease both;
          position: relative; z-index: 1;
        }

        .pnp-display { font-family: 'Cormorant Garamond', Georgia, serif; }

        .pnp-shimmer {
          background: linear-gradient(90deg,
            #8a6e1a 0%,
            #c2a12b 20%,
            #f0d060 40%,
            #ffe87a 50%,
            #f0d060 60%,
            #c2a12b 80%,
            #8a6e1a 100%
          );
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 5s linear infinite;
        }

        .pnp-rule {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(194,161,43,0.5) 50%, transparent 100%);
        }

        .pnp-deadline {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(194,161,43,0.3);
          border-radius: 100px;
          padding: 5px 16px;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c2a12b;
          background: rgba(194,161,43,0.06);
          animation: fadeIn 0.8s 0.2s both;
        }

        .pnp-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c2a12b;
          animation: pulseGold 2s ease-in-out infinite;
        }

        /* Cards */
        .pnp-card {
          background: linear-gradient(160deg, #100d07 0%, #18130a 60%, #100d07 100%);
          border: 1px solid rgba(194,161,43,0.2);
          border-radius: 20px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.5s ease, box-shadow 0.5s ease, transform 0.4s ease;
          opacity: 0;
        }

        .pnp-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 0%, rgba(194,161,43,0.06) 0%, transparent 60%);
          pointer-events: none;
        }

        .pnp-card:hover {
          border-color: rgba(194,161,43,0.55);
          box-shadow: 0 24px 64px rgba(194,161,43,0.12), 0 0 0 1px rgba(194,161,43,0.08);
          transform: translateY(-6px);
        }

        .pnp-card-1 { animation: fadeUp 0.7s 0.3s ease forwards; }
        .pnp-card-2 { animation: fadeUp 0.7s 0.5s ease forwards; }

        .pnp-icon {
          width: 52px; height: 52px;
          border: 1px solid rgba(194,161,43,0.35);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(194,161,43,0.07);
          margin-bottom: 1.75rem;
          transition: background 0.3s, border-color 0.3s;
          position: relative; z-index: 1;
        }

        .pnp-card:hover .pnp-icon {
          background: rgba(194,161,43,0.15);
          border-color: rgba(194,161,43,0.65);
        }

        .pnp-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 300;
          color: #f5e8b8;
          margin-bottom: 0.5rem;
          position: relative; z-index: 1;
          letter-spacing: 0.01em;
        }

        .pnp-card-desc {
          font-size: 0.82rem;
          color: rgba(240,216,144,0.38);
          line-height: 1.65;
          margin-bottom: 2rem;
          position: relative; z-index: 1;
        }

        .pnp-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(194,161,43,0.5);
          margin-bottom: 8px;
        }

        .pnp-input {
          width: 100%;
          background: rgba(194,161,43,0.05);
          border: 1px solid rgba(194,161,43,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 0.875rem;
          color: #f0e0a0;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
          position: relative; z-index: 1;
        }

        .pnp-input::placeholder { color: rgba(194,161,43,0.25); }

        .pnp-input:focus {
          outline: none;
          border-color: rgba(194,161,43,0.6);
          background: rgba(194,161,43,0.09);
          box-shadow: 0 0 0 3px rgba(194,161,43,0.08);
        }

        /* remove number arrows */
        .pnp-input[type=number]::-webkit-inner-spin-button,
        .pnp-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        .pnp-input[type=number] { -moz-appearance: textfield; }

        .pnp-calc {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 10px;
          position: relative; z-index: 1;
        }

        .pnp-calc-eq {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          color: #d4aa40;
          letter-spacing: 0.08em;
          background: rgba(194,161,43,0.07);
          border: 1px solid rgba(194,161,43,0.18);
          border-radius: 8px;
          padding: 6px 18px;
        }

        .pnp-btn {
          width: 100%;
          background: linear-gradient(135deg, #b8941f 0%, #d4aa40 35%, #f0d060 65%, #d4aa40 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 10px;
          padding: 13px 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1205;
          cursor: pointer;
          transition: background-position 0.5s ease, transform 0.2s ease, box-shadow 0.3s ease;
          position: relative; z-index: 1;
          margin-top: 8px;
        }

        .pnp-btn:hover {
          background-position: right center;
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(194,161,43,0.35);
        }

        .pnp-btn:active { transform: translateY(0); }

        .pnp-err { color: rgba(248,113,113,0.8); font-size: 0.72rem; margin-top: 4px; }

        .pnp-divider {
          display: none;
        }

        @media (max-width: 768px) {
          .pnp-card { padding: 2rem 1.5rem; }
          .pnp-divider {
            display: block;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(194,161,43,0.2), transparent);
            margin: 0.5rem 0;
          }
        }
      `}</style>

      <div className="pnp-page">
        {/* Hero */}
        <div className="pnp-hero pt-28 pb-14 px-6 text-center">
          <div className="pnp-glow" />

          <div className="pnp-deadline mb-8">
            <span className="pnp-dot" />
            Prazo: {deadlineStr}
            {diffDays > 0 && <span style={{ color: "rgba(194,161,43,0.6)" }}>· {diffDays} dias</span>}
            {diffDays === 0 && <span style={{ color: "rgba(248,113,113,0.8)" }}>· Encerrado</span>}
          </div>

          <h1 className="pnp-display pnp-shimmer text-6xl md:text-8xl font-light leading-none tracking-tight mb-3">
            Candidatura
          </h1>
          <p className="pnp-display text-lg md:text-xl font-light tracking-[0.25em] uppercase mb-10"
             style={{ color: "rgba(240,216,144,0.35)" }}>
            Prémio Nacional de Publicidade
          </p>

          <div className="pnp-rule max-w-sm mx-auto" />
        </div>

        {/* Cards */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-28">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Card 1 — Resume */}
            <div className="pnp-card pnp-card-1">
              <div className="pnp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="#c2a12b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="15" r="4" />
                  <line x1="12" y1="15" x2="22" y2="15" />
                  <line x1="19" y1="12" x2="19" y2="18" />
                </svg>
              </div>

              <h3 className="pnp-card-title">Retomar Inscrição</h3>
              <p className="pnp-card-desc">
                Já iniciou a sua candidatura? Insira o código recebido para continuar de onde parou.
              </p>

              <form onSubmit={handleAccess(onSubmitcode)}>
                <div style={{ position: "relative", zIndex: 1 }}>
                  <label className="pnp-label">Código de acesso</label>
                  <input
                    className="pnp-input"
                    placeholder="pnp-i000"
                    {...regAccess("code", { required: "Código obrigatório" })}
                  />
                  {errAccess.code && <p className="pnp-err">{errAccess.code.message}</p>}
                </div>
                <button type="submit" className="pnp-btn">
                  Retomar candidatura →
                </button>
              </form>
            </div>

            {/* Card 2 — New */}
            <div className="pnp-card pnp-card-2">
              <div className="pnp-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                     stroke="#c2a12b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>

              <h3 className="pnp-card-title">Nova Candidatura</h3>
              <p className="pnp-card-desc">
                Crie uma nova candidatura ao Prémio. Certifique-se de ter lido o regulamento antes de começar.
              </p>

              <form onSubmit={handleNew(onSubmitncode)}>
                <input type="hidden" {...regNew("ncode")} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <label className="pnp-label">Verificação anti-spam</label>
                  <div className="pnp-calc">
                    <span className="pnp-calc-eq">{num1} + {num2} = ?</span>
                  </div>
                  <input
                    className="pnp-input"
                    type="number"
                    placeholder="Resposta"
                    {...regNew("calc", { required: "Resposta obrigatória" })}
                  />
                  {errNew.calc && <p className="pnp-err">{errNew.calc.message}</p>}
                </div>
                <button type="submit" className="pnp-btn">
                  Iniciar candidatura →
                </button>
              </form>
            </div>

          </div>

          {/* Footer note */}
          <p className="text-center mt-10" style={{ color: "rgba(194,161,43,0.25)", fontSize: "0.72rem", letterSpacing: "0.06em" }}>
            Ao submeter, declara ter lido e aceite o{" "}
            <a href="/regulamentos"
               style={{ color: "rgba(194,161,43,0.5)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              regulamento
            </a>{" "}
            do concurso.
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default Inscreve

export async function getServerSideProps() {
  const query = qs.stringify({ sort: ["N_Edicao:asc"] }, { encodeValuesOnly: true })
  try {
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/edicoes/1?populate=deep&${query}`),
      fetcher(`${api_link}/api/menus?populate=deep`),
    ])
    const [contato, edicao, menus] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })
    return {
      props: {
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        edicao: edicao ?? null,
        navbar: parseNavbar(menus, "menus"),
      },
    }
  } catch (error) {
    console.error("Erro ao buscar dados:", error)
    return {
      props: { social: [], contato: null, edicao: null, navbar: [] },
    }
  }
}
