import React, { createContext, useContext } from "react";

export interface AuthContextValue {
  user: any | null;
  userId: string | null;
  username: string | null;
  email: string | null;
  setUser: (user: any | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthContext.Provider");
  }
  return ctx;
};

export default AuthContext;
