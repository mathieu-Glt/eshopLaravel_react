import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlistContext";
import { toast } from "react-toastify";

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  discount_percentage: number | null;
  discounted_price: number | null;
}

interface MiniWishlistProps {
  onClose: () => void;
}

const MiniWishlist: React.FC<MiniWishlistProps> = ({ onClose }) => {
  const { favorites: wishlistItems, removeFromFavorites } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        console.log({ response });
        if (response.ok) {
          const allProducts = await response.json();
          const wishlistProducts = allProducts.filter((product: Product) =>
            wishlistItems.some((item) => item.product_id === product.id)
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

    fetchProducts();
  }, [wishlistItems]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      await removeFromFavorites(productId);
      toast.success("Produit retiré des favoris");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:8000/${imagePath}`;
  };

  return (
    <div
      className="position-fixed top-0 end-0 h-100 bg-white shadow-lg"
      style={{ width: "400px", zIndex: 1000 }}
    >
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Mes Favoris</h5>
        <button className="btn btn-link" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div
        className="p-3"
        style={{ height: "calc(100vh - 60px)", overflowY: "auto" }}
      >
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted">
            <i className="bi bi-heart-broken display-4"></i>
            <p className="mt-2">Votre liste de favoris est vide</p>
          </div>
        ) : (
          <div className="list-group">
            {products.map((product) => (
              <div key={product.id} className="list-group-item">
                <div className="d-flex align-items-center">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.title}
                    className="me-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{product.title}</h6>
                    <div className="d-flex align-items-center">
                      {product.discount_percentage ? (
                        <>
                          <span className="text-decoration-line-through text-muted me-2">
                            {Number(product.price).toFixed(2)} €
                          </span>
                          <span className="text-danger fw-bold">
                            {Number(
                              product.discounted_price || product.price
                            ).toFixed(2)}{" "}
                            €
                          </span>
                        </>
                      ) : (
                        <span className="text-primary fw-bold">
                          {Number(product.price).toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-link text-danger"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-3 border-top">
        <Link to="/wishlist" className="btn btn-primary w-100">
          Voir tous mes favoris
        </Link>
      </div>
    </div>
  );
};

export default MiniWishlist;
