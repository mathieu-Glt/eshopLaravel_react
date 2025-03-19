import { useUser } from "../../context/userContext";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: File | null;
  slug: string;
  brand: string;
  color: string;
  size: string;
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useUser();

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProductFormData>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      // Créer une URL pour la prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          form.append(key, value);
        }
      });

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du produit");
      }

      const data = await response.json();
      console.log("====================================");
      console.log(data);
      console.log("====================================");
      toast.success("Produit créé avec succès !");
      navigate("/admin");
    } catch (error) {
      toast.error("Erreur lors de la création du produit");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Créer un nouveau produit</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
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
            value={formData.price}
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
            value={formData.stock}
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
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
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
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
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
            value={formData.slug}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Marque</label>
          <input
            type="text"
            className="form-control"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Couleur</label>
          <input
            type="text"
            className="form-control"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Taille</label>
          <input
            type="text"
            className="form-control"
            name="size"
            value={formData.size}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Création en cours...
              </>
            ) : (
              "Créer le produit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
