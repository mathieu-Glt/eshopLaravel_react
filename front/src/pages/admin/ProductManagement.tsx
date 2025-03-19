import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://localhost:8000";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string | null;
}

const ProductManagement = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const getImageUrl = (image: string | null) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}/storage/images/${image.split("/").pop()}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
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
      setProducts(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      return;
    }

    try {
      console.log("Tentative de suppression du produit:", id);
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Statut de la réponse:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      toast.success("Produit supprimé avec succès");
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression du produit"
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

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
  // cree un bouton de retour page precedente
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container-fluid py-4">
      <button onClick={handleBack} className="btn btn-secondary mb-3">
        Retour
      </button>
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Gestion des Produits
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/products/create")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Ajouter un Produit
        </button>
      </div>

      {/* Filtres */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Toutes les catégories</option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau des produits */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Catégorie</th>
                  <th>Prix</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.image && (
                        <div>
                          <img
                            src={getImageUrl(product.image)}
                            alt={product.title}
                            className="img-thumbnail"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement;
                              console.error(
                                "Erreur de chargement de l'image:",
                                imgElement.src
                              );
                              imgElement.src =
                                "https://via.placeholder.com/50x50?text=Error";
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td>{product.title}</td>
                    <td>
                      <span className="badge bg-secondary">
                        {product.category}
                      </span>
                    </td>
                    <td>{product.price.toFixed(2)} €</td>
                    <td>
                      <span
                        className={`badge ${
                          product.stock < 10
                            ? "bg-danger"
                            : product.stock < 20
                            ? "bg-warning"
                            : "bg-success"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="btn btn-sm btn-warning text-white"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger text-white"
                          onClick={() => handleDelete(product.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-5">
              <i
                className="bi bi-search text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <p className="mt-3 text-muted">Aucun produit trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
