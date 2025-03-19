import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
// import { useUser } from "../context/userContext";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log("isAdmin", isAdmin);
  console.log("user", user);

  useEffect(() => {
    if (user) {
      console.log("User data:", user);
      const hasAdminRole = user.roles?.some(
        (role: any) => role.name === "admin"
      );
      setIsAdmin(hasAdminRole);
    }
    setLoading(false);
  }, [user]);
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
