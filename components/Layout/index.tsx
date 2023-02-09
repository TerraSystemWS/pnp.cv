import Head from "next/head";
import NavBar from "../Navbar";
import Footer from "../Footer";
// import Meta from "../Meta";
import { UserProvider } from "../../lib/authContext";
import React, { ReactNode } from "react";
import Meta from "../Meta";

interface Props {
  children?: ReactNode;
  rsocial: ReactNode;
  contato: ReactNode;
  navbar: ReactNode;
  user: ReactNode;
  loading?: ReactNode;
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
      <Head>
        <Meta />
      </Head>

      <header>
        <NavBar navbar={navbar} />{" "}
      </header>

      <div className="mt-28">{children}</div>

      <Footer rsocial={rsocial} contato={contato} navbar={navbar} />
    </div>
  </UserProvider>
);

export default Layout;
