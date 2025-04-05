import { useAuth } from "../../context/AuthContext";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{ name: string }>;
    created_at: string;
}

const UserManagement = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            if (!token) {
                toast.error("Token d'authentification manquant");
                return;
            }

            const response = await fetch("http://localhost:8000/api/users", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Statut de la réponse:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erreur de la réponse:", errorData);
                throw new Error(
                    errorData.message ||
                        "Erreur lors de la récupération des utilisateurs"
                );
            }

            const data = await response.json();
            console.log("Données reçues:", data);
            setUsers(data);
        } catch (error) {
            console.error("Erreur complète:", error);
            toast.error("Erreur lors du chargement des utilisateurs");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
            )
        ) {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/users/${id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.ok) {
                    setUsers(users.filter((user) => user.id !== id));
                    toast.success("Utilisateur supprimé avec succès");
                } else {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || "Erreur lors de la suppression"
                    );
                }
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Erreur lors de la suppression"
                );
            }
        }
    };

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    // cree un bouton de retour page precedente
    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="container-fluid py-4">
            <button onClick={handleBack} className="btn btn-secondary mb-3">
                Retour
            </button>
            {/* En-tête */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 mb-0">
                    <i className="bi bi-people me-2"></i>
                    Gestion des Utilisateurs
                </h1>
                <Link to="/admin/users/create" className="btn btn-primary">
                    <i className="bi bi-person-plus me-2"></i>
                    Ajouter un Utilisateur
                </Link>
            </div>

            {/* Filtres */}
            <div className="card mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Rechercher un utilisateur..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau des utilisateurs */}
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôles</th>
                                    <th>Date d'inscription</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role.name}
                                                    className="badge bg-primary me-1"
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="btn-group">
                                                <Link
                                                    to={`/admin/users/${user.id}/edit`}
                                                    className="btn btn-sm btn-warning text-white"
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </Link>
                                                <button
                                                    className="btn btn-sm btn-danger text-white"
                                                    onClick={() =>
                                                        handleDelete(user.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-5">
                            <i
                                className="bi bi-search text-muted"
                                style={{ fontSize: "3rem" }}
                            ></i>
                            <p className="mt-3 text-muted">
                                Aucun utilisateur trouvé
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
