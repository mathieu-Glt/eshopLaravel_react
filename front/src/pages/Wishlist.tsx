import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/wishlistContext";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";

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

const Wishlist = () => {
  const { items: wishlistItems, removeItem } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
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

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Mes Favoris</h2>
      {products.length === 0 ? (
        <div className="alert alert-info">
          Vous n'avez pas encore de produits dans vos favoris.
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
