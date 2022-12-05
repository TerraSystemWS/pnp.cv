import Head from "next/head";
import NavBar from "../Navbar";
import Footer from "../Footer";
// import Meta from "../Meta";
// import { UserProvider } from "../lib/user";
import React, { ReactNode } from "react";
import Meta from "../Meta";
interface Props {
	children?: ReactNode;
	rsocial: ReactNode;
	contato: ReactNode;
}

const Layout = ({ children, rsocial, contato }: Props) => (
	// <UserProvider value={{ user, loading }}>
	<div className="">
		<Head>
			<Meta />
		</Head>

		<header>
			<NavBar />{" "}
		</header>

		<div className="mt-28">{children}</div>

		<Footer rsocial={rsocial} contato={contato} />
	</div>
	// </UserProvider>
);

export default Layout;
