import Head from "next/head"
import NavBar from "../Navbar"
import Footer from "../Footer"
import Meta from "../Meta"
import { UserProvider } from "../../lib/authContext"
import React, { useState, useEffect, ReactNode } from "react"
import LoadingSpinner from "../LoadingSpinner"

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
}: Props) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simula um carregamento de dados
    setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Atraso de 3 segundos para simular o carregamento
  }, [])

  return (
    <UserProvider value={{ user, loading }}>
      <div className="">
        <Head>
          <Meta />
        </Head>

        <header>
          <NavBar navbar={navbar} />
        </header>

        {isLoading ? (
          // Exibe o spinner enquanto a página está carregando
          <LoadingSpinner />
        ) : (
          // Exibe o conteúdo real depois que o carregamento termina
          <div style={{ marginTop: "5.88rem" }}>{children}</div>
        )}

        <Footer rsocial={rsocial} contato={contato} />
      </div>
    </UserProvider>
  )
}

export default Layout
