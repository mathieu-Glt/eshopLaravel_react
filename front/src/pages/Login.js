import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, isAuthenticated, user } = useAuth();

    useEffect(() => {
        console.log("Login useEffect - isAuthenticated:", isAuthenticated);
        console.log("Login useEffect - user:", user);

        if (isAuthenticated && user) {
            console.log("User role:", user.roles[0]?.name);
            const userRole = user.roles[0]?.name;
            if (userRole === "admin") {
                console.log("Redirecting to /admin");
                navigate("/admin", { replace: true });
            } else {
                console.log("Redirecting to /");
                navigate("/", { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Login response:", data);

            if (!response.ok) {
                throw new Error(data.message || "Erreur de connexion");
            }

            if (data.token && data.user) {
                console.log("Setting auth data...");
                await login(data.token, data.user);
                toast.success("Connexion réussie !");
            } else {
                throw new Error("Données de connexion invalides");
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            toast.error(error.message || "Erreur lors de la connexion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Connexion</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                    ) : (
                                        "Se connecter"
                                    )}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>
                                    Pas encore de compte ?{" "}
                                    <Link to="/register">S'inscrire</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
