import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/userContext";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string | null;
  slug: string;
  brand: string;
  color: string;
  size: string;
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useUser();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [product, setProduct] = useState<Product>({
    id: 0,
    title: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    image: null,
    slug: "",
    brand: "",
    color: "",
    size: "",
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`);
      if (!response.ok) throw new Error("Produit non trouvé");

      const data = await response.json();
      setProduct(data);
      if (data.image) {
        setImagePreview(`http://localhost:8000/${data.image}`);
      }
    } catch (error) {
      toast.error("Erreur lors du chargement du produit");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          `http://localhost:8000/api/products/${id}/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Erreur lors de l'upload de l'image");

        const data = await response.json();
        setProduct((prev) => ({ ...prev, image: data.image }));
        toast.success("Image mise à jour avec succès");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour de l'image");
        console.error("Erreur:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // S'assurer que l'ID est un nombre
      const productId = Number(id);
      if (isNaN(productId)) {
        throw new Error("ID de produit invalide");
      }

      const productData = {
        ...product,
        id: productId,
      };

      console.log("Données du produit à envoyer:", productData);

      const response = await fetch(
        `http://localhost:8000/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );

      console.log("Statut de la réponse:", response.status);
      console.log(
        "Headers de la réponse:",
        Object.fromEntries(response.headers.entries())
      );

      const responseData = await response.json();
      console.log("Réponse du serveur:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de la mise à jour");
      }

      toast.success(responseData.message || "Produit mis à jour avec succès");
      navigate("/admin/products");
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du produit"
      );
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Modifier le produit</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/products")}
        >
          Retour
        </button>
      </div>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Prix</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Catégorie</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={product.category}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            rows={3}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Prévisualisation"
                className="img-thumbnail"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Slug</label>
          <input
            type="text"
            className="form-control"
            name="slug"
            value={product.slug}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Marque</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            value={product.brand}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Couleur</label>
          <input
            type="text"
            className="form-control"
            name="color"
            value={product.color}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Taille</label>
          <input
            type="text"
            className="form-control"
            name="size"
            value={product.size}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
