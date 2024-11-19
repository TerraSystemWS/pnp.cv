// pages/index.tsx

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

interface FormValues {
	criteria1: string;
}

const Home = () => {
	const { register, handleSubmit, watch } = useForm<FormValues>();
	const [result, setResult] = useState<string>("");

	// Mapeamento dos números para palavras, cores e classes
	const numberToWord: Record<number, string> = {
		1: "Insuficiente",
		2: "Insuficiente",
		3: "Suficiente",
		4: "Bom",
		5: "Excelente",
	};

	const numberToText: Record<number, string> = {
		1: "Nota 1: Insuficiente - A resposta é considerada insatisfatória e não atende aos requisitos mínimos.",
		2: "Nota 2: Insuficiente - A resposta ainda não é adequada, mas mostra algum entendimento básico.",
		3: "Nota 3: Suficiente - A resposta atende aos requisitos mínimos e mostra uma compreensão adequada.",
		4: "Nota 4: Bom - A resposta é boa e demonstra uma compreensão sólida com poucos erros.",
		5: "Nota 5: Excelente - A resposta é excelente e demonstra uma compreensão profunda e completa.",
	};

	const numberToColor: Record<number, string> = {
		1: "bg-red-400",
		2: "bg-red-400",
		3: "bg-yellow-400",
		4: "bg-blue-400",
		5: "bg-green-400",
	};

	// Obtenha o valor selecionado em tempo real
	const selectedValue = watch("criteria1");

	const onSubmit: SubmitHandler<FormValues> = (data) => {
		const value = parseInt(data.criteria1);
		const colorClass = numberToColor[value];
		const resultText = `<span class="${colorClass} text-white p-2 rounded">${numberToWord[value]}</span>`;
		setResult(resultText);
	};

	return (
		<div className=" mx-auto p-6 bg-white shadow-md rounded-lg">
			<h1 className="text-2xl font-bold mb-6 text-center">
				Avaliação de Prémios
			</h1>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div>
					<label
						htmlFor="criteria1"
						className="block text-lg font-medium mb-2"
					>
						Critério 1
					</label>
					<div className="flex space-x-4">
						{[1, 2, 3, 4, 5].map((value) => (
							<label
								key={value}
								className="flex items-center space-x-2"
							>
								<input
									type="radio"
									id={`c1-${value}`}
									value={value}
									{...register("criteria1")}
									className="hidden"
								/>
								<span
									className={`cursor-pointer text-2xl w-12 h-12 flex items-center justify-center text-white font-bold rounded-full ${
										numberToColor[value]
									} ${
										parseInt(selectedValue || "0") === value
											? "ring-4 ring-black"
											: ""
									}`}
									onClick={() =>
										setResult(
											`<span class="${numberToColor[value]} text-white p-2 rounded">${numberToWord[value]}</span>`
										)
									}
								>
									{value}
								</span>
							</label>
						))}
					</div>
				</div>
				<button
					type="submit"
					className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
				>
					Enviar Avaliação
				</button>
			</form>
			{result && (
				<div className="mt-6 text-center">
					<p dangerouslySetInnerHTML={{ __html: result }} />
					{selectedValue && (
						<div className="mt-6 text-center text-lg">
							<p>{numberToText[parseInt(selectedValue)]}</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Home;
