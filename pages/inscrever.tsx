/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import Layout from "../components/Layout";
import { fetcher } from "../lib/api";
const qs = require("qs");
import Head from "next/head";

// link para a url do api
const api_link = process.env.NEXT_PUBLIC_STRAPI_URL;

const Inscrever = ({ social, contato, edicao, navbar }: any) => {
	// dados de categorias
	let Categoria: any = [];
	// create cateoria lists
	edicao.data?.attributes.categoria.map((categs: any, index: any) => {
		Categoria[index] = {
			id: index,
			titulo: categs.titulo,
			slug: categs.titulo.replace(/ /g, "_"),
			descricao: categs.descricao,
		};
	});

	return (
		<Layout rsocial={social} contato={contato} navbar={navbar}>
			<Head>
				<title>Inscrição - Prémio Nacional De Publicidade</title>
			</Head>
			<div className="">
				<div className="bg-gray-50">
					<div className="mx-auto max-w-7xl py-12 px-4 sm:px-6">
						<h2 className="text-2xl text-center mb-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
							<span className="block text-amarelo-ouro">
								PRÉMIO NACIONAL DE PUBLICIDADE
							</span>
							{/* <span className="block ">
								Inscrição aberta apartir do dia 1 a 31 de Janero 2023
							</span> */}
						</h2>
					</div>
				</div>
			</div>
			<div className="p-11">
				<div className="mt-10 sm:mt-0">
					<div className="md:grid md:grid-cols-3 md:gap-6">
						<div className="md:col-span-1">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									FICHA DE INSCRIÇÃO
								</h3>
								<p className="mt-1 text-sm text-gray-600">
									Concurso ao Prémio Nacional de Publicidade
								</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							<form action="#" method="POST">
								<div className="overflow-hidden shadow sm:rounded-md">
									<div className="bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-6 gap-6">
											<div className="col-span-6 sm:col-span-3">
												<label
													htmlFor="fname"
													className="block text-sm font-medium text-gray-700"
												>
													Nome Completo (Empresa ou candidato individual)
												</label>
												<input
													type="text"
													name="fname"
													id="first-name"
													autoComplete="given-name"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>

											<div className="col-span-6 sm:col-span-3">
												<label
													htmlFor="nif"
													className="block text-sm font-medium text-gray-700"
												>
													NIF
												</label>
												<input
													type="Number"
													name="nif"
													id="last-name"
													autoComplete="000 000 000"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>

											<div className="col-span-6 sm:col-span-4">
												<label
													htmlFor="email"
													className="block text-sm font-medium text-gray-700"
												>
													Email
												</label>
												<input
													type="text"
													name="email"
													id="email-address"
													autoComplete="email"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>

											{/* <div className="col-span-6 sm:col-span-3">
												<label
													htmlFor="country"
													className="block text-sm font-medium text-gray-700"
												>
													Country
												</label>
												<select
													id="country"
													name="country"
													autoComplete="country-name"
													className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
												>
													<option>United States</option>
													<option>Canada</option>
													<option>Mexico</option>
												</select>
											</div> */}

											<div className="col-span-6">
												<label
													htmlFor="street-address"
													className="block text-sm font-medium text-gray-700"
												>
													Sede ou Local de Residência
												</label>
												<input
													type="text"
													name="street-address"
													id="street-address"
													autoComplete="street-address"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>

											{/* <div className="col-span-6 sm:col-span-6 lg:col-span-2">
												<label
													htmlFor="city"
													className="block text-sm font-medium text-gray-700"
												>
													City
												</label>
												<input
													type="text"
													name="city"
													id="city"
													autoComplete="address-level2"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div> */}

											{/* <div className="col-span-6 sm:col-span-3 lg:col-span-2">
												<label
													htmlFor="region"
													className="block text-sm font-medium text-gray-700"
												>
													State / Province
												</label>
												<input
													type="text"
													name="region"
													id="region"
													autoComplete="address-level1"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div> */}

											<div className="col-span-6 sm:col-span-3 lg:col-span-2">
												<label
													htmlFor="phone"
													className="block text-sm font-medium text-gray-700"
												>
													Telefone
												</label>
												<input
													type="number"
													name="phone"
													id="phone-code"
													autoComplete="postal-code"
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
												/>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Guardar
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="hidden sm:block" aria-hidden="true">
					<div className="py-5">
						<div className="border-t border-gray-200" />
					</div>
				</div>

				<div>
					<div className="md:grid md:grid-cols-3 md:gap-6">
						<div className="md:col-span-1">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									FICHA TÉCNICA
								</h3>
								<p className="mt-1 text-sm text-gray-600">
									Especifica quais as categorias a concorrer e detalhes sobre o
									projeto
								</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							<form action="#" method="POST">
								<div className="shadow sm:overflow-hidden sm:rounded-md">
									<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
										<div className="grid grid-cols-3 gap-6">
											<div className="col-span-3 sm:col-span-2">
												<label
													htmlFor="countries"
													className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
												>
													Categoria de Prémio a que concorre
												</label>
												<select
													multiple
													id="countries"
													className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
												>
													<option key={0} selected>
														Escolha uma Categoria
													</option>
													{Categoria.map((value: any, index: number) => (
														<option key={index + 1}>{value.titulo}</option>
													))}
												</select>
											</div>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="proj_nome"
												className="block text-sm font-medium text-gray-700"
											>
												Nome do Projeto
											</label>
											<input
												type="text"
												name="proj_nome"
												id="proj_nome"
												autoComplete="nome projecto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div>
											<label
												htmlFor="about"
												className="block text-sm font-medium text-gray-700"
											>
												Conceito Criativo
											</label>
											<div className="mt-1">
												<textarea
													id="about"
													name="c_criativo"
													rows={3}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													placeholder="descreva seu projeto"
													defaultValue={""}
												/>
											</div>
											<p className="mt-2 text-sm text-gray-500">
												Breve descrição sobre seu projeto e outros observações
											</p>
										</div>

										{/* <div>
											<label className="block text-sm font-medium text-gray-700">
												Photo
											</label>
											<div className="mt-1 flex items-center">
												<span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
													<svg
														className="h-full w-full text-gray-300"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg>
												</span>
												<button
													type="button"
													className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
												>
													Change
												</button>
											</div>
										</div> */}

										{/* <div>
											<label className="block text-sm font-medium text-gray-700">
												Cover photo
											</label>
											<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
												<div className="space-y-1 text-center">
													<svg
														className="mx-auto h-12 w-12 text-gray-400"
														stroke="currentColor"
														fill="none"
														viewBox="0 0 48 48"
														aria-hidden="true"
													>
														<path
															d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
															strokeWidth={2}
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													<div className="flex text-sm text-gray-600">
														<label
															htmlFor="file-upload"
															className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
														>
															<span>Upload a file</span>
															<input
																id="file-upload"
																name="file-upload"
																type="file"
																className="sr-only"
															/>
														</label>
														<p className="pl-1">or drag and drop</p>
													</div>
													<p className="text-xs text-gray-500">
														PNG, JPG, GIF up to 10MB
													</p>
												</div>
											</div>
										</div> */}
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Guardar
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="hidden sm:block" aria-hidden="true">
					<div className="py-5">
						<div className="border-t border-gray-200" />
					</div>
				</div>

				<div>
					<div className="md:grid md:grid-cols-3 md:gap-6">
						<div className="md:col-span-1">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									Equipa do Projeto
								</h3>
								<p className="mt-1 text-sm text-gray-600">
									Informações sobre as equipas e colaboradores do projeto
								</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							<form action="#" method="POST">
								<div className="shadow sm:overflow-hidden sm:rounded-md">
									<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Coodernador / Produtor
											</label>
											<input
												type="text"
												name="coo_prod"
												id="coo_prod"
												autoComplete="Coodernador / Produtor"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Diretor de Fotografia
											</label>
											<input
												type="text"
												name="d_foto"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Diretor de Arte
											</label>
											<input
												type="text"
												name="d_foto"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Realizador
											</label>
											<input
												type="text"
												name="d_foto"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Autoria do Jingle
											</label>
											<input
												type="text"
												name="d_foto"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Designer
											</label>
											<input
												type="text"
												name="d_foto"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div>
											<label
												htmlFor="about"
												className="block text-sm font-medium text-gray-700"
											>
												Outro (considerações adicionais)
											</label>
											<div className="mt-1">
												<textarea
													id="outros"
													name="outro"
													rows={3}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
													placeholder="descreva seu projeto"
													defaultValue={""}
												/>
											</div>
											{/* <p className="mt-2 text-sm text-gray-500">
												algumas considerações adicionais
											</p> */}
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Data da sua produção
											</label>
											<input
												type="date"
												name="data_pro"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Data da divulgação
											</label>
											<input
												type="date"
												name="data_pro"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>

										<div className="col-span-6 sm:col-span-4">
											<label
												htmlFor="coo_prod"
												className="block text-sm font-medium text-gray-700"
											>
												Data da sua apresentação pública (se trabalho
												universitário)
											</label>
											<input
												type="date"
												name="data_pro"
												id="d_foto"
												autoComplete="d_foto"
												className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
											/>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Guardar
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>

				<div className="hidden sm:block" aria-hidden="true">
					<div className="py-5">
						<div className="border-t border-gray-200" />
					</div>
				</div>

				<div className="mt-10 sm:mt-0">
					<div className="md:grid md:grid-cols-3 md:gap-6">
						<div className="md:col-span-1">
							<div className="px-4 sm:px-0">
								<h3 className="text-lg font-medium leading-6 text-gray-900">
									OBS:.
								</h3>
								<p className="mt-1 text-sm text-gray-600">
									<p className="mb-2">
										<span className="text-red-500 font-bold text-lg">*</span> É
										necessário o envio da cópia do estatuto da empresa e do NIF;
									</p>
									{/* <br /> */}
									<p className="mb-2">
										<span className="text-red-500 font-bold text-lg">*</span>{" "}
										Bilhete de identidade e NIF, se for candidatura individual;
									</p>
									{/* <br /> */}
									<p className="mb-2">
										<span className="text-red-500 font-bold text-lg">*</span>{" "}
										Bilhete de identidade, NIF e certificado de matrícula, se
										for estudante universitário;
									</p>
									{/* <br /> */}
									<p className="mb-2">
										<span className="text-red-500 font-bold text-lg">*</span>
										Comprovativo de pagamento e ficha técnica do trabalho que
										apresenta a concurso.
									</p>
								</p>
							</div>
						</div>
						<div className="mt-5 md:col-span-2 md:mt-0">
							{/* <form action="#" method="POST">
								<div className="overflow-hidden shadow sm:rounded-md">
									<div className="space-y-6 bg-white px-4 py-5 sm:p-6">
										<fieldset>
											<legend className="sr-only">By Email</legend>
											<div
												className="text-base font-medium text-gray-900"
												aria-hidden="true"
											>
												By Email
											</div>
											<div className="mt-4 space-y-4">
												<div className="flex items-start">
													<div className="flex h-5 items-center">
														<input
															id="comments"
															name="comments"
															type="checkbox"
															className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
													</div>
													<div className="ml-3 text-sm">
														<label
															htmlFor="comments"
															className="font-medium text-gray-700"
														>
															Comments
														</label>
														<p className="text-gray-500">
															Get notified when someones posts a comment on a
															posting.
														</p>
													</div>
												</div>
												<div className="flex items-start">
													<div className="flex h-5 items-center">
														<input
															id="candidates"
															name="candidates"
															type="checkbox"
															className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
													</div>
													<div className="ml-3 text-sm">
														<label
															htmlFor="candidates"
															className="font-medium text-gray-700"
														>
															Candidates
														</label>
														<p className="text-gray-500">
															Get notified when a candidate applies for a job.
														</p>
													</div>
												</div>
												<div className="flex items-start">
													<div className="flex h-5 items-center">
														<input
															id="offers"
															name="offers"
															type="checkbox"
															className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
														/>
													</div>
													<div className="ml-3 text-sm">
														<label
															htmlFor="offers"
															className="font-medium text-gray-700"
														>
															Offers
														</label>
														<p className="text-gray-500">
															Get notified when a candidate accepts or rejects
															an offer.
														</p>
													</div>
												</div>
											</div>
										</fieldset>
										<fieldset>
											<legend className="contents text-base font-medium text-gray-900">
												Push Notifications
											</legend>
											<p className="text-sm text-gray-500">
												These are delivered via SMS to your mobile phone.
											</p>
											<div className="mt-4 space-y-4">
												<div className="flex items-center">
													<input
														id="push-everything"
														name="push-notifications"
														type="radio"
														className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
													/>
													<label
														htmlFor="push-everything"
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														Everything
													</label>
												</div>
												<div className="flex items-center">
													<input
														id="push-email"
														name="push-notifications"
														type="radio"
														className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
													/>
													<label
														htmlFor="push-email"
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														Same as email
													</label>
												</div>
												<div className="flex items-center">
													<input
														id="push-nothing"
														name="push-notifications"
														type="radio"
														className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
													/>
													<label
														htmlFor="push-nothing"
														className="ml-3 block text-sm font-medium text-gray-700"
													>
														No push notifications
													</label>
												</div>
											</div>
										</fieldset>
									</div>
									<div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
										<button
											type="submit"
											className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											Guardar
										</button>
									</div>
								</div>
							</form> */}

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Documentos
								</label>
								<div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
									<div className="space-y-1 text-center">
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											stroke="currentColor"
											fill="none"
											viewBox="0 0 48 48"
											aria-hidden="true"
										>
											<path
												d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<div className="flex text-sm text-gray-600">
											<label
												htmlFor="file-upload"
												className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
											>
												<span>Upload dos Ficheiros</span>
												<input
													id="file-upload"
													name="file-upload"
													type="file"
													className="sr-only"
												/>
											</label>
											<p className="pl-1">ou arraste e solte</p>
										</div>
										<p className="text-xs text-gray-500">
											PNG, JPG, GIF up to 20MB
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Inscrever;

// This gets called on every request
export async function getServerSideProps() {
	// Fetch data from external API

	const query = qs.stringify(
		{
			sort: ["N_Edicao:asc"],
		},
		{
			encodeValuesOnly: true, // prettify URL
		}
	);

	// GET: links para as redes sociais
	const rsocials = await fetcher(`${api_link}/redes-social?populate=*`);
	// GET: dados para contatos
	const contato = await fetcher(`${api_link}/contato`);
	// GET: dados para banners
	// const banners = await fetcher(`${api_link}/banners?populate=deep`);
	// GET: dados dos juris, categorias
	/**
	 * tem que muda keli urgenti
	 */
	const edicao = await fetcher(`${api_link}/edicoes/1?populate=deep&${query}`);
	// GET: dados dos parceiros
	// const parceiros = await fetcher(`${api_link}/parceiros?populate=deep`);
	// GET: dados do navbar
	const navbar = await fetcher(`${api_link}/menus?populate=deep`);
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

	// console.log("edicoesTT");
	// console.log(edicao);

	// Pass data to the page via props
	return { props: { social: rsocials, contato, edicao, navbar: dlink } };
}
