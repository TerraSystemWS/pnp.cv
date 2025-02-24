import Router from "next/router";
import Cookies from "js-cookie";
import { fetcher } from "./api";

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
  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((data) => {
        return data.username;
      })
      .catch((error) => console.error(error));
  } else {
    return;
  }
};

export const getIdFromLocalCookie = () => {
  const jwt = getTokenFromLocalCookie();
  // console.log(jwt)
  // console.log(process.env.NEXT_PUBLIC_STRAPI_URL)
  if (jwt) {
    return fetcher(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((data) => {
      // console.log("getIdFromLocalCookie")
      // console.log(data.id)
      return data.id;
    });
  } else {
    // console.log("erro no getIdFromLocalCookie")
    return;
  }
};

// Função para pegar o nome do usuário com base no ID e token Bearer
export const getUserNameById = async (userId) => {
  const jwt = getTokenFromLocalCookie(); // Assume que esta função retorna o JWT do cookie

  if (!jwt) {
    throw new Error("Token Bearer não encontrado.");
  }

  try {
    // Fazendo a requisição para a API para pegar os dados do usuário pelo ID
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do usuário.");
    }

    // Extraindo os dados do usuário
    const data = await response.json();

    // Retornando o nome do usuário (ajuste conforme a estrutura de dados)
    return data.data.attributes.username; // Aqui você pode modificar conforme a estrutura do seu JSON
  } catch (error) {
    console.error("Erro na busca de nome do usuário:", error);
    return null;  // Retorna null caso algo dê errado
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
