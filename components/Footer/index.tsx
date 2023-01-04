import Link from "next/link";
import Image from "next/image";
import logo from "public/logo1.png";
import { useForm, SubmitHandler } from "react-hook-form";

import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoYoutube,
  IoLogoTwitter,
} from "react-icons/io5";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

type Inputs = {
  email: string;
};

const Footer = ({ rsocial, contato, navbar }: any) => {
  // console.log("dados passado para o footer por layout");
  // console.log(contato.data.attributes.Local);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (email) => {
    //console.log("email");
    //console.log(email);
    /*return; */
    try {
      // console.log("TerraSystem");
      // console.log(email);
      // c5e2576e41ab25094ae9b666d78e4658d8565738943bf689cf6507457e4a0ae926bc3e326d54c42bb6381cfa680d2402c32077d9f5208c7687e3a50aa1ba08fb8e3662070d721f90929b7779144010cf14d8559bf664f92de2374b83829d78a9c764481a2b35b3d513a2d24ad428d73ad10b1fe4d509b0fd1eb503176b97d647
      //console.log(api_link + "/newsletters");
      const res = await fetch(`${api_link}/newsletters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: email,
        }),
        /* JSON.stringify({
          email: email,
        }), */
      });
      // ...
      // console.log(res.json());
      const data = await res.json();
      //console.log("data: apos await.res");
      //console.log(data);
    } catch (err) {
      //console.log("erro:" + err);
    }
  };

  let usefulLinks = [
    { name: "Home", link: "/" },
    { name: "Sobre Nós", link: "/" },
    { name: "Termos de Serviço", link: "/" },
    { name: "Política de Privacidade", link: "/" },
  ];

  let websites = [
    { name: "HOME", link: "/" },
    { name: "REGULAMENTOS", link: "/regulamentos" },
    { name: "EDIÇÕES", link: "/edicoes" },
    { name: "PARCEIROS", link: "/parceiros" },
    { name: "BLOG", link: "/posts" },
    { name: "CONTATOS", link: "/contatos" },
  ];

  // if (rsocial) {
  // 	rsocial.data.attributes.link.map((link: any) => {

  // 	});
  // }

  const d = new Date();
  let year = d.getFullYear();

  return (
    <footer>
      <div className="p-10 bg-preto text-amarelo-ouro">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="md-5">
              <h4 className="text-2xl pb-4 uppercase">
                <Image src={logo} alt="logo" />
              </h4>
              <p className="text-gray-300">
                {contato.data.attributes.Local}
                <strong>{/* <IoCallOutline /> */}</strong>
                {/* (+238) 261 4915 / 9278968 */}
                {contato.data.attributes.phone}
                <br />
                {/* <strong>
									<IoSendOutline />
								</strong>{" "} */}
                {contato.data.attributes.email} <br />
              </p>
            </div>
            <div className="mb-5">
              <h4 className="uppercase">Links Úteis</h4>
              <ul className="text-gray-300">
                {usefulLinks.map((link) => (
                  <li
                    key={link.name}
                    className="hover:text-amarelo-ouro uppercase"
                  >
                    <Link href={link?.link}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5">
              <h4 className="uppercase">Website</h4>
              <ul className="text-gray-300">
                {websites.map((link) => (
                  <li key={link.link} className="hover:text-amarelo-ouro">
                    <Link href={link?.link}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5">
              <h4 className="uppercase">Subscreva A Nossa NewsLetter</h4>
              <p className="text-gray-300 pb-2">
                {contato.data.attributes.newsletterTitle}
              </p>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-row flex-wrap"
              >
                <input
                  type="text"
                  className="text-amarelo-ouro w-2/3 p-2 focus:border-amarelo-ouro"
                  placeholder="email@pnp.cv"
                  {...register("email", { required: true })}
                />
                <button
                  type="submit"
                  className="p-2 w-1/3 bg-amarelo-ouro text-branco hover:bg-amarelo-escuro"
                >
                  Subscreva
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-amarelo-ouro text-branco px-10">
        <div className="max-w-7xl flex flex-col sm:flex-row py-4 mx-auto justify-between items-center">
          <div className="text-center">
            <div>
              PNP{"  "}
              <strong>
                <span>Copyright &copy; {year}</span>
              </strong>
              . Todos os direitos reservados
            </div>
          </div>
          <div className="text-center text-xl text-branco mb-2">
            {/* {rsocial.data.attributes.link.map(({ link, index }: any) => (
							<Link
								key={link.canal}
								href="https://www.facebook.com/PNPCaboVerde/"
								className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
								target="_blank"
							>
								<p dangerouslySetInnerHTML={{ __html: link.canal }}></p>
							</Link>
						))} */}
            <Link
              href="https://www.facebook.com/PNPCaboVerde/"
              className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
              target="_blank"
            >
              <IoLogoFacebook />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
              target="_blank"
            >
              <IoLogoInstagram />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
              target="_blank"
            >
              <IoLogoYoutube />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
              target="_blank"
            >
              <IoLogoTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
