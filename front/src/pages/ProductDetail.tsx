import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useWishlist } from "../context/wishlistContext";
import { useAuth } from "../context/AuthContext";
import { useComments } from "../context/commentContext";

const API_URL = "http://localhost:8000";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
  discount_percentage: number | null;
  discounted_price: number | null;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const { addComment, getComments, fetchComments } = useComments();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem, items } = useCart();
  const { addToFavorites, isInWishlist } = useWishlist();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Produit non trouvé");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
        toast.error("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    const loadComments = async () => {
      if (id) {
        try {
          console.log("Chargement des commentaires pour le produit:", id);
          await fetchComments(parseInt(id));
        } catch (error) {
          console.error("Erreur lors du chargement des commentaires:", error);
          toast.error("Erreur lors du chargement des commentaires");
        }
      }
    };

    loadComments();
  }, [id, fetchComments]);

  const handleAddToCart = () => {
    if (product) {
      if (items.length === 0) {
        addItem(product);
        toast.success("Produit ajouté au panier");
      } else {
        toast.error("Votre panier n'est pas vide");
      }
    }
  };

  const handleAddToFavorites = () => {
    if (product) {
      addToFavorites(product.id);
      toast.success("Produit ajouté aux favoris");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  const submitComment = async () => {
    if (!newComment.trim() || rating === 0) {
      toast.error("Veuillez ajouter un commentaire et une note");
      return;
    }
    try {
      console.log("Token dans ProductDetail:", token ? "présent" : "manquant");
      console.log(
        "Tentative d'ajout de commentaire pour le produit:",
        product?.id
      );
      await addComment(product!.id, newComment, rating);
      setNewComment("");
      setRating(0);
      setShowComments(false);
      toast.success("Commentaire ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'ajout du commentaire"
      );
    }
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Produit non trouvé</div>
      </div>
    );
  }

  const cartItem = items.find((item) => item.id === product.id);
  const remainingStock = product.stock - (cartItem?.quantity || 0);

  return (
    <div className="container mt-5">
      <button className="btn btn-primary mb-3" onClick={handleBack}>
        <i className="bi bi-arrow-left me-2"></i>
        Retour
      </button>
      <div className="row">
        <div className="col-md-6">
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            className="img-fluid rounded"
            style={{ maxHeight: "500px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-4">{product.title}</h1>
          <p className="lead mb-4">{product.description}</p>
          <div className="mb-4">
            {product.discount_percentage ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  {Number(product.price).toFixed(2)} €
                </span>
                <span className="text-danger fw-bold h4">
                  {Number(product.discounted_price || product.price).toFixed(2)}{" "}
                  €
                </span>
                <span className="badge bg-danger ms-2">
                  -{product.discount_percentage}%
                </span>
              </>
            ) : (
              <span className="h4 text-primary">
                {Number(product.price).toFixed(2)} €
              </span>
            )}
          </div>
          <div className="mb-4">
            <p className="mb-2">
              Stock disponible:{" "}
              <span
                className={remainingStock > 0 ? "text-success" : "text-danger"}
              >
                {remainingStock}
              </span>
            </p>
            {cartItem && (
              <p className="text-muted">
                {cartItem.quantity} dans votre panier
              </p>
            )}
          </div>
          <button
            className={`btn btn-lg ${
              remainingStock > 0 ? "btn-primary" : "btn-secondary"
            }`}
            onClick={handleAddToCart}
            disabled={remainingStock === 0}
          >
            {remainingStock > 0 ? (
              <>
                <i className="bi bi-cart-plus me-2"></i>
                Ajouter au panier
              </>
            ) : (
              "Rupture de stock"
            )}
          </button>
          <i
            className={`bi ${
              isInWishlist(product.id)
                ? "bi-heart text-danger"
                : "bi-heart-fill text-danger"
            } ms-5 fs-2`}
            onClick={handleAddToFavorites}
            style={{ cursor: "pointer" }}
          ></i>
        </div>
        <div className="col-md-6">
          <h2
            className="cursor-pointer"
            onClick={() => setShowComments(!showComments)}
          >
            Commentaires ({getComments(product.id).length})
          </h2>
          {showComments && (
            <>
              <div className="mb-4">
                <textarea
                  className="form-control"
                  placeholder="Ajouter un commentaire..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>

                <div className="rating mt-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <i
                      key={value}
                      className={`bi ${
                        value <= rating ? "bi-star-fill" : "bi-star"
                      } text-warning me-1`}
                      onClick={() => handleRatingClick(value)}
                      style={{
                        cursor: "pointer",
                        fontSize: "2rem",
                        color: "yellow",
                        marginRight: "10px",
                      }}
                    ></i>
                  ))}
                </div>

                <input type="hidden" name="product_id" value={product.id} />
                <button
                  onClick={submitComment}
                  className="focus:outline-none btn btn-primary mt-2"
                >
                  Ajouter commentaire
                </button>
              </div>
              <div id="comments-container">
                <h3>Commentaires</h3>
                {getComments(product.id).length === 0 ? (
                  <p>Aucun commentaire pour ce produit</p>
                ) : (
                  getComments(product.id).map((comment) => (
                    <div key={comment.id} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h6 className="card-subtitle mb-2 text-muted">
                            {new Date(comment.created_at).toLocaleString(
                              "fr-FR",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </h6>
                          <div>
                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`bi ${
                                  index < comment.rating
                                    ? "bi-star-fill"
                                    : "bi-star"
                                } text-warning`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <p className="card-text">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
