import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: {
        address: string;
        city: string;
        zip_code: string;
        country: string;
    };
}

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
}

interface WishlistItem {
    product_id: number;
}

const Profile = () => {
    const { token, user } = useAuth();
    const { favorites: wishlistItems } = useWishlist();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [wishlistData, setWishlistData] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) {
                console.error("Aucun utilisateur connecté");
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/users/${user.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        "Erreur lors de la récupération des informations de profil"
                    );
                }

                const data = await response.json();
                console.log("Données du profil reçues:", data);
                setProfileData(data.user);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des informations de profil",
                    error
                );
                toast.error(
                    "Erreur lors de la récupération des informations de profil"
                );
            }
        };

        const fetchProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/products"
                );
                console.log({ response });
                if (response.ok) {
                    const allProducts = await response.json();
                    const wishlistProducts = allProducts.filter(
                        (product: Product) =>
                            wishlistItems.some(
                                (item) => item.product_id === product.id
                            )
                    );
                    setProducts(wishlistProducts);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des produits:", error);
                toast.error("Erreur lors du chargement des produits");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
        fetchProducts();
    }, [token, wishlistItems, user?.id]);

    if (loading) {
        return (
            <div className="container py-4">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <div className="row">
                {/* Section Informations Personnelles */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-person-circle me-2"></i>
                                Informations Personnelles
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th className="text-muted">Nom</th>
                                            <td>{profileData?.name}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">
                                                Email
                                            </th>
                                            <td>{profileData?.email}</td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">
                                                Téléphone
                                            </th>
                                            <td>{profileData?.phone}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Adresse */}
                <div className="col-md-6 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-geo-alt me-2"></i>
                                Adresse
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th className="text-muted">
                                                Adresse
                                            </th>
                                            <td>
                                                {profileData?.address?.address}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">
                                                Ville
                                            </th>
                                            <td>
                                                {profileData?.address?.city}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">
                                                Code postal
                                            </th>
                                            <td>
                                                {profileData?.address?.zip_code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="text-muted">Pays</th>
                                            <td>
                                                {profileData?.address?.country}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section Liste de Souhaits */}
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-heart me-2"></i>
                                Ma Liste de Souhaits
                            </h5>
                        </div>
                        <div className="card-body">
                            {products?.length > 0 ? (
                                <div className="row g-4">
                                    {products.map((item) => (
                                        <div key={item.id} className="col-md-4">
                                            <div className="card h-100 border-0 shadow-sm">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="card-img-top"
                                                    style={{
                                                        height: "200px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                                <div className="card-body">
                                                    <h6 className="card-title">
                                                        {item.title}
                                                    </h6>
                                                    <p className="card-text text-primary fw-bold">
                                                        {item.price}€
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i
                                        className="bi bi-heart text-muted"
                                        style={{ fontSize: "3rem" }}
                                    ></i>
                                    <p className="mt-3 text-muted">
                                        Aucun produit dans votre liste de
                                        souhaits
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Commandes */}
                <div className="col-12 mt-4">
                    <div className="card shadow-sm">
                        <div className="card-header bg-info text-white">
                            <h5 className="card-title mb-0">
                                <i className="bi bi-bag me-2"></i>
                                Mes Commandes
                            </h5>
                        </div>
                        <div className="card-body text-center py-5">
                            <i
                                className="bi bi-clock-history text-muted"
                                style={{ fontSize: "3rem" }}
                            ></i>
                            <p className="mt-3 text-muted">
                                Cette fonctionnalité sera bientôt disponible
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
