import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../api/auth";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  login: (
    token: string,
    user: User
  ) => void;

  logout: () => void;
}

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] =
    useState<User | null>(
      null
    );

  const [token, setToken] =
    useState<string | null>(
      localStorage.getItem(
        "token"
      )
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const getCurrentUser =
      async () => {
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/auth/me`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Invalid token."
            );
          }

          setUser(data.user);
        } catch (error) {
          console.error(
            "Authentication check failed:",
            error
          );

          localStorage.removeItem(
            "token"
          );

          setToken(null);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

    getCurrentUser();
  }, [token]);

  const login = (
    newToken: string,
    newUser: User
  ) => {
    localStorage.setItem(
      "token",
      newToken
    );

    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated:
          !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(
      AuthContext
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider."
    );
  }

  return context;
};