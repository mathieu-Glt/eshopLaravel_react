import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8000";

interface Product {
    id: number;
    title: string;
    stock: number;
    image: string | null;
}

const ProductLowStock = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getImageUrl = (image: string | null) => {
        if (!image) {
            return "/placeholder.jpg";
        }

        if (image.startsWith("http")) {
            return image;
        }

        return `${API_URL}/storage/images/${image.split("/").pop()}`;
    };

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    const fetchLowStockProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products/low-stock`, {
                credentials: "include",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok)
                throw new Error("Erreur lors du chargement des produits");
            const data = await response.json();
            console.log("Produits reçus:", data);
            setProducts(data.data || []);
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur lors du chargement des produits");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/admin");
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <button className="btn btn-primary mb-3" onClick={handleBack}>
                    Retour
                </button>
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">
                                Produits en faible stock
                            </h5>
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Nom</th>
                                            <th>Stock</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td>
                                                    <img
                                                        src={getImageUrl(
                                                            product.image
                                                        )}
                                                        alt={product.title}
                                                        className="img-fluid img-thumbnail"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                    />
                                                </td>
                                                <td>{product.title}</td>
                                                <td>
                                                    <strong
                                                        className={
                                                            product.stock < 10
                                                                ? "text-danger"
                                                                : "text-success"
                                                        }
                                                    >
                                                        {product.stock}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <button className="btn btn-primary">
                                                        Ajouter du stock
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductLowStock;
