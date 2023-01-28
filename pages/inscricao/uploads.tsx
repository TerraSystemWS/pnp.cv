import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
// @ts-ignore: Object is possibly 'null'.

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;
// { social, contato, navbar }: any
const Uploads = () => {
  //   console.log(inscritos);
  const toast = useRef(null);

  const onUpload = () => {
    // toast.current.show({
    //   severity: "info",
    //   summary: "Success",
    //   detail: "File Uploaded",
    // });
    console.log("upload feito con sucesso");
  };

  return (
    // <Layout rsocial={social} contato={contato} navbar={navbar}>
    //   <Head>
    //     <title>Uploads De Trabalhos - Prémio Nacional De Publicidade</title>
    //   </Head>
    // <section>
    //   <div className="flex items-center justify-center mt-20 mb-10">
    //     {/* <Toast ref={toast}></Toast> */}
    //     <FileUpload
    //       name="demo[]"
    //       url="/api/upload-to-s3"
    //       onUpload={onUpload}
    //       multiple
    //       accept="image/*"
    //       maxFileSize={1000000}
    //       emptyTemplate={
    //         <p className="m-0">Drag and drop files to here to upload.</p>
    //       }
    //     />
    //   </div>
    // </section>
    // </Layout>
    <p>terra</p>
  );
};

export default Uploads;

// This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
//   // console.log(query)

//   // GET: links para as redes sociais
//   const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
//   // GET: dados para contatos
//   const contato = await fetcher(`${api_link}/contato`);
//   // GET: dados do navbar
//   const navbar = await fetcher(`${api_link}/menus?populate=deep`);
//   // GET: dados dos projetos inscritos
//   //   const inscritos = await fetcher(`${api_link}/inscricoes/${id}`);
//   //get links for menu
//   let dlink: any = [];
//   navbar.data.map((value: any) => {
//     value.attributes.items.data.map((value: any, index: any) => {
//       // value.attributes.title;
//       // value.attributes.url;
//       // console.log(value);
//       dlink[index] = {
//         name: value.attributes.title,
//         link: value.attributes.url,
//       };
//     });
//   });
//   //   console.log(inscritos);

//   // Pass data to the page via props
//   return { props: { social: rsocials, contato, navbar: dlink } };
// }
