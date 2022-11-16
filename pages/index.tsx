import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Layout from "../components/Layout";
import logo from "public/logo1.png";
import { fetcher } from "../lib/api";

export default function Home({ social, contato }: any) {
	console.log("dentu home ta ati pati rsocial");
	console.log(contato);

	// return
	return (
		<Layout rsocial={social} contato={contato}>
			<div>terra</div>
		</Layout>
	);
}

export async function getStaticProps() {
	const rsocials = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/redes-social?populate=*`
	);

	const contato = await fetcher(
		`${process.env.NEXT_PUBLIC_STRAPI_URL}/contato`
	);

	console.log(rsocials);

	return { props: { social: rsocials, contato } };
}
