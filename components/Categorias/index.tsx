import Link from "next/link";

const Categorias = (props: any) => {
	return (
		<section className="text-gray-600 body-font">
			<div className="container px-5 py-24 mx-auto">
				<div className="text-center mb-20">
					<h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-amarelo-ouro mb-4">
						CATEGORIA DOS PRÉMIOS
					</h1>
					<p className="text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
						O Prémio Público de Publicidade é uma das categorias do Prémio
						Naccional de Publicidade (PNP) em que a votação é feita somente pelo
						público, através da internet. Trata-se de um prémio da
						responsabilidade do PNP, com regulamento próprio, sem avaliaçaõ do
						júri, baseado apenas no critério de popularidade.
					</p>
					<h2 className="text-lg font-semibold leading-8 text-amarelo-escuro">
						<Link href="#">Link ativo somente no peíodo de votação</Link>
					</h2>
				</div>
				<div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
					{props.dados.map((value: any, index: any) => (
						<div key={index} className="p-2 sm:w-1/2 w-full">
							<div className="bg-gray-100 rounded flex p-4 h-full items-center">
								<svg
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="3"
									className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4"
									viewBox="0 0 24 24"
								>
									<path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
									<path d="M22 4L12 14.01l-3-3"></path>
								</svg>
								<span className="title-font font-medium">
									<Link href="#">{value.titulo}</Link>
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Categorias;