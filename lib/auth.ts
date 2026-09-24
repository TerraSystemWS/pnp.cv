import Router from "next/router"
import Cookies from "js-cookie"
import { IncomingMessage } from "http"
import { apiClient } from "./api"

interface TokenData {
  jwt: string
  user?: { id: string; username: string }
}

export const setToken = (data: TokenData | null): void => {
  if (!data || typeof window === "undefined") return
  Cookies.set("id", data.user?.id ?? "")
  Cookies.set("username", data.user?.username ?? "")
  Cookies.set("jwt", data.jwt)
  if (Cookies.get("username")) Router.reload()
}

export const unsetToken = (): void => {
  if (typeof window === "undefined") return
  Cookies.remove("id")
  Cookies.remove("jwt")
  Cookies.remove("username")
  Router.reload()
}

// Nome a mostrar: contas públicas têm `nome` (o username é o próprio email);
// contas antigas de júri só têm username.
export const getUserFromLocalCookie = (): Promise<string | undefined> | undefined => {
  const jwt = getTokenFromLocalCookie()
  if (!jwt) return
  return apiClient
    .getWithAuth("/api/users/me", jwt)
    .then((data: { username: string; nome?: string }) => data.nome || data.username)
    .catch((error: unknown) => { console.error(error); return undefined })
}

export const getUserRoleFromLocalCookie = (): Promise<string | undefined> | undefined => {
  const jwt = getTokenFromLocalCookie()
  if (!jwt) return
  return apiClient
    .getWithAuth("/api/users/me?populate=role", jwt)
    .then((data: { role?: { type: string } }) => data.role?.type)
    .catch((error: unknown) => { console.error(error); return undefined })
}

export const getIdFromLocalCookie = (): Promise<string | undefined> | undefined => {
  const jwt = getTokenFromLocalCookie()
  if (!jwt) return
  return apiClient
    .getWithAuth("/api/users/me", jwt)
    .then((data: { id: string }) => data.id)
}

export const getUserNameById = async (userId: string): Promise<string | null> => {
  const jwt = getTokenFromLocalCookie()
  if (!jwt) throw new Error("Token Bearer não encontrado.")

  try {
    const data = await apiClient.getWithAuth(`/api/users/${userId}`, jwt)
    return data.data?.attributes?.username ?? null
  } catch (error) {
    console.error("Erro na busca de nome do usuário:", error)
    return null
  }
}

export const getTokenFromLocalCookie = (): string | undefined => {
  return Cookies.get("jwt")
}

export const getTokenFromServerCookie = (req: IncomingMessage): string | undefined => {
  if (!req.headers.cookie) return undefined
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith("jwt="))
  if (!jwtCookie) return undefined
  return jwtCookie.split("=")[1]
}

export const getIdFromServerCookie = (req: IncomingMessage): string | undefined => {
  if (!req.headers.cookie) return undefined
  const idCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith("id="))
  if (!idCookie) return undefined
  return idCookie.split("=")[1]
}

// Abre o diálogo de login da Navbar a partir de qualquer página
// (ex: "Entrar para votar", "Entrar para se candidatar").
export const OPEN_LOGIN_EVENT = "pnp:open-login"

export const openLogin = (): void => {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(OPEN_LOGIN_EVENT))
}
