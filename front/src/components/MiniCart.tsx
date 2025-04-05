import React from "react";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image?: string;
    discount_percentage: number | null;
    discounted_price: number | null;
}

const MiniCart: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { items, removeItem, updateQuantity, getTotal, getItemCount } =
        useCart();

    const getImageUrl = (image: string | undefined) => {
        if (!image) return "https://via.placeholder.com/50x50?text=No+Image";
        if (image.startsWith("http")) return image;
        return `${API_URL}/storage/images/${image.split("/").pop()}`;
    };

    if (items.length === 0) {
        return (
            <div
                className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
                style={{ width: "400px", zIndex: 1000 }}
            >
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Mon Panier</h5>
                    <button className="btn btn-link" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="p-3 text-center">
                    <i className="bi bi-cart-x display-4 text-muted"></i>
                    <p className="mt-2">Votre panier est vide</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: "400px", zIndex: 1000 }}
        >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Mon Panier ({getItemCount()} articles)</h5>
                <button className="btn btn-link" onClick={onClose}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
            <div
                className="p-3"
                style={{ height: "calc(100vh - 180px)", overflowY: "auto" }}
            >
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="mini-cart-item d-flex align-items-center mb-3"
                    >
                        <img
                            src={getImageUrl(item.image)}
                            alt={item.title}
                            className="me-2"
                            style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                            }}
                        />
                        <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 className="mb-0">{item.title}</h6>
                                    <small className="text-muted">
                                        Quantité: {item.quantity}
                                    </small>
                                    {item.discount_percentage ? (
                                        <>
                                            <small className="text-decoration-line-through text-muted d-block">
                                                {Number(item.price).toFixed(2)}{" "}
                                                €
                                            </small>
                                            <small className="text-danger fw-bold">
                                                {Number(
                                                    item.discounted_price ||
                                                        item.price
                                                ).toFixed(2)}{" "}
                                                €
                                            </small>
                                            <small className="badge bg-danger">
                                                -{item.discount_percentage}%
                                            </small>
                                        </>
                                    ) : (
                                        <small className="text-primary">
                                            {Number(item.price).toFixed(2)} €
                                        </small>
                                    )}
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                        disabled={item.quantity >= item.stock}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-3 border-top">
                <div className="d-flex justify-content-between mb-2">
                    <span>Sous-total:</span>
                    <span>
                        {items
                            .reduce((total, item) => {
                                const price = item.discount_percentage
                                    ? Number(
                                          item.discounted_price || item.price
                                      )
                                    : Number(item.price);
                                return total + price * item.quantity;
                            }, 0)
                            .toFixed(2)}{" "}
                        €
                    </span>
                </div>
                <div className="d-grid gap-2">
                    <Link to="/cart" className="btn btn-outline-primary">
                        Voir le panier
                    </Link>
                    <Link to="/checkout" className="btn btn-primary">
                        Commander
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MiniCart;
