import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      console.log("Status de la réponse:", response.status);
      const data = await response.json();
      console.log("Données reçues:", data);
      // si token est utilisateur role user

      if (data.token && data.user) {
        console.log("Utilisateur reçu:", data.user);
        console.log("Token reçu:", data.token);
        console.log("Roles reçus:", data.roles);
        const role = data.roles[0] || "user"; // Par défaut à "user" si le rôle n'est pas présent
        if (role === "user") {
          console.log("user");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Login successful:", data);
          // Afficher le toast et rediriger immédiatement
          toast.success("Connexion réussie !", {
            onClose: () => {
              navigate("/");
            },
          });
        } else if (role === "admin") {
          console.log("admin");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log("Login successful:", data);
          toast.success("Connexion réussie !");
          setTimeout(() => {
            navigate("/admin");
          }, 1000);
        } else {
          console.error("Role inconnu:", role);
          throw new Error("Role inconnu");
        }
      } else {
        console.error("Réponse invalide:", data);
        throw new Error(data.message || "Données de connexion invalides");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      alert(error.message || "Email ou mot de passe incorrect");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="login-container"
      style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Mot de passe:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ddd",
            }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Pas encore de compte?{" "}
        <span
          onClick={() => navigate("/register")}
          style={{ color: "#007bff", cursor: "pointer" }}
        >
          S'inscrire
        </span>
      </p>
    </div>
  );
}

export default Login;
