import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";
import Link from "next/link";
import Head from "next/head";
import { Card} from "flowbite-react";
import { IoCall } from "react-icons/io5";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const VpublicaDetalhes = ({ social, contato, inscritos, navbar }: any) => {
    
    console.log(inscritos);
    return (
        <Layout rsocial={social} contato={contato} navbar={navbar}>
            <Head>
            <title>Votação Pública - Prémio Nacional De Publicidade</title>
            </Head>
            <div>
            
            </div>
        </Layout>
    )
}

export default VpublicaDetalhes

// This gets called on every request
export async function getServerSideProps({ params, query }: any) {
	// Fetch data from external API
    // console.log(query)
    const {id} = query

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);
	// GET: dados do navbar
	const navbar = await fetcher(`${api_link}/menus?populate=deep`);
    // GET: dados dos projetos inscritos
    const inscritos = await fetcher(`${api_link}/inscricoes/${id}`)
	//get links for menu
	let dlink: any = [];
	navbar.data.map((value: any) => {
		value.attributes.items.data.map((value: any, index: any) => {
			// value.attributes.title;
			// value.attributes.url;
			// console.log(value);
			dlink[index] = {
				name: value.attributes.title,
				link: value.attributes.url,
			};
		});
	});
	 console.log(inscritos);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, navbar: dlink, inscritos } };
}