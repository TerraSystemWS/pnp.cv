import Head from "next/head";
import NavBar from "../Navbar";
import Footer from "../Footer";
// import Meta from "../Meta";
// import { UserProvider } from "../lib/user";
import React, { ReactNode } from "react";

interface Props {
	children?: ReactNode;
}

const Layout = ({ children }: Props) => (
	// <UserProvider value={{ user, loading }}>
	<div className="">
		{/* <Head>
			<Meta />
		</Head> */}

		<header>
			<NavBar />{" "}
		</header>

		<div className="mt-28">{children}</div>

		<Footer />
	</div>
	// </UserProvider>
);

export default Layout;
