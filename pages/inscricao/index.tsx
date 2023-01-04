import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
const qs = require("qs");
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
//import {v4} from "uuid"

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

type Inputs = {
  code: string;
  ncode: string;
};

const Inscreve = ({ social, contato, edicao, navbar }: any) => {
  const router = useRouter();
  //   console.log(router);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      ncode: "pnp-i", //pnp-p0 + ID
    },
  });

  const onSubmitcode: SubmitHandler<Inputs> = (data: any) => {
    alert(data.code);
  };
  const onSubmitncode: SubmitHandler<Inputs> = async (data: any) => {
    // console.log("TerraSystem");
    // console.log(data);
    // e.preventDefault()
    // alert(data.ncode);
    let ncode = data.ncode;
    let uurl = uuidv4();
    let code: any;
    let id: any;
    //return;
    try {
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      // console.log(api_link + "/inscricoes");
      const res: any = await fetch(`${api_link}/inscricoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            code: ncode,
            url: uurl,
          },
        }),
      });
      // ...
      const data = await res.json();
      // console.log("data: apos await.res");
      // console.log(data);
      code = ncode + data.data.id; // id da nova inscricao
      id = data.data.id;
    } catch (err) {
      // console.log("erro:" + err);
    }

    if (code) {
      router.push(`/inscricao/${uurl}?cd=${code}&cid=${id}`);
    }
  };
  // 5555
  console.log(watch("ncode")); // watch input value by passing the name of it
  console.log(watch("code")); // watch input value by passing the name of it
  // dados de categorias
  let Categoria: any = [];
  // create cateoria lists
  edicao.data?.attributes.categoria.map((categs: any, index: any) => {
    Categoria[index] = {
      id: index,
      titulo: categs.titulo,
      slug: categs.titulo.replace(/ /g, "_"),
      descricao: categs.descricao,
    };
  });

  return (
    <Layout rsocial={social} contato={contato} navbar={navbar}>
      <Head>
        <title>Inscrição - Prémio Nacional De Publicidade</title>
      </Head>
      <div className="">
        <div className="bg-gray-50">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
            <h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
              <span className="block text-amarelo-ouro">
                PRÉMIO NACIONAL DE PUBLICIDADE
              </span>
              {/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> */}
            </h2>
          </div>
        </div>
      </div>
      <div className="p-11">
        <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Aceder a sua inscrição
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  Para aceder a sua inscrição introduza o codigo que foi criado
                  como participante do PNP, use esse codigo para verificar a sua
                  inscrição e ou fazer alterações
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitcode)}>
                <div className="">
                  <div className="bg-white px-4 py-5 sm:p-6">
                    {/* <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Codigo de acesso
                        </label>
                        <input
                          type="text"
                          name="code"
                          id="code"
                          autoComplete="code"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div> */}
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="code"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Codigo de acesso
                        </label>
                        <input
                          id="code"
                          autoComplete="code"
                          className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                          {...register("code")}
                        />
                        {errors.code && (
                          <span>o codigo de acesso é obrigatoria</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>

        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Iniciar uma inscrição
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Crie a sua inscrição para o prémio nacional publicidade
                </p>
              </div>
            </div>
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit(onSubmitncode)}>
                <input type="hidden" {...register("ncode")} />
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="col-span-6 sm:col-span-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Abrir inscrição
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inscreve;

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API

  const query = qs.stringify(
    {
      sort: ["N_Edicao:asc"],
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );

  // GET: links para as redes sociais
  const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
  // GET: dados para contatos
  const contato = await fetcher(`${api_link}/contato`);
  // GET: dados para banners
  // const banners = await fetcher(`${api_link}/banners?populate=deep`);
  // GET: dados dos juris, categorias
  /**
   * tem que muda keli urgenti
   */
  const edicao = await fetcher(`${api_link}/edicoes/1?populate=deep&${query}`);
  // GET: dados dos parceiros
  // const parceiros = await fetcher(`${api_link}/parceiros?populate=deep`);
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

  // console.log("edicoesTT");
  // console.log(edicao);

  // Pass data to the page via props
  return { props: { social: rsocials, contato, edicao, navbar: dlink } };
}
