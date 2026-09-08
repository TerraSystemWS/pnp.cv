import Head from "next/head";
import { GOLD, GOLD_DARK, INK, INK_SOFT, BG, FONT, FONT_IMPORT } from "../lib/theme";

const DEFAULT_MSG = "Estamos a fazer alguns ajustes no site. Voltamos em breve.";

const Manutencao = ({ mensagem }: { mensagem: string }) => {
	return (
		<>
			<Head>
				<title>Site em manutenção — Prémio Nacional de Publicidade</title>
				<style>{FONT_IMPORT}</style>
			</Head>
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: BG,
					fontFamily: FONT,
					padding: "2rem",
				}}
			>
				<div style={{ maxWidth: "440px", textAlign: "center" }}>
					<div
						style={{
							width: "56px",
							height: "56px",
							margin: "0 auto 1.5rem",
							borderRadius: "50%",
							border: `2px solid ${GOLD}`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "1.5rem",
							fontWeight: 700,
							color: GOLD_DARK,
						}}
					>
						!
					</div>
					<h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: INK, margin: "0 0 0.75rem" }}>
						Site em manutenção
					</h1>
					<p style={{ fontSize: "1rem", color: INK_SOFT, lineHeight: 1.6, margin: 0 }}>
						{mensagem || DEFAULT_MSG}
					</p>
				</div>
			</div>
		</>
	);
};

export async function getServerSideProps({ query }: any) {
	return {
		props: {
			mensagem: typeof query.msg === "string" ? query.msg : "",
		},
	};
}

export default Manutencao;
