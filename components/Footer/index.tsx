import Link from "next/link";
import Image from "next/image";
import logo from "public/logo1.png";

import {
	IoCallOutline,
	IoSendOutline,
	IoLogoFacebook,
	IoLogoInstagram,
	IoLogoYoutube,
	IoLogoTwitter,
} from "react-icons/io5";

const Footer = ({ rsocial, contato }: any) => {
	console.log("dados passado para o footer por layout");
	console.log(contato.data.attributes.Local);

	let usefulLinks = [
		{ name: "home", link: "/" },
		{ name: "About Us", link: "/" },
		{ name: "Terms of service", link: "/" },
		{ name: "Privacy policy", link: "/" },
	];

	let websites = [
		{ name: "HOME", link: "/" },
		{ name: "REGULAMENTOS", link: "/regulamentos" },
		{ name: "EDIÇÕES", link: "/edicoes" },
		{ name: "ARQUIVOS", link: "/arquivos" },
		{ name: "BLOG'S", link: "/posts" },
		{ name: "CONTATOS", link: "/contatos" },
	];

	// if (rsocial) {
	// 	rsocial.data.attributes.link.map((link: any) => {

	// 	});
	// }

	return (
		<footer>
			<div className="p-10 bg-preto text-amarelo-ouro">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
						<div className="md-5">
							<h4 className="text-2xl pb-4 uppercase">
								<Image src={logo} alt="logo" />
							</h4>
							<p className="text-gray-300">
								{contato.data.attributes.Local}
								<strong>{/* <IoCallOutline /> */}</strong>
								{/* (+238) 261 4915 / 9278968 */}
								{contato.data.attributes.phone}
								<br />
								{/* <strong>
									<IoSendOutline />
								</strong>{" "} */}
								{contato.data.attributes.email} <br />
							</p>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">Useful Links</h4>
							<ul className="text-gray-300">
								{usefulLinks.map((link) => (
									<li
										key={link.name}
										className="hover:text-amarelo-ouro uppercase"
									>
										<Link href={link.link}>{link.name}</Link>
									</li>
								))}
							</ul>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">Website</h4>
							<ul className="text-gray-300">
								{websites.map((link) => (
									<li key={link.link} className="hover:text-amarelo-ouro">
										<Link href={link.link}>{link.name}</Link>
									</li>
								))}
							</ul>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">Subscreva no NewsLetter</h4>
							<p className="text-gray-300 pb-2">
								{contato.data.attributes.newsletterTitle}
							</p>
							<form action="" className="flex flex-row flex-wrap">
								<input
									type="text"
									className="text-amarelo-ouro w-2/3 p-2 focus:border-amarelo-ouro"
									placeholder="email@exemplo.com"
								/>
								<button className="p-2 w-1/3 bg-amarelo-ouro text-branco hover:bg-amarelo-escuro">
									Subscreva
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full bg-amarelo-ouro text-branco px-10">
				<div className="max-w-7xl flex flex-col sm:flex-row py-4 mx-auto justify-between items-center">
					<div className="text-center">
						<div>
							PNP{"  "}
							<strong>
								<span>Copyright &copy; 2022</span>
							</strong>
							. Todos os direitos reservados
						</div>
					</div>
					<div className="text-center text-xl text-branco mb-2">
						{/* {rsocial.data.attributes.link.map(({ link, index }: any) => (
							<Link
								key={link.canal}
								href="https://www.facebook.com/PNPCaboVerde/"
								className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
								target="_blank"
							>
								<p dangerouslySetInnerHTML={{ __html: link.canal }}></p>
							</Link>
						))} */}
						<Link
							href="https://www.facebook.com/PNPCaboVerde/"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
							target="_blank"
						>
							<IoLogoFacebook />
						</Link>
						<Link
							href="#"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
							target="_blank"
						>
							<IoLogoInstagram />
						</Link>
						<Link
							href="#"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
							target="_blank"
						>
							<IoLogoYoutube />
						</Link>
						<Link
							href="#"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
							target="_blank"
						>
							<IoLogoTwitter />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
