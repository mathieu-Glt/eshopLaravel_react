import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface Stats {
    totalProducts: number;
    totalUsers: number;
    lowStock: number;
    recentOrders?: number;
}

const AdminIndex = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalUsers: 0,
        lowStock: 0,
        recentOrders: 0,
    } as Stats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const productsResponse = await fetch(
                    "http://localhost:8000/api/products",
                    {
                        credentials: "include",
                        headers: { Accept: "application/json" },
                    }
                );
                const products = await productsResponse.json();

                const usersResponse = await fetch(
                    "http://localhost:8000/api/users",
                    {
                        credentials: "include",
                        headers: { Accept: "application/json" },
                    }
                );
                const users = await usersResponse.json();

                const lowStockCount = products.filter(
                    (p: any) => p.stock < 10
                ).length;

                setStats({
                    totalProducts: products.length,
                    totalUsers: users.length,
                    lowStock: lowStockCount,
                    recentOrders: 0,
                });
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des statistiques:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

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

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="h2 mb-0">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Tableau de Bord
                    </h1>
                </div>
            </div>

            {/* Statistiques */}
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="card-subtitle text-muted">
                                    Total Produits
                                </h6>
                                <i className="bi bi-box-seam text-primary fs-4"></i>
                            </div>
                            <h2 className="card-title mb-3">
                                {stats.totalProducts}
                            </h2>
                            <Link
                                to="/admin/products"
                                className="btn btn-link text-decoration-none p-0"
                            >
                                Gérer les produits{" "}
                                <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="card-subtitle text-muted">
                                    Utilisateurs
                                </h6>
                                <i className="bi bi-people text-success fs-4"></i>
                            </div>
                            <h2 className="card-title mb-3">
                                {stats.totalUsers}
                            </h2>
                            <Link
                                to="/admin/users"
                                className="btn btn-link text-decoration-none p-0"
                            >
                                Gérer les utilisateurs{" "}
                                <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="card-subtitle text-muted">
                                    Stock Produits Faible
                                </h6>
                                <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
                            </div>
                            <h2 className="card-title mb-3 text-warning">
                                {stats.lowStock}
                            </h2>
                            <Link
                                to="/admin/products/low-stock"
                                className="btn btn-link text-decoration-none p-0"
                            >
                                Voir les produits en faible stock
                                <i className="bi bi-arrow-right ms-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="card-subtitle text-muted">
                                    Commandes Récentes
                                </h6>
                                <i className="bi bi-cart text-info fs-4"></i>
                            </div>
                            <h2 className="card-title mb-3">
                                {stats.recentOrders}
                            </h2>
                            <span className="text-muted">
                                Bientôt disponible
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Rapides */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    <h2 className="h4 mb-4">
                        <i className="bi bi-lightning-charge me-2"></i>
                        Actions Rapides
                    </h2>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <Link
                                to="/admin/products/create"
                                className="card h-100 border-0 shadow-sm text-decoration-none"
                            >
                                <div className="card-body text-center">
                                    <i className="bi bi-plus-circle text-primary fs-1 mb-3"></i>
                                    <h5 className="card-title">
                                        Ajouter un Produit
                                    </h5>
                                    <p className="card-text text-muted">
                                        Créer un nouveau produit dans le
                                        catalogue
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link
                                to="/admin/users"
                                className="card h-100 border-0 shadow-sm text-decoration-none"
                            >
                                <div className="card-body text-center">
                                    <i className="bi bi-people text-success fs-1 mb-3"></i>
                                    <h5 className="card-title">
                                        Gérer les Utilisateurs
                                    </h5>
                                    <p className="card-text text-muted">
                                        Administrer les comptes utilisateurs
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-md-4">
                            <Link
                                to="/admin/products/stock"
                                className="card h-100 border-0 shadow-sm text-decoration-none"
                            >
                                <div className="card-body text-center">
                                    <i className="bi bi-box-seam text-warning fs-1 mb-3"></i>
                                    <h5 className="card-title">
                                        Gérer le Stock
                                    </h5>
                                    <p className="card-text text-muted">
                                        Suivre et ajuster les niveaux de stock
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminIndex;
