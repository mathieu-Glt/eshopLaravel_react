import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "react-toastify";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const {
    items: wishlistItems,
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
  } = useWishlist();

  const isInWishlist = wishlistItems.some(
    (item) => item.product_id === product.id
  );

  const handleAddToCart = () => {
    addItem(product.id, 1);
    toast.success("Produit ajouté au panier");
  };

  // Ajout du produit à la wishlist
  const handleWishlistToggle = async () => {
    try {
      if (isInWishlist) {
        await removeFromWishlist(product.id);
        toast.success("Produit retiré des favoris");
      } else {
        await addToWishlist(product.id);
        toast.success("Produit ajouté aux favoris");
      }
    } catch (error) {
      toast.error("Erreur lors de la modification des favoris");
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  return (
    <div className="card h-100">
      <div className="position-relative">
        <img
          src={getImageUrl(product.image)}
          className="card-img-top"
          alt={product.title}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <button
          className="btn btn-light position-absolute top-0 end-0 m-2 rounded-circle bg-warning p-0 d-flex align-items-center justify-content-center"
          onClick={handleWishlistToggle}
          style={{ width: "40px", height: "40px" }}
          title={isInWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          {isInWishlist ? (
            <FavoriteIcon sx={{ color: "red" }} />
          ) : (
            <FavoriteBorderOutlinedIcon />
          )}
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">{product.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {product.discount_percentage ? (
              <>
                <span className="text-decoration-line-through text-muted me-2">
                  {Number(product.price).toFixed(2)} €
                </span>
                <span className="text-danger fw-bold">
                  {Number(product.discounted_price || product.price).toFixed(2)}{" "}
                  €
                </span>
                <span className="badge bg-danger ms-2">
                  -{product.discount_percentage}%
                </span>
              </>
            ) : (
              <span className="h5 mb-0 text-primary">
                {Number(product.price).toFixed(2)} €
              </span>
            )}
          </div>
          <span
            className={`badge ${
              product.stock > 0 ? "bg-success" : "bg-danger"
            }`}
          >
            {product.stock > 0 ? "En stock" : "Rupture de stock"}
          </span>
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary w-100"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <i className="bi bi-cart-plus me-2"></i>
            Ajouter au panier
          </button>
        </div>
        <div className="mt-2 text-center">
          <Link to={`/products/${product.id}`} className="btn btn-link">
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
