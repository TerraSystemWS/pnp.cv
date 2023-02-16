import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import { useFetchUser } from "../../lib/authContext";
import Router, { useRouter } from "next/router";
const qs = require("qs");

// para primereact
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
// import { ProductService } from "./service/ProductService";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const VotacaoPublicaStatus = ({ social, contato, Vpublica, navbar }: any) => {
  const { user, loading } = useFetchUser();

  //   useEffect(() => {
  //     if (user) {
  //       //   return "";
  //     } else {
  //       Router.push("/");
  //     }
  //   });

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  let dt = useRef(null);

  let ProductService: any = [];
  // console.log("============ Vpublica ===============");
  // console.log(Vpublica);
  /* create the data */
  Vpublica.data.map((value: any, index: number) => {
    // console.log(value.id);
    ProductService[index] = {
      id: value.id,
      nome_completo: value.attributes.nome_completo,
      categoria: value.attributes.categoria,
      nome_projeto: value.attributes.nome_projeto,
      N_votos_publicos: value.attributes.votacao_publicas.data.length,
    };
  });

  //   const ProductService: any = [
  //     {
  //       id: "1020",
  //       nome_completo: "huk8646 jj",
  //       categoria: "terra Watch",
  //       nome_projeto: "Product Description",
  //       N_votos_publicos: 65,
  //     },
  //     {
  //       id: "1000",
  //       nome_completo: "hukjj",
  //       categoria: "terra Watch",
  //       nome_projeto: "Product Description",
  //       N_votos_publicos: 65,
  //     },
  //   ];

  const cols = [
    { field: "id", header: "ID" },
    { field: "nome_completo", header: "Nome Completo" },
    { field: "categoria", header: "Categoria" },
    { field: "nome_projeto", header: "Nome projeto" },
    { field: "N_votos_publicos", header: "N° Votos Publicos" },
  ];

  const exportColumns = cols.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));

  useEffect(() => {
    // ProductService.getProductsMini().then((data: any) => setProducts(data));
    setProducts(ProductService);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectionChange = (e: any) => {
    setSelectedProducts(e.value);
  };

  //   const exportCSV = (selectionOnly: any) => {
  //     // @ts-ignore
  //     dt.current.exportCSV({ selectionOnly });
  //   };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        // @ts-ignore
        const doc = new jsPDF.default(0, 0);
        // @ts-ignore
        doc.autoTable(exportColumns, products);
        doc.save("VotacaoPublica.pdf");
      });
    });
  };

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(products);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "VotacaoPublica");
    });
  };

  const saveAsExcelFile = (buffer: any, fileName: any) => {
    // @ts-ignore
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };

  if (user) {
    const header = (
      <div className="flex align-items-center export-buttons">
        {/* <Button
        type="button"
        icon="pi pi-file"
        onClick={() => exportCSV(false)}
        className="!mr-2 "
        data-pr-tooltip="CSV"
      /> */}
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
        {/* <Button
        type="button"
        icon="pi pi-filter"
        onClick={() => exportCSV(true)}
        className="p-button-info !ml-auto"
        data-pr-tooltip="Seleção Única"
      /> */}
      </div>
    );

    return (
      <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
        <Head>
          <title>
            Resultado Da Votaçao Publica - Prémio Nacional De Publicidade
          </title>
        </Head>

        <section className="bg-white dark:bg-gray-900">
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
              <Tooltip target=".export-buttons>button" position="bottom" />

              <DataTable
                ref={(el) => {
                  //@ts-ignore
                  dt = el;
                }}
                value={products}
                header={header}
                dataKey="id"
                responsiveLayout="scroll"
                selectionMode="multiple"
                selection={selectedProducts}
                onSelectionChange={onSelectionChange}
              >
                {cols.map((col: any, index: any) => (
                  <Column key={index} field={col.field} header={col.header} />
                ))}
              </DataTable>
            </div>
          </div>
        </section>
      </Layout>
    );
  } else {
    return "";
  }
};

export default VotacaoPublicaStatus;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  const query = qs.stringify(
    {
      fields: ["nome_completo", "categoria", "nome_projeto"],
      // populate: ["votacao_publicas"],
      populate: {
        votacao_publicas: {
          fields: ["id"],
        },
      },
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados para posts
  const posts = await fetcher(`${api_link}/posts?populate=*`);
  // GET: dados do navbar
  const navbar = await fetcher(`${api_link}/menus?populate=deep`);
  //get links for menu
  let dlink: any = [];
  navbar.data.map((value: any) => {
    value.attributes.items.data.map((value: any, index: any) => {
      // value.attributes.title;
      // value.attributes.url;
      // console.log(value);
      dlink[index] = {
        name: value.attributes.title,
        link: value.attributes.url,
      };
    });
  });
  // console.log(banners.attributes);

  // Get inscricao e suas votacoes
  const Vpublica = await fetcher(`${api_link}/inscricoes?${query}`);

  // Pass data to the page via props
  return { props: { social: rsocials, contato, Vpublica, navbar: dlink } };
}
