import Router from "next/router";
import Cookies from "js-cookie";
import { apiClient } from "./api";

export const setToken = (data) => {
  if (!data) {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }
  Cookies.set("id", data.user?.id);
  Cookies.set("username", data.user?.username);
  Cookies.set("jwt", data.jwt);

  if (Cookies.get("username")) {
    Router.reload("/");
  }
};

export const unsetToken = () => {
  if (typeof window === "undefined") {
    return;
  }
  Cookies.remove("id");
  Cookies.remove("jwt");
  Cookies.remove("username");

  Router.reload("/");
};

export const getUserFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();
  if (!jwt) return;
  return apiClient
    .getWithAuth("/api/users/me", jwt)
    .then((data) => data.username)
    .catch((error) => console.error(error));
};

export const getIdFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();
  if (!jwt) return;
  return apiClient
    .getWithAuth("/api/users/me", jwt)
    .then((data) => data.id);
};

export const getUserNameById = async (userId) => {
  const jwt = getTokenFromLocalCookie();
  if (!jwt) throw new Error("Token Bearer não encontrado.");

  try {
    const data = await apiClient.getWithAuth(`/api/users/${userId}`, jwt);
    return data.data?.attributes?.username ?? null;
  } catch (error) {
    console.error("Erro na busca de nome do usuário:", error);
    return null;
  }
};


export const getTokenFromLocalCookie = () => {
  return Cookies.get("jwt");
};

export const getTokenFromServerCookie = (req) => {
  if (!req.headers.cookie || "") {
    return undefined;
  }
  const jwtCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith("jwt="));
  if (!jwtCookie) {
    return undefined;
  }
  const jwt = jwtCookie.split("=")[1];
  return jwt;
};

export const getIdFromServerCookie = (req) => {
  if (!req.headers.cookie || "") {
    return undefined;
  }
  const idCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith("id="));
  if (!idCookie) {
    return undefined;
  }
  const id = idCookie.split("=")[1];
  return id;
};
