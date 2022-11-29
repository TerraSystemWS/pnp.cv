import Link from "next/link";
import { Button, Modal } from "flowbite-react";
import React, { useState } from "react";

const Categorias = (props: any) => {
	const [openModal, setModal] = useState(false);
	const [openModal1, setModal1] = useState(false);
	const [openModal2, setModal2] = useState(false);
	const [openModal3, setModal3] = useState(false);
	const [openModal4, setModal4] = useState(false);
	const [openModal5, setModal5] = useState(false);
	const [openModal6, setModal6] = useState(false);
	const [openModal7, setModal7] = useState(false);

	const onClick = () => {
		setModal(!openModal);
		// setModal1(!openModal1);
		// setModal2(!openModal2);
		// setModal3(!openModal3);
		// setModal4(!openModal4);
		// setModal5(!openModal5);
		// setModal6(!openModal6);
		// setModal7(!openModal7);
	};
	const onClose = () => {
		setModal(!openModal);
		// setModal1(!openModal1);
		// setModal2(!openModal2);
		// setModal3(!openModal3);
		// setModal4(!openModal4);
		// setModal5(!openModal5);
		// setModal6(!openModal6);
		// setModal7(!openModal7);
	};

	return (
		<section className="text-gray-600 body-font">
			<div className="container px-5 py-24 mx-auto">
				<div className="text-center mb-20">
					<h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-amarelo-ouro mb-4">
						CATEGORIA DE PRÉMIOS
					</h1>
				</div>
				<div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
					{props.dados.map((value: any, index: any) => (
						<>
							<div
								key={index}
								onClick={onClick}
								className="p-2 sm:w-1/2 w-full"
							>
								<div className="bg-gray-100 rounded flex p-4 h-full items-center hover:scale-95 hover:-ml-5">
									<svg
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="3"
										className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
										viewBox="0 0 24 24"
									>
										<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
										<path d="M22 4L12 14.01l-3-3"></path>
									</svg>
									<span className="title-font font-medium">
										<Link href={`#${value.titulo}`}>{value.titulo}</Link>
									</span>
								</div>
							</div>
							<React.Fragment>
								{/* <Button onClick={onClick}>Toggle modal</Button> */}
								<Modal show={openModal} onClose={onClose}>
									<Modal.Header>{value.titulo}</Modal.Header>
									<Modal.Body>
										<div className="space-y-6">
											<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
												{value.descricao}
											</p>
										</div>
									</Modal.Body>
									<Modal.Footer>
										<Button
											color="gray"
											onClick={onClick}
											className="bg-amarelo-escuro text-white hover:text-amarelo-ouro"
										>
											OK
										</Button>
									</Modal.Footer>
								</Modal>
							</React.Fragment>
						</>
					))}
				</div>
			</div>
		</section>
	);
};

export default Categorias;
