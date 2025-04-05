import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import MiniCart from "./MiniCart";
import MiniWishlist from "./MiniWishlist";

interface MiniCartProps {
    onClose: () => void;
}

interface MiniWishlistProps {
    onClose: () => void;
}

const Navbar: React.FC = () => {
    const { getItemCount } = useCart();
    const { favorites: wishlistItems } = useWishlist();
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Vous avez été déconnecté avec succès");
            navigate("/");
        } catch (error) {
            toast.error("Erreur lors de la déconnexion");
        }
    };

    useEffect(() => {
        if (user) {
            const hasAdminRole = user.roles?.some(
                (role: any) => role.name === "admin"
            );
            setIsAdmin(hasAdminRole);
        }
        setLoading(false);
    }, [user]);

    const cartItemCount = getItemCount();
    const wishlistItemCount = wishlistItems.length;

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <i className="bi bi-shop me-2"></i>
                    Notre Boutique
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="bi bi-house-door me-1"></i>
                                Accueil
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/bijoux">
                                <i className="bi bi-gem me-1"></i>
                                Bijoux
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/accessoires">
                                <i className="bi bi-bag me-1"></i>
                                Accessoires
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/montres">
                                <i className="bi bi-clock me-1"></i>
                                Montres
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/chaussures">
                                <i className="bi bi-boot me-1"></i>
                                Chaussures
                            </Link>
                        </li>
                        {isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/admin">
                                    <i className="bi bi-speedometer2 me-1"></i>
                                    Backoffice
                                </Link>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button
                                className="nav-link position-relative btn btn-link"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.error(
                                            "Vous devez être connecté pour ajouter des produits à votre liste de souhaits"
                                        );
                                    } else {
                                        setShowWishlist(!showWishlist);
                                    }
                                }}
                            >
                                <i className="bi bi-heart"></i>
                                {isAuthenticated && wishlistItemCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {wishlistItemCount}
                                    </span>
                                )}
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className="nav-link position-relative btn btn-link"
                                onClick={() => {
                                    if (isAuthenticated) {
                                        if (cartItemCount === 0) {
                                            toast.error(
                                                "Votre panier est vide"
                                            );
                                        } else {
                                            setShowCart(!showCart);
                                        }
                                    } else {
                                        toast.error(
                                            "Vous devez être connecté pour ajouter des produits à votre panier"
                                        );
                                    }
                                }}
                            >
                                <i className="bi bi-cart"></i>
                                {cartItemCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                        {cartItemCount}
                                    </span>
                                )}
                            </button>
                        </li>
                        {isAuthenticated && user ? (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <i className="bi bi-person-circle me-1"></i>
                                    {user.name}
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/profile"
                                        >
                                            <i className="bi bi-person-circle me-2"></i>
                                            Mes informations
                                        </Link>
                                    </li>

                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={handleLogout}
                                        >
                                            <i className="bi bi-box-arrow-right me-2"></i>
                                            Déconnexion
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="bi bi-box-arrow-in-right me-1"></i>
                                        Connexion
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="bi bi-person-plus me-1"></i>
                                        Inscription
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            {showCart && <MiniCart onClose={() => setShowCart(false)} />}
            {isAuthenticated && showWishlist && (
                <MiniWishlist onClose={() => setShowWishlist(false)} />
            )}
        </nav>
    );
};

export default Navbar;
