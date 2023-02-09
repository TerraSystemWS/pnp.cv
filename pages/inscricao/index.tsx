import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
const qs = require("qs");
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { useFetchUser } from "../../lib/authContext";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

type Inputs = {
  code: string;
  ncode: string;
  calc: string;
};

const Inscreve = ({ social, contato, edicao, navbar }: any) => {
  const { user, loading } = useFetchUser();
  const router = useRouter();
  // const [vnum, setVnum] = useState();
  //   console.log(router);
  let num1 = 5;

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

  const onSubmitcode: SubmitHandler<Inputs> = async (data: any) => {
    //  alert(data.code);
    const swap: any = data.code.split("i");
    const id: any = swap[1];
    try {
      const res: any = await fetch(`${api_link}/inscricoes/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // ,
        // body: JSON.stringify({
        //   data: {
        //     code: ncode,
        //     url: uurl,
        //   },
        // }),
      });

      const dados = await res.json();
      // console.log("terra system");
      // console.log(data.data.attributes.url);
      // return;
      if (dados) {
        let timerInterval: any;

        Swal.fire({
          title: "...procurando inscrição...",
          html: "pesquisando o id #pnp-i<b></b>...",
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading(Swal.getDenyButton()!);
            // @ts-ignore
            const b = Swal.getHtmlContainer().querySelector("b");
            timerInterval = setInterval(() => {
              // @ts-ignore
              b.textContent = Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });

        router.push(
          `/inscricao/${dados.data.attributes.url}?cd=${data.code}&cid=${id}`
        );
      }

      //code = ncode + data.data.id; // id da nova inscricao
      //id = data.data.id;
    } catch (err) {
      // console.log("erro:" + err);
    }
  };

  const onSubmitncode: SubmitHandler<Inputs> = async (data: any) => {
    let ncode = data.ncode;

    let calculo = data.calc - 10;
    if (calculo != num1) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "O Valor pode estar errado",
      });
    } else {
      Swal.fire({
        title: "Prémio Nacional De Publicidade",
        text: "Antes de iniciar a candidatura saiba sobre os regulamentos do concurso.",
        footer: '<a href="/regulamentos">Regulamentos</a>',
        imageUrl:
          "https://res.cloudinary.com/dkz8fcpla/image/upload/v1672960467/Captura_de_ecra_de_2023_01_05_22_13_23_ae07a3a795.png?updated_at=2023-01-05T23:14:27.822Z",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "pnp gala",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#c2a12b",
        cancelButtonColor: "#d33",
        confirmButtonText: "sim, inscrever",
      }).then(async (result) => {
        if (result.isConfirmed) {
          let code: any;
          let id: any;
          let uurl = uuidv4();
          let Status: number = 0;

          try {
            const res: any = await fetch(`${api_link}/inscricoes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  code: ncode,
                  url: uurl,
                  publishedAt: null,
                },
              }),
            });

            const data = await res.json();

            // console.log("================ data =================");
            // console.log(data);
            Status = data.error.status;

            code = ncode + data.data.id; // id da nova inscricao
            id = data.data.id;
          } catch (err) {
            // console.log("erro:" + err);
          }

          // console.log("====== status ======");
          // console.log(Status);

          let timerInterval: any;
          if (Status == 200) {
            Swal.fire({
              title: "Criando sua inscrição",
              html: "criando id de incrição #pnp-i<b></b>...",
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading(Swal.getDenyButton()!);
                // @ts-ignore
                const b = Swal.getHtmlContainer().querySelector("b");
                timerInterval = setInterval(() => {
                  // @ts-ignore
                  b.textContent = Swal.getTimerLeft();
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            });

            //await setTimeout(5000);
            // calculation of no. of days between two date

            // To set two dates to two variables
            var data_inicio = new Date();
            var data_fim = new Date("01/31/2023");

            // To calculate the time difference of two dates
            var Difference_In_Time = data_fim.getTime() - data_inicio.getTime();

            // To calculate the no. of days between two dates
            var Difference_In_Days = Math.round(
              Difference_In_Time / (1000 * 3600 * 24)
            );

            setTimeout(() => {
              Swal.fire(
                "Incrito",
                `A sua incrição foi efetuada com sucesso, tem ${Difference_In_Days} dias para finalizar o processo`,
                "success"
              );
            }, 2500);

            if (code) {
              router.push(`/inscricao/${uurl}?cd=${code}&cid=${id}`);
            }
          } else {
            setTimeout(() => {
              Swal.fire(
                "ERRO",
                `O tempo para a candidatura terminou`,
                "warning"
              );
            }, 2500);
          }
        }
      });
    }

    //   console.log(watch("ncode")); // watch input value by passing the name of it
    //   console.log(watch("code")); // watch input value by passing the name of it
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
  };
  return (
    <Layout rsocial={social} contato={contato} navbar={navbar} user={user}>
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-amarelo-escuro focus:ring-offset-2"
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
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Qual o valor?
                      </label>
                      <p>{num1} + 10 </p>
                      <input
                        id="code"
                        autoComplete="code"
                        className="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
                        {...register("calc")}
                      />
                      {errors.code && (
                        <span>o codigo de acesso é obrigatoria</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    <div className="col-span-6 sm:col-span-4">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-amarelo-ouro py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amarelo-escuro focus:outline-none focus:ring-2 focus:ring-amarelo-escuro focus:ring-offset-2"
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
