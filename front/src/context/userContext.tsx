import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  roles: Array<{ name: string }>;
}

interface UserContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // // Effet pour sauvegarder l'utilisateur
  // useEffect(() => {
  //   if (user) {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   } else {
  //     localStorage.removeItem("user");
  //   }
  // }, [user]); // Dépend de user maintenant

  // // Effet pour sauvegarder le token
  // useEffect(() => {
  //   if (token) {
  //     localStorage.setItem("token", token);
  //   } else {
  //     localStorage.removeItem("token");
  //   }
  // }, [token]); // Dépend de token maintenant

  // Effet pour vérifier l'authentification
  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const response = await fetch("http://localhost:8000/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Si le token n'est pas valide, on déconnecte l'utilisateur
            logout();
          }
        } catch (error) {
          console.error("Erreur de vérification du token:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyAuth();
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{ user, token, setUser, setToken, logout, isAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
