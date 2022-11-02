/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		screens: {
			sm: "480px",
			md: "768px",
			lg: "976px",
			xl: "1440px",
		},
		extend: {
			colors: {
				"amarelo-ouro": "#c2a12b",
				castanho: "#2f270c",
				"castanho-claro": "#766119",
				"amarelo-escuro": "#8d741c",
				preto: "#000000",
				branco: "#FFFFFF",
			},
		},
	},
	plugins: [],
};
