import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
// import { useUser } from "../context/userContext";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    console.log("isAdmin", isAdmin);
    console.log("user", user);
    console.log("isAuthenticated", isAuthenticated);
    console.log("navigate", navigate);

    useEffect(() => {
        if (user) {
            console.log("User data:", user);
            const hasAdminRole = user.roles?.some(
                (role: any) => role.name === "admin"
            );
            setIsAdmin(hasAdminRole);
        } else {
            const user = localStorage.getItem("user");
            if (user) {
                const userData = JSON.parse(user);
                if (userData.roles[0]?.name === "admin") {
                    setIsAdmin(true);
                    navigate("/admin");
                } else {
                    setIsAdmin(false);
                    navigate("/");
                }
            }
        }
        setLoading(false);
    }, []);
    console.log({ isAdmin });
    if (loading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "400px" }}
            >
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
