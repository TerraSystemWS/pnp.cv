import { Timeline } from "flowbite-react";
import { HiCalendar } from "react-icons/hi";
import { Button } from "flowbite-react";
import { HiArrowNarrowRight } from "react-icons/hi";
import Layout from "../../components/Layout";
import { fetcher } from "../../lib/api";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Edicoes = ({ social, contato }: any) => {
	return (" "
		// <Layout rsocial={social} contato={contato}>
		// 	<Timeline>
		// 		<Timeline.Item>
		// 			<Timeline.Point icon={HiCalendar} />
		// 			<Timeline.Content>
		// 				<Timeline.Time>February 2022</Timeline.Time>
		// 				<Timeline.Title>Application UI code in Tailwind CSS</Timeline.Title>
		// 				<Timeline.Body>
		// 					Get access to over 20+ pages including a dashboard layout, charts,
		// 					kanban board, calendar, and pre-order E-commerce & Marketing
		// 					pages.
		// 				</Timeline.Body>
		// 				<Button color="gray">
		// 					Learn More
		// 					<HiArrowNarrowRight className="ml-2 h-3 w-3" />
		// 				</Button>
		// 			</Timeline.Content>
		// 		</Timeline.Item>
		// 		<Timeline.Item>
		// 			<Timeline.Point icon={HiCalendar} />
		// 			<Timeline.Content>
		// 				<Timeline.Time>March 2022</Timeline.Time>
		// 				<Timeline.Title>Marketing UI design in Figma</Timeline.Title>
		// 				<Timeline.Body>
		// 					All of the pages and components are first designed in Figma and we
		// 					keep a parity between the two versions even as we update the
		// 					project.
		// 				</Timeline.Body>
		// 			</Timeline.Content>
		// 		</Timeline.Item>
		// 		<Timeline.Item>
		// 			<Timeline.Point icon={HiCalendar} />
		// 			<Timeline.Content>
		// 				<Timeline.Time>April 2022</Timeline.Time>
		// 				<Timeline.Title>E-Commerce UI code in Tailwind CSS</Timeline.Title>
		// 				<Timeline.Body>
		// 					Get started with dozens of web components and interactive elements
		// 					built on top of Tailwind CSS.
		// 				</Timeline.Body>
		// 			</Timeline.Content>
		// 		</Timeline.Item>
		// 	</Timeline>
		// </Layout>
	);
};

export default Edicoes;

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);

	// GET: dados dos juris, categorias
	const edicao = await fetcher(`${api_link}/edicoes?populate=deep`);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, edicao } };
}
