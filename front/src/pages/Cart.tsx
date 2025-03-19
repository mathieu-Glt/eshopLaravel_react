import React, { useState } from "react";
import { useCart } from "../context/cartContext";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000";

interface OrderForm {
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { user, token } = useUser();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderForm, setOrderForm] = useState<OrderForm>({
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const getImageUrl = (image: string | undefined) => {
    if (!image) return "https://via.placeholder.com/100x100?text=No+Image";
    if (image.startsWith("http")) return image;
    return `${API_URL}/storage/images/${image.split("/").pop()}`;
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Veuillez vous connecter pour commander");
      navigate("/login");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getTotal(),
        ...orderForm,
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      clearCart();
      toast.success("Commande effectuée avec succès !");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la création de la commande");
      console.error("Order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
          <h2>Votre panier est vide</h2>
          <p className="text-muted">
            Découvrez nos produits et commencez vos achats !
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/")}
          >
            Continuer mes achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Mon Panier</h1>

      <div className="row">
        <div className="col-lg-8">
          {/* Liste des produits */}
          <div className="card mb-4">
            <div className="card-body">
              {items.map((item) => (
                <div key={item.id} className="row mb-4 border-bottom pb-4">
                  <div className="col-md-2">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{
                        objectFit: "cover",
                        height: "100px",
                        width: "100px",
                      }}
                    />
                  </div>
                  <div className="col-md-4">
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="text-muted mb-0">
                      Prix: {item.price.toFixed(2)} €
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        min="1"
                        max={item.stock}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <small className="text-muted">
                      Stock disponible: {item.stock}
                    </small>
                  </div>
                  <div className="col-md-2">
                    <p className="h5 mb-2">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeItem(item.id)}
                    >
                      <i className="bi bi-trash"></i> Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="d-flex justify-content-between mb-4">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Continuer mes achats
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (
                  window.confirm("Voulez-vous vraiment vider votre panier ?")
                ) {
                  clearCart();
                }
              }}
            >
              <i className="bi bi-trash me-2"></i>
              Vider le panier
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Résumé de la commande */}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Résumé de la commande</h5>

              <div className="d-flex justify-content-between mb-3">
                <span>Sous-total</span>
                <span>{getTotal().toFixed(2)} €</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Livraison</span>
                <span>Gratuite</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong className="text-primary">
                  {getTotal().toFixed(2)} €
                </strong>
              </div>

              {user ? (
                <form onSubmit={handleSubmitOrder}>
                  <div className="mb-3">
                    <label className="form-label">Adresse de livraison</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={orderForm.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Ville</label>
                    <input
                      type="text"
                      className="form-control"
                      name="city"
                      value={orderForm.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Code postal</label>
                    <input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={orderForm.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={orderForm.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-lock me-2"></i>
                        Commander ({getTotal().toFixed(2)} €)
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center">
                  <p className="mb-3">
                    Connectez-vous pour finaliser votre commande
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => navigate("/login")}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Se connecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
