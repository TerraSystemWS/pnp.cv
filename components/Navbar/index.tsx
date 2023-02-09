import Image from "next/image";
import React, { useState } from "react";
import logo from "public/logo1.png";
import { IoGridOutline, IoClose } from "react-icons/io5";
import Link from "next/link";
// import Link from 'next/link';
// import { useState } from 'react';

// libs para autenticaçao
import { fetcher } from "../../lib/api";
import { setToken, unsetToken } from "../../lib/auth";
import { useUser } from "../../lib/authContext";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";

// primereact tools
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

const Nav = (props: any) => {
  let Links = props.navbar;
  // [
  // 	{ name: "HOME", link: "/" },
  // 	{ name: "REGULAMENTOS", link: "/regulamentos" }, // aqui tem categorias, regulamentos e parceiros
  // 	{ name: "EDIÇÕES", link: "/edicoes" }, // catalagos e gala
  // 	{ name: "PARCEIROS", link: "/parceiros" }, // Tem videos e galerias
  // 	{ name: "BLOG", link: "/posts" }, // posts
  // 	{ name: "CONTATOS", link: "/contatos" }, //
  // ];

  const { user, loading } = useUser();

  console.log("===================== user ========================");
  console.log(user);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log("================ data ==============");
    // console.log(data);
    // make a post
    // return;
    // e.preventDefault();

    const responseData = await fetcher(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
      {
        //@ts-ignore
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: data.email,
          password: data.password,
        }),
      }
    );
    setToken(responseData);
    // console.log("=============== responseData ====================");
    // console.log(responseData);
  };

  console.log(watch("email")); // watch input value by passing the name of it

  let [open, setOpen] = useState(false);
  // console.log("dadoadosadaijdsjklsad");
  // console.log(props.navbar);
  // primereact usecases
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState("center");
  // forms
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
      {/* <Button
        label="Login"
        icon="pi pi-check"
        onClick={() => setVisible(false)}
        autoFocus
        className="p-button-warning"
      /> */}
    </div>
  );

  const show = (position: any) => {
    setPosition(position);
    setVisible(true);
  };

  // const OpenLoginDialog = () => {
  //   alert("teste");
  // };
  const logout = () => {
    unsetToken();
  };

  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-10">
      <div className="md:flex items-center justify-between bg-preto py-4 md:px-10 px-7">
        <div
          className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800"
        >
          {/* <span className="text-3xl text-indigo-600 mr-1 pt-2">
						{/* <IonIcon name="logo-ionic"></IonIcon> 
					</span>
					Designer */}
          <Link href={"/"}>
            <Image src={logo} alt="logo" />
          </Link>
        </div>

        <div
          onClick={() => setOpen(!open)}
          className="text-3xl absolute right-8 top-10 cursor-pointer md:hidden"
        >
          {/* <IonIcon icon={open ? "close" : "menu"}></IonIcon> */}
          {open ? <IoClose color="white" /> : <IoGridOutline color="white" />}
        </div>

        <ul
          className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-preto md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
            open ? "top-20 " : "top-[-490px]"
          }`}
        >
          {Links.map((link: any) => (
            <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
              <Link
                href={link.link}
                className="text-branco hover:text-amarelo-ouro duration-500"
              >
                {link.name}
              </Link>
            </li>
          ))}
          {!loading &&
            (user ? (
              <li className="md:ml-8 text-xl md:my-0 my-7">
                <Link
                  href="/profile"
                  className="text-branco hover:text-amarelo-ouro duration-500"
                >
                  Perfil[<span>{user}</span>]
                </Link>
              </li>
            ) : (
              ""
            ))}
          {!loading &&
            (user ? (
              <li>
                <a
                  // onClick={() => show("top")}
                  className="bg-preto outline outline-offset-2 outline-amarelo-ouro font-bold text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro 
                  duration-500"
                  onClick={logout}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </a>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => show("top")}
                  className="bg-amarelo-ouro font-bold text-branco hover:text-branco font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro 
						duration-500"
                >
                  Login
                </button>
                {/* <Button
              label="Login"
              icon="pi pi-arrow-down"
              onClick={() => show("top")}
              className="p-button-warning"
              style={{ minWidth: "1rem" }}
            /> */}

                <Dialog
                  header="Login"
                  visible={visible}
                  // @ts-ignore
                  position={position}
                  style={{ width: "30vw" }}
                  onHide={() => setVisible(false)}
                  footer={footerContent}
                  draggable={false}
                  resizable={false}
                >
                  <p className="m-0">
                    <form className="" onSubmit={handleSubmit(onSubmit)}>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@email.com"
                          {...register("email", { required: true })}
                        />
                        {errors.email && (
                          <span className="text-red-500">
                            O email é obrigatorio!
                          </span>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          placeholder="••••••••"
                          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          {...register("password", { required: true })}
                        />
                        {/* errors will return when field validation fails  */}
                        {errors.password && <span>password é obrigatorio</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="remember"
                              aria-describedby="remember"
                              type="checkbox"
                              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="remember"
                              className="text-gray-500 dark:text-gray-300"
                            >
                              Remember me
                            </label>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Esqueceu da senha?
                        </a>
                      </div>
                      <button
                        type="submit"
                        className="w-full text-white bg-amarelo-ouro hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      >
                        Login
                      </button>
                      <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        nao tem uma conta ainda?{" "}
                        <a
                          href="#"
                          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        >
                          Criar conta
                        </a>
                      </p>
                    </form>
                  </p>
                </Dialog>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Nav;
