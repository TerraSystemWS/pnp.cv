import Image from "next/image"
import React, { useState } from "react"
import logo from "public/logo1.png"
import { IoGridOutline, IoClose } from "react-icons/io5"
import Link from "next/link"
// import Link from 'next/link';
// import { useState } from 'react';

// libs para autenticaçao
import { fetcher } from "../../lib/api"
import { setToken, unsetToken } from "../../lib/auth"
import { useUser } from "../../lib/authContext"
import { Password } from "primereact/password"
import { InputText } from "primereact/inputtext"

// primereact tools
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import "primereact/resources/themes/lara-light-indigo/theme.css" //theme
import "primereact/resources/primereact.min.css" //core css
import "primeicons/primeicons.css" //icons

import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
  email: string
  password: string
}

const Nav = ({ navbar }: any) => {
  const { user, loading } = useUser()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // Tipo de 'position' agora é restrito a valores válidos
  const [position, setPosition] = useState<
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
  >("center")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: data.email,
            password: data.password,
          }),
        }
      )
      setToken(responseData)
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const logout = () => {
    unsetToken()
  }

  const footerContent = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setVisible(false)}
        className="p-button-text"
      />
    </div>
  )

  return (
    <div className="shadow-md w-full fixed top-0 left-0 z-10 bg-preto">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex items-center justify-between py-4 md:px-10 px-7">
          <div className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] text-gray-800">
            <Link href="/">
              <Image src={logo} alt="Logo" width={150} height={50} />
            </Link>
          </div>

          <div
            onClick={() => setOpen(!open)}
            className="text-3xl absolute right-8 top-10 cursor-pointer md:hidden"
          >
            {open ? <IoClose color="white" /> : <IoGridOutline color="white" />}
          </div>

          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-preto md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
              open ? "top-20" : "top-[-490px]"
            }`}
          >
            {navbar.map((link: any) => (
              <li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
                <Link
                  href={link.link}
                  className="text-branco hover:text-amarelo-ouro duration-500"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {!loading && user && (
              <li className="md:ml-8 text-xl md:my-0 my-7">
                <Link
                  href="/perfil"
                  className="text-branco hover:text-amarelo-ouro duration-500"
                >
                  [{user}]
                </Link>
              </li>
            )}
            {!loading && user ? (
              <li>
                <a
                  onClick={logout}
                  className="bg-preto outline outline-offset-2 outline-amarelo-ouro font-bold text-branco hover:text-branco py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro duration-500 cursor-pointer"
                >
                  Logout
                </a>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => setVisible(true)}
                  className="bg-amarelo-ouro font-bold text-branco hover:text-branco py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro duration-500"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
        {/* Login Dialog */}
        <Dialog
          header="Login"
          visible={visible}
          position={position}
          style={{ width: "30vw" }}
          onHide={() => setVisible(false)}
          footer={footerContent}
          draggable={false}
          resizable={false}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@email.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                {...register("email", { required: "Email é necessario" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                {...register("password", { required: "Password é necessario" })}
              />
              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full text-white bg-amarelo-ouro hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Login
            </button>
            <p className="text-sm font-light text-gray-500">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline"
              >
                Create one
              </a>
            </p>
          </form>
        </Dialog>
      </div>
    </div>
  )
}

export default Nav
