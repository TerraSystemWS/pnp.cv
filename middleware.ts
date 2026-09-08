import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const BYPASS_KEY = process.env.MAINTENANCE_BYPASS_KEY;
const BYPASS_COOKIE = "bypass_manutencao";

function isExempt(pathname: string) {
	return (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname === "/manutencao" ||
		/\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|json|txt|xml|woff2?)$/.test(pathname)
	);
}

export async function middleware(req: NextRequest) {
	const { pathname, searchParams } = req.nextUrl;

	if (isExempt(pathname)) {
		return NextResponse.next();
	}

	// Chave secreta em ?bypass=... grava um cookie que libera o acesso ao site
	// mesmo em manutenção (útil para a equipa conferir antes de reabrir ao público).
	if (BYPASS_KEY && searchParams.get("bypass") === BYPASS_KEY) {
		const res = NextResponse.next();
		res.cookies.set(BYPASS_COOKIE, "1", { maxAge: 60 * 60 * 24, path: "/" });
		return res;
	}
	if (req.cookies.get(BYPASS_COOKIE)) {
		return NextResponse.next();
	}

	try {
		const res = await fetch(`${STRAPI_URL}/api/manutencao`, {
			next: { revalidate: 30 },
		});
		if (res.ok) {
			const { data } = await res.json();
			if (data?.attributes?.ativo) {
				const url = req.nextUrl.clone();
				url.pathname = "/manutencao";
				url.searchParams.set("msg", data.attributes.mensagem ?? "");
				return NextResponse.rewrite(url);
			}
		}
	} catch {
		// Strapi indisponível ou endpoint ainda não criado: nunca travar o site por isso.
	}

	return NextResponse.next();
}

export const config = {
	matcher: "/:path*",
};
