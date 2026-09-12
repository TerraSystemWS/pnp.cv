import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import { parseNavbar } from "../../lib/parseNavbar"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import Router from "next/router"
import qs from "qs"
import UserProfileCard from "../../components/custom/sidemenu"
import EdicaoPicker from "../../components/custom/EdicaoPicker"
import { hasJuryAccess } from "../../lib/roles"
import { getEdicoesDisponiveis, resolveEdicaoSelecionada } from "../../lib/edicoes"
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, BG_ALT, CARD, BORDER, FONT, FONT_IMPORT } from "../../lib/theme"

// PrimeReact components
import React, { useState, useEffect, useRef } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"

// Define types
// API base URL
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const VotacaoPublicaStatus = ({ social, contato, Vpublica, navbar, edicoesDisponiveis, edicaoSelecionada }: any) => {
  const { user, role, loading } = useFetchUser()
  const [products, setProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const dt = useRef<any>(null)

  // Redirect to home if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      Router.push("/")
    }
  }, [user, loading])

  // Verificar se o usuário é permitido (depois de carregado)
  useEffect(() => {
    if (!loading && user && !hasJuryAccess(role)) {
      Router.push("/perfil")
    }
  }, [user, role, loading])

  // Transform Vpublica data into products
  useEffect(() => {
    const ProductService = Vpublica.data?.map((value: any) => ({
      id: value.id,
      nome_completo: value.attributes.nome_completo,
      categoria: value.attributes.categoria,
      nome_projeto: value.attributes.nome_projeto,
      N_votos_publicos: value.attributes.votacao_publicas?.data?.length ?? 0,
    }))
    setProducts(ProductService)
  }, [Vpublica])

  // Columns for the DataTable
  const cols = [
    { field: "id", header: "ID" },
    { field: "nome_completo", header: "Nome Completo" },
    { field: "categoria", header: "Categoria" },
    { field: "nome_projeto", header: "Nome projeto" },
    { field: "N_votos_publicos", header: "N° Votos Publicos" },
  ]

  // Export columns for PDF/Excel
  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }))

  // Handle row selection
  const onSelectionChange = (e: any) => {
    setSelectedProducts(e.value)
  }

  // Export to PDF
  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        // @ts-ignore
        const doc = new jsPDF.default(0, 0)
        // @ts-ignore
        doc.autoTable(exportColumns, products)
        doc.save("VotacaoPublica.pdf")
      })
    })
  }

  // Export to Excel
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products)
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] }
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      })
      saveAsExcelFile(excelBuffer, "VotacaoPublica")
    })
  }

  // guarda na excel (encontrar form de guarda na openDocuments)
  const saveAsExcelFile = (buffer: any, fileName: string) => {
    // @ts-ignore
    import("file-saver").then((module) => {
      if (module && module.default) {
        const EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"
        const EXCEL_EXTENSION = ".xlsx"
        const data = new Blob([buffer], { type: EXCEL_TYPE })
        module.default.saveAs(
          data,
          `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`
        )
      }
    })
  }

  // Render only if user is authenticated
  if (!user || loading) {
    return null // Redirecionamento é tratado no useEffect
  }

  // Table header with export buttons
  const header = (
    <div style={{ display: "flex", gap: "0.6rem" }}>
      <button type="button" className="vp-export-btn" onClick={exportExcel}>
        <i className="pi pi-file-excel" /> Excel
      </button>
      <button type="button" className="vp-export-btn" onClick={exportPdf}>
        <i className="pi pi-file-pdf" /> PDF
      </button>
    </div>
  )

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>Resultado da Votação Pública - Prémio Nacional De Publicidade</title>
        <meta name="description" content="Contagem dos votos do público no Prémio Nacional de Publicidade" />
      </Head>

      <style>{`
        ${FONT_IMPORT}
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }

        .vp-export-btn { display: inline-flex; align-items: center; gap: 0.45rem; background: transparent; border: 1px solid ${GOLD_DARK}55; border-radius: 9px; padding: 8px 16px; font-family: ${FONT}; font-size: 0.84rem; font-weight: 600; color: ${GOLD_DARK}; cursor: pointer; transition: background 0.2s; }
        .vp-export-btn:hover { background: ${GOLD}14; }

        .vp-table-wrap { border: 1px solid ${BORDER}; border-radius: 14px; overflow: hidden; }
        .vp-table-wrap .p-datatable-header { background: ${BG_ALT}; border: none; border-bottom: 1px solid ${BORDER}; padding: 1rem 1.25rem; }
        .vp-table-wrap .p-datatable-thead > tr > th { background: ${BG_ALT}; color: ${GOLD_DARK}; font-family: ${FONT}; font-size: 0.74rem; letter-spacing: 0.04em; text-transform: uppercase; font-weight: 700; border-color: ${BORDER}; }
        .vp-table-wrap .p-datatable-tbody > tr { background: ${CARD}; color: ${INK}; font-family: ${FONT}; font-size: 0.88rem; }
        .vp-table-wrap .p-datatable-tbody > tr:nth-child(even) { background: ${BG_ALT}80; }
        .vp-table-wrap .p-datatable-tbody > tr > td { border-color: ${BORDER}; }
        .vp-table-wrap .p-datatable-tbody > tr.p-highlight { background: ${GOLD}22 !important; color: ${INK} !important; }
        .vp-table-wrap .p-checkbox .p-checkbox-box.p-highlight { background: ${GOLD}; border-color: ${GOLD}; }
        .vp-table-wrap .p-paginator { background: ${CARD}; border-color: ${BORDER}; font-family: ${FONT}; }
        .vp-table-wrap .p-paginator .p-paginator-page.p-highlight { background: ${GOLD}; color: #fff; }
      `}</style>

      {/* Hero */}
      <div style={{ background: BG_ALT, paddingTop: "6rem", paddingBottom: "3rem", textAlign: "center", borderBottom: `1px solid ${BORDER}` }}>
        <p style={{ fontFamily: FONT, fontSize: "0.88rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 700, color: GOLD_DARK, marginBottom: "1rem", animation: "fadeUp 0.6s ease both" }}>
          Prémio Nacional de Publicidade
        </p>
        <h1 style={{ fontFamily: FONT, fontSize: "clamp(2.42rem,6vw,3.74rem)", fontWeight: 700, color: INK, margin: 0, animation: "fadeUp 0.7s ease 0.1s both" }}>
          Resultado da Votação Pública
        </h1>
        <p style={{ fontFamily: FONT, fontSize: "1.1rem", color: INK_SOFT, marginTop: "1rem", animation: "fadeUp 0.8s ease 0.2s both" }}>
          Contagem dos votos feitos pelo público na plataforma.
        </p>
      </div>

      <div style={{ background: BG, padding: "3rem 2rem 6rem", fontFamily: FONT }}>
        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6" style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <UserProfileCard user={user} role={role} />

          <div className="col-span-4 sm:col-span-9">
            <EdicaoPicker
              edicoes={edicoesDisponiveis}
              selecionada={edicaoSelecionada}
              basePath="/perfil/votacaopublicaStatus"
              variant="inline"
            />

            <div className="vp-table-wrap">
              <DataTable
                ref={dt}
                value={products}
                header={header}
                dataKey="id"
                responsiveLayout="scroll"
                selectionMode="multiple"
                selection={selectedProducts}
                onSelectionChange={onSelectionChange}
              >
                {cols.map((col, index) => (
                  <Column key={index} field={col.field} header={col.header} />
                ))}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default VotacaoPublicaStatus

// Fetch data on the server side
export const getServerSideProps = async ({ query: routerQuery }: any) => {
  try {
    if (!api_link) {
      throw new Error("API_BASE_URL is not defined")
    }

    const edicoesDisponiveis = await getEdicoesDisponiveis()
    const edicaoSelecionada = resolveEdicaoSelecionada(routerQuery.edicao, edicoesDisponiveis)

    const query = qs.stringify(
      {
        fields: ["nome_completo", "categoria", "nome_projeto"],
        filters: { edicoes: { N_Edicao: { $eq: edicaoSelecionada } } },
        populate: {
          votacao_publicas: {
            fields: ["id"],
          },
        },
      },
      { encodeValuesOnly: true }
    )

    // Fetch all data concurrently
    const results = await Promise.allSettled([
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?${query}`),
    ])
    const [contato, menus, inscricoes] = results.map((r: any) => {
      if (r.status === "fulfilled") return r.value
      console.error("Endpoint failed:", r.reason)
      return null
    })

    return {
      props: {
        social: parseNavbar(menus, "redes-social"),
        contato: contato ?? null,
        Vpublica: inscricoes ?? { data: [] },
        navbar: parseNavbar(menus, "menus"),
        edicoesDisponiveis,
        edicaoSelecionada,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      props: {
        social: [],
        contato: null,
        Vpublica: { data: [] },
        navbar: [],
        edicoesDisponiveis: [],
        edicaoSelecionada: null,
      },
    }
  }
}
