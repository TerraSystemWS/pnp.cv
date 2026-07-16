import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalCookie, getUserRoleFromLocalCookie } from "../lib/auth";

let userState;
let roleState;

const User = createContext({ user: null, role: null, loading: false });

export const UserProvider = ({ value, children }) => {
  const { user, role } = value;

  useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
    if (!roleState && role) {
      roleState = role;
    }
  }, [user, role]);

  return <User.Provider value={value}>{children}</User.Provider>;
};

export const useUser = () => useContext(User);

export const useFetchUser = () => {
  const [data, setUser] = useState({
    user: userState || null,
    role: roleState || null,
    loading: userState === undefined,
  });

  useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;
    const resolveUser = async () => {
      const [user, role] = await Promise.all([
        getUserFromLocalCookie(),
        getUserRoleFromLocalCookie(),
      ]);
      if (isMounted) {
        setUser({ user, role: role ?? null, loading: false });
      }
    };
    resolveUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};
