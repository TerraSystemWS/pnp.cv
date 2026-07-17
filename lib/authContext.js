import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalCookie, getUserRoleFromLocalCookie } from "../lib/auth";

// user e role têm de ser resolvidos e cacheados JUNTOS. Antes, só o "user"
// controlava se se voltava a ir buscar dados ao servidor (userState !==
// undefined). Numa navegação client-side (sem recarregar a página), isso
// fazia o "role" ficar preso a null para sempre depois da primeira página,
// mesmo com o "user" já correto — porque a app achava que "já tinha os
// dados" só por causa do user, sem o role alguma vez ter sido cacheado.
let cachedUser;
let cachedRole;
let hasResolved = false;

const User = createContext({ user: null, role: null, loading: false });

export const UserProvider = ({ value, children }) => (
  <User.Provider value={value}>{children}</User.Provider>
);

export const useUser = () => useContext(User);

export const useFetchUser = () => {
  const [data, setUser] = useState({
    user: hasResolved ? cachedUser : null,
    role: hasResolved ? cachedRole : null,
    loading: !hasResolved,
  });

  useEffect(() => {
    if (hasResolved) {
      return;
    }

    let isMounted = true;
    const resolveUser = async () => {
      const [user, role] = await Promise.all([
        getUserFromLocalCookie(),
        getUserRoleFromLocalCookie(),
      ]);
      cachedUser = user ?? null;
      cachedRole = role ?? null;
      hasResolved = true;
      if (isMounted) {
        setUser({ user: cachedUser, role: cachedRole, loading: false });
      }
    };
    resolveUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};
