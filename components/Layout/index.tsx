import Head from "next/head"
import NavBar from "../Navbar"
import Footer from "../Footer"
import Meta from "../Meta"
import RouteProgress from "../RouteProgress"
import { UserProvider } from "../../lib/authContext"
import React, { ReactNode } from "react"

interface Props {
  children?: ReactNode
  rsocial: any
  contato: any
  navbar: any
  user: any
  loading?: any
}

const Layout = ({
  user,
  loading = false,
  children,
  rsocial,
  contato,
  navbar,
}: Props) => {
  return (
    <UserProvider value={{ user, loading }}>
      <div className="">
        <Head>
          <Meta />
        </Head>

        <RouteProgress />

        <header>
          <NavBar navbar={navbar} />
        </header>

        <div style={{ marginTop: "69px" }}>{children}</div>

        <Footer rsocial={rsocial} contato={contato} />
      </div>
    </UserProvider>
  )
}

export default Layout
