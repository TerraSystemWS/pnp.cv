import Link from "next/link";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import logo from "public/logo1.png";
import {
	IoLogoFacebook,
	IoLogoInstagram,
	IoLogoYoutube,
	IoLogoTwitter,
} from "react-icons/io5";

interface Contact {
	Local: string;
	phone: string;
	email: string;
	newsletterTitle: string;
}

interface FooterProps {
	rsocial: any; // Define type for rsocial
	contato: {
		data: {
			attributes: Contact;
		};
	};
}

const Footer: React.FC<FooterProps> = ({ rsocial, contato }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ email: string }>();

	const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_STRAPI_URL}/newsletters`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ data }),
				}
			);

			if (res.ok) {
				toast.success("E-mail enviado com sucesso!");
			} else {
				toast.error("Erro no envio de email");
			}
		} catch (err) {
			console.error("Erro:", err);
		}
	};

	const usefulLinks = [
		{ name: "Sobre Nós", link: "/sobreus" },
		{ name: "Termos de Serviço", link: "/sobreus/terms" },
		{ name: "Política de Privacidade", link: "/sobreus/policy" },
	];

	const websites = [
		{ name: "HOME", link: "/" },
		{ name: "REGULAMENTOS", link: "/regulamentos" },
		{ name: "EDIÇÕES", link: "/edicoes" },
		{ name: "PARCEIROS", link: "/parceiros" },
		{ name: "BLOG", link: "/posts" },
		{ name: "CONTATOS", link: "/contatos" },
	];

	const d = new Date();
	const year = d.getFullYear();

	return (
		<footer>
			{/* @ts-ignore */}
			<Toaster position="bottom-right" reverseOrder={false} />
			<div className="p-10 bg-preto text-amarelo-ouro">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
						<div className="md-5">
							<h4 className="text-2xl pb-4 uppercase">
								{/* @ts-ignore */}
								<Image src={logo} alt="logo" />
							</h4>
							<p className="text-gray-300">
								{contato.data.attributes.Local}
								<br />
								{contato.data.attributes.phone}
								<br />
								{contato.data.attributes.email}
								<br />
							</p>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">Links Úteis</h4>
							<ul className="text-gray-300">
								{usefulLinks.map((link) => (
									<li
										key={link.name}
										className="hover:text-amarelo-ouro uppercase"
									>
										{/* @ts-ignore */}
										<Link href={link.link}>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">Website</h4>
							<ul className="text-gray-300">
								{websites.map((link) => (
									<li
										key={link.link}
										className="hover:text-amarelo-ouro"
									>
										<Link href={link.link}>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div className="mb-5">
							<h4 className="uppercase">
								Subscreva A Nossa NewsLetter
							</h4>
							<p className="text-gray-300 pb-2">
								{contato.data.attributes.newsletterTitle}
							</p>
							<form
								onSubmit={handleSubmit(onSubmit)}
								className="flex flex-row flex-wrap"
							>
								<input
									type="text"
									className="text-amarelo-ouro w-2/3 p-2 focus:border-amarelo-ouro"
									placeholder="email@pnp.cv"
									{...register("email", { required: true })}
								/>
								<button
									type="submit"
									className="p-2 w-1/3 bg-amarelo-ouro text-branco hover:bg-amarelo-escuro"
								>
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
							PNP <strong>Copyright &copy; {year}</strong>. Todos
							os direitos reservados
						</div>
					</div>
					<div className="text-center text-xl text-branco mb-2">
						{/* @ts-ignore */}
						<Link
							href="https://www.facebook.com/PNPCaboVerde/"
							target="_blank"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
						>
							{/* @ts-ignore */}
							<IoLogoFacebook />
						</Link>
						{/* @ts-ignore */}
						<Link
							href="#"
							target="_blank"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
						>
							{/* @ts-ignore */}
							<IoLogoInstagram />
						</Link>
						{/* @ts-ignore */}
						<Link
							href="#"
							target="_blank"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
						>
							{/* @ts-ignore */}
							<IoLogoYoutube />
						</Link>
						{/* @ts-ignore */}
						<Link
							href="#"
							target="_blank"
							className="w-10 h-10 rounded-full bg-preto hover:bg-amarelo-escuro mx-1 inline-block pt-1"
						>
							{/* @ts-ignore */}
							<IoLogoTwitter />
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
