import Head from "next/head"
import NavBar from "../Navbar"
import Footer from "../Footer"
// import Meta from "../Meta";
import { UserProvider } from "../../lib/authContext"
import React, { ReactNode } from "react"
import Meta from "../Meta"

interface Props {
  children?: ReactNode
  rsocial: ReactNode
  contato: any
  navbar: ReactNode
  user: ReactNode
  loading?: ReactNode
}

const Layout = ({
  user,
  loading = false,
  children,
  rsocial,
  contato,
  navbar,
}: Props) => (
  <UserProvider value={{ user, loading }}>
    <div className="">
      {/* @ts-ignore */}
      <Head>
        {/* @ts-ignore */}
        <Meta />
      </Head>

      <header>
        {/* @ts-ignore */}
        <NavBar navbar={navbar} />{" "}
      </header>

      <div className="mt-26">{children}</div>
      {/* @ts-ignore */}
      <Footer rsocial={rsocial} contato={contato} />
    </div>
  </UserProvider>
)

export default Layout
