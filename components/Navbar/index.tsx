import Image from "next/image";
import React, { useState } from "react";
import logo from "public/logo1.png";
import { IoGridOutline, IoClose } from "react-icons/io5";

const Nav = () => {
	let Links = [
		{ name: "HOME", link: "/" },
		{ name: "REGULAMENTOS", link: "/regulamentos" }, // aqui tem categorias, regulamentos e parceiros
		{ name: "EDIÇÕES", link: "/edicoes" }, // catalagos e gala
		{ name: "ARQUIVOS", link: "/archive" }, // Tem videos e galerias
		{ name: "BLOG'S", link: "/posts" }, // posts
		{ name: "CONTATOS", link: "/contatos" }, //
	];

	let [open, setOpen] = useState(false);

	return (
		<div className="shadow-md w-full fixed top-0 left-0">
			<div className="md:flex items-center justify-between bg-preto py-4 md:px-10 px-7">
				<div
					className="font-bold text-2xl cursor-pointer flex items-center font-[Poppins] 
      text-gray-800"
				>
					{/* <span className="text-3xl text-indigo-600 mr-1 pt-2">
						{/* <IonIcon name="logo-ionic"></IonIcon> 
					</span>
					Designer */}
					<Image src={logo} alt="logo"></Image>
				</div>

				<div
					onClick={() => setOpen(!open)}
					className="text-3xl absolute right-8 top-10 cursor-pointer md:hidden"
				>
					{/* <IonIcon icon={open ? "close" : "menu"}></IonIcon> */}
					{open ? <IoClose color="white" /> : <IoGridOutline color="white" />}
				</div>

				<ul
					className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-preto md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${
						open ? "top-20 " : "top-[-490px]"
					}`}
				>
					{Links.map((link) => (
						<li key={link.name} className="md:ml-8 text-xl md:my-0 my-7">
							<a
								href={link.link}
								className="text-branco hover:text-castanho-claro duration-500"
							>
								{link.name}
							</a>
						</li>
					))}
					<button
						className="bg-branco text-preto hover:text-branco font-[Poppins] py-2 px-6 rounded md:ml-8 hover:bg-castanho-claro 
    duration-500"
					>
						Entrar
					</button>
				</ul>
			</div>
		</div>
	);
};

export default Nav;
