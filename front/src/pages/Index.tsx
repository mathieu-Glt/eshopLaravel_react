import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8000";

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    category?: string;
    discount_percentage: number | null;
    discounted_price: number | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
}

const Index = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState<number | null>(null);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState(0);

    const { addItem, items } = useCart();

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return "/placeholder.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://localhost:8000/${imagePath}`;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/products`, {
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                console.log("Products received:", data);
                setProducts(data);

                const maxProductPrice = Math.max(
                    ...data.map((p: Product) => p.price)
                );
                setMaxPrice(maxProductPrice);

                const uniqueCategories = [
                    ...new Set(data.map((p: Product) => p.category)),
                ].filter(
                    (category): category is string =>
                        typeof category === "string"
                );
                setCategories(uniqueCategories);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleAddToCart = (product: Product) => {
        const cartItem = items.find((item) => item.id === product.id);
        if (cartItem && cartItem.quantity >= product.stock) {
            toast.warning("Stock maximum atteint pour ce produit");
            return;
        }

        addItem(product);
        toast.success(`${product.title} ajouté au panier`);
    };

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            selectedCategory === "all" || product.category === selectedCategory;
        const matchesSearch =
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const finalPrice = product.discount_percentage
            ? product.discounted_price || product.price
            : product.price;

        const matchesMaxPrice = !priceRange || finalPrice <= priceRange;
        const matchesMinPrice = !minPrice || finalPrice >= minPrice;

        return (
            matchesCategory &&
            matchesSearch &&
            matchesMaxPrice &&
            matchesMinPrice
        );
    });

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="alert alert-danger text-center m-4" role="alert">
                {error}
            </div>
        );

    return (
        <div className="container py-5">
            <div className="row">
                {/* Aside avec filtres */}
                <div className="col-lg-3 mb-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-4">Filtres</h5>

                            {/* Barre de recherche */}
                            <div className="mb-4">
                                <label
                                    htmlFor="searchInput"
                                    className="form-label"
                                >
                                    Rechercher un produit
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="searchInput"
                                    placeholder="Nom ou description..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>

                            {/* Filtres par prix */}
                            <div className="mb-4">
                                <label className="form-label">Prix</label>
                                <div className="row g-3">
                                    <div className="col-6">
                                        <label
                                            htmlFor="minPrice"
                                            className="form-label"
                                        >
                                            Minimum:{" "}
                                            {minPrice
                                                ? minPrice.toFixed(2)
                                                : "Prix"}{" "}
                                            €
                                        </label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            id="minPrice"
                                            min="0"
                                            max={maxPrice}
                                            step="1"
                                            value={minPrice || 0}
                                            onChange={(e) =>
                                                setMinPrice(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label
                                            htmlFor="priceRange"
                                            className="form-label"
                                        >
                                            Maximum:{" "}
                                            {priceRange
                                                ? priceRange.toFixed(2)
                                                : "Prix"}{" "}
                                            €
                                        </label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            id="priceRange"
                                            min="0"
                                            max={maxPrice}
                                            step="1"
                                            value={priceRange || 0}
                                            onChange={(e) =>
                                                setPriceRange(
                                                    Number(e.target.value)
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Catégories */}
                            <div>
                                <label className="form-label">Catégories</label>
                                <div className="d-flex flex-column gap-2">
                                    <button
                                        onClick={() =>
                                            setSelectedCategory("all")
                                        }
                                        className={`btn btn-sm ${
                                            selectedCategory === "all"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                    >
                                        Tous les produits
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() =>
                                                setSelectedCategory(category)
                                            }
                                            className={`btn btn-sm ${
                                                selectedCategory === category
                                                    ? "btn-primary"
                                                    : "btn-outline-primary"
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="col-lg-9">
                    {/* Hero Section */}
                    <div className="p-5 mb-4 bg-warning bg-gradient text-black rounded-3">
                        <div className="container-fluid py-5">
                            <h1 className="display-4 fw-bold">
                                Bienvenue sur notre boutique
                            </h1>
                            <p className="col-md-8 fs-4">
                                Découvrez notre sélection de produits de qualité
                            </p>
                        </div>
                    </div>

                    {/* Promotions Carousel */}
                    <div className="mb-5">
                        <h2 className="h3 mb-3">Meilleures Promotions</h2>
                        <div
                            id="promotionsCarousel"
                            className="carousel slide"
                            data-bs-ride="carousel"
                            data-bs-interval="5000"
                            data-bs-wrap="true"
                        >
                            {/* Indicateurs */}
                            <div className="carousel-indicators">
                                {products
                                    .filter(
                                        (product) => product.discount_percentage
                                    )
                                    .sort(
                                        (a, b) =>
                                            (b.discount_percentage || 0) -
                                            (a.discount_percentage || 0)
                                    )
                                    .slice(0, 8)
                                    .map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            data-bs-target="#promotionsCarousel"
                                            data-bs-slide-to={index}
                                            className={
                                                index === 0 ? "active" : ""
                                            }
                                            aria-current={
                                                index === 0 ? "true" : "false"
                                            }
                                            aria-label={`Slide ${index + 1}`}
                                        ></button>
                                    ))}
                            </div>

                            {/* Contenu du carousel */}
                            <div className="carousel-inner">
                                {products
                                    .filter(
                                        (product) => product.discount_percentage
                                    )
                                    .sort(
                                        (a, b) =>
                                            (b.discount_percentage || 0) -
                                            (a.discount_percentage || 0)
                                    )
                                    .slice(0, 8)
                                    .map((product, index) => (
                                        <div
                                            key={product.id}
                                            className={`carousel-item ${
                                                index === 0 ? "active" : ""
                                            }`}
                                        >
                                            <div className="row g-4">
                                                {products
                                                    .filter(
                                                        (p) =>
                                                            p.discount_percentage
                                                    )
                                                    .sort(
                                                        (a, b) =>
                                                            (b.discount_percentage ||
                                                                0) -
                                                            (a.discount_percentage ||
                                                                0)
                                                    )
                                                    .slice(
                                                        index * 4,
                                                        (index + 1) * 4
                                                    )
                                                    .map((product) => (
                                                        <div
                                                            key={product.id}
                                                            className="col-md-3"
                                                        >
                                                            <div className="card h-100 shadow-sm">
                                                                <img
                                                                    src={getImageUrl(
                                                                        product.image ||
                                                                            ""
                                                                    )}
                                                                    className="card-img-top"
                                                                    alt={
                                                                        product.title
                                                                    }
                                                                    style={{
                                                                        height: "200px",
                                                                        objectFit:
                                                                            "cover",
                                                                    }}
                                                                />
                                                                <div className="card-body">
                                                                    <h5 className="card-title">
                                                                        {
                                                                            product.title
                                                                        }
                                                                    </h5>
                                                                    <div className="d-flex justify-content-between align-items-center">
                                                                        <div>
                                                                            <span className="text-decoration-line-through text-muted me-2">
                                                                                {Number(
                                                                                    product.price
                                                                                ).toFixed(
                                                                                    2
                                                                                )}{" "}
                                                                                €
                                                                            </span>
                                                                            <span className="text-danger fw-bold">
                                                                                {Number(
                                                                                    product.discounted_price ||
                                                                                        product.price
                                                                                ).toFixed(
                                                                                    2
                                                                                )}{" "}
                                                                                €
                                                                            </span>
                                                                            <span className="badge bg-danger ms-2">
                                                                                -
                                                                                {
                                                                                    product.discount_percentage
                                                                                }

                                                                                %
                                                                            </span>
                                                                        </div>
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() =>
                                                                                handleAddToCart(
                                                                                    product
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className="bi bi-cart-plus"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Boutons de navigation */}
                            <button
                                className="carousel-control-prev"
                                type="button"
                                data-bs-target="#promotionsCarousel"
                                data-bs-slide="prev"
                            >
                                <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">
                                    Précédent
                                </span>
                            </button>
                            <button
                                className="carousel-control-next"
                                type="button"
                                data-bs-target="#promotionsCarousel"
                                data-bs-slide="next"
                            >
                                <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                ></span>
                                <span className="visually-hidden">Suivant</span>
                            </button>
                        </div>
                    </div>

                    {/* Tous les produits */}
                    <div className="mb-5">
                        <h2 className="h3 mb-3">Tous nos produits</h2>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {filteredProducts.map((product) => {
                                const cartItem = items.find(
                                    (item) => item.id === product.id
                                );
                                const remainingStock =
                                    product.stock - (cartItem?.quantity || 0);

                                return (
                                    <div key={product.id} className="col">
                                        <div className="card h-100 shadow-sm">
                                            {product.image ? (
                                                <img
                                                    src={getImageUrl(
                                                        product.image
                                                    )}
                                                    className="card-img-top"
                                                    alt={product.title}
                                                    style={{
                                                        height: "200px",
                                                        objectFit: "cover",
                                                    }}
                                                    onError={(e) => {
                                                        const target =
                                                            e.target as HTMLImageElement;
                                                        console.error(
                                                            `Error loading image for product "${product.title}" (ID: ${product.id}):`,
                                                            {
                                                                originalSrc:
                                                                    target.src,
                                                                productImage:
                                                                    product.image,
                                                                product,
                                                            }
                                                        );
                                                        target.onerror = null;
                                                        target.src =
                                                            "https://via.placeholder.com/400x300?text=Image+non+disponible";
                                                    }}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-light d-flex align-items-center justify-content-center"
                                                    style={{ height: "200px" }}
                                                >
                                                    <span className="text-muted">
                                                        Image non disponible
                                                    </span>
                                                </div>
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">
                                                    {product.title}
                                                </h5>
                                                <p
                                                    className="card-text text-muted"
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow: "hidden",
                                                    }}
                                                >
                                                    {product.description}
                                                </p>
                                                <div className="d-flex justify-content-between align-items-center mt-3">
                                                    <div>
                                                        {product.discount_percentage ? (
                                                            <>
                                                                <span className="text-decoration-line-through text-muted me-2">
                                                                    {Number(
                                                                        product.price
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    €
                                                                </span>
                                                                <span className="text-danger fw-bold">
                                                                    {Number(
                                                                        product.discounted_price ||
                                                                            product.price
                                                                    ).toFixed(
                                                                        2
                                                                    )}{" "}
                                                                    €
                                                                </span>
                                                                <span className="badge bg-danger ms-2">
                                                                    -
                                                                    {
                                                                        product.discount_percentage
                                                                    }
                                                                    %
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="h5 mb-0 text-primary">
                                                                {Number(
                                                                    product.price
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                €
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <Link
                                                            to={`/product/${product.id}`}
                                                            className="btn btn-outline-secondary"
                                                        >
                                                            <i className="bi bi-eye me-1"></i>
                                                            Détails
                                                        </Link>
                                                        <button
                                                            className={`btn ${
                                                                remainingStock >
                                                                0
                                                                    ? "btn-primary"
                                                                    : "btn-secondary"
                                                            }`}
                                                            disabled={
                                                                remainingStock ===
                                                                0
                                                            }
                                                            onClick={() =>
                                                                handleAddToCart(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            {remainingStock >
                                                            0 ? (
                                                                <>
                                                                    <i className="bi bi-cart-plus me-1"></i>
                                                                    Ajouter
                                                                </>
                                                            ) : (
                                                                "Rupture"
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
