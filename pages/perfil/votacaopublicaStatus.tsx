import Layout from "../../components/Layout"
import { fetcher } from "../../lib/api"
import Head from "next/head"
import { useFetchUser } from "../../lib/authContext"
import Router from "next/router"
import qs from "qs"
import UserProfileCard from "../../components/custom/sidemenu"

// PrimeReact components
import React, { useState, useEffect, useRef } from "react"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { Button } from "primereact/button"
import { Tooltip } from "primereact/tooltip"

// Define types
// interface SocialMedia {
//   data: any
// }

// interface Contact {
//   data: any
// }

// interface NavbarItem {
//   name: string
//   link: string
// }

// interface VotacaoPublica {
//   data: any[]
// }

// interface Props {
//   contato: Contact
//   Vpublica: VotacaoPublica
// }

// API base URL
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL

const VotacaoPublicaStatus = ({ social, contato, Vpublica, navbar }: any) => {
  const { user, loading } = useFetchUser()
  const [products, setProducts] = useState<any[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const dt = useRef<any>(null)

  // Redirect to home if user is not authenticated
  useEffect(() => {
    if (!loading && !user) {
      Router.push("/")
    }
  }, [user, loading])

  console.log(Vpublica)

  // Transform Vpublica data into products
  useEffect(() => {
    const ProductService = Vpublica.data?.map((value: any) => ({
      id: value.id,
      nome_completo: value.attributes.nome_completo,
      categoria: value.attributes.categoria,
      nome_projeto: value.attributes.nome_projeto,
      N_votos_publicos: value.attributes.votacao_publicas.data.length,
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
  if (!user) {
    return null // Redirect is handled in useEffect
  }

  // Table header with export buttons
  const header = (
    <div className="flex align-items-center export-buttons">
      <Button
        type="button"
        icon="pi pi-file-excel"
        onClick={exportExcel}
        className="p-button-success !mr-2"
        data-pr-tooltip="Excel"
      />
      <Button
        type="button"
        icon="pi pi-file-pdf"
        onClick={exportPdf}
        className="p-button-warning !mr-2"
        data-pr-tooltip="PDF"
      />
    </div>
  )

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
      <Head>
        <title>
          Resultado Da Votaçao Publica - Prémio Nacional De Publicidade
        </title>
      </Head>

      <section>
        <div className="bg-gray-100">
          <div className="container mx-auto py-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
              {/* component de side meu */}
              <UserProfileCard user={user} />
              <div className="col-span-4 sm:col-span-9">
                <div className="bg-white shadow rounded-lg p-6">
                  {/* inicio do section */}
                  <h2 className="text-xl font-bold mb-4">Área do Utilizador</h2>
                  {/* <HeroSection
                    title={`Projetos concorrentes à ${edicaoMaisRecente.N_Edicao}ª edição`}
                    subtitle={"Inscrições abertas de 1 a 31 de Janeiro de 2025"}
                  /> */}
                  {/* <p>area de dados</p> */}
                  <div className="bg-white dark:bg-gray-900">
                    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                      <div className="mx-auto max-w-screen-md text-center lg:mb-16 mb-8">
                        <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-amarelo-ouro dark:text-white">
                          Votação Pública
                        </h2>
                        <p className="font-light text-center text-gray-500 sm:text-xl dark:text-gray-400">
                          Contagem dos votos feitos na plataforma
                        </p>
                      </div>
                      <div className="card">
                        <Tooltip
                          target=".export-buttons>button"
                          position="bottom"
                        />
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
                            <Column
                              key={index}
                              field={col.field}
                              header={col.header}
                            />
                          ))}
                        </DataTable>
                      </div>
                    </div>
                  </div>

                  {/* fim do section */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default VotacaoPublicaStatus

// Fetch data on the server side
export const getServerSideProps = async () => {
  try {
    if (!api_link) {
      throw new Error("API_BASE_URL is not defined")
    }

    const query = qs.stringify(
      {
        fields: ["nome_completo", "categoria", "nome_projeto"],
        populate: {
          votacao_publicas: {
            fields: ["id"],
          },
        },
      },
      { encodeValuesOnly: true }
    )

    // Fetch all data concurrently
    const [rsocials, contato, navbar, Vpublica] = await Promise.all([
      fetcher(`${api_link}/api/redes-social?populate=*`),
      fetcher(`${api_link}/api/contato`),
      fetcher(`${api_link}/api/menus?populate=deep`),
      fetcher(`${api_link}/api/inscricoes?${query}`),
    ])

    // Map navbar links
    const dlink = navbar.data.flatMap((value: any) =>
      value.attributes.items.data.map((item: any) => ({
        name: item.attributes.title,
        link: item.attributes.url,
      }))
    )

    return {
      props: {
        social: rsocials,
        contato,
        Vpublica,
        navbar: dlink,
      },
    }
  } catch (error) {
    console.error("Error fetching data:", error)
    return {
      props: {
        social: { data: null },
        contato: { data: null },
        Vpublica: { data: [] },
        navbar: [],
      },
    }
  }
}
