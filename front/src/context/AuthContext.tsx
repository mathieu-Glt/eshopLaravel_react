import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const location = useLocation();
    const [user, setUser] = useState<User | null>(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : null;
    });
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem("token")
    );
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        return !!(storedToken && storedUser);
    });

    useEffect(() => {
        console.log("AuthContext - Token:", token);
        console.log("AuthContext - User:", user);
        if (token && user) {
            setIsAuthenticated(true);
            console.log("AuthContext - Setting isAuthenticated to true");
        } else {
            setIsAuthenticated(false);
            console.log("AuthContext - Setting isAuthenticated to false");
        }
    }, [token, user]);

    const login = (token: string, userData: User) => {
        console.log("AuthContext - Login called with:", { token, userData });
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.log("AuthContext - Logout called");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{ user, token, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
