import React, { createContext, useContext, useState, useEffect } from "react";

interface WishlistItem {
  id: number;
  product_id: number;
  user_id: number;
}

interface WishlistContextType {
  favorites: WishlistItem[];
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<WishlistItem[]>([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  /**
   * Récupère la liste des favoris depuis l'API
   * Met à jour l'état favorites avec les données reçues
   * @returns {Promise<void>}
   */
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/wishlist", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la wishlist:", error);
    }
  };

  /**
   * Ajoute un produit à la liste des favoris
   * @param {number} productId - L'ID du produit à ajouter aux favoris
   * @returns {Promise<void>}
   * @throws {Error} Si l'ajout échoue
   */
  const addToFavorites = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8000/api/wishlist", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ product_id: productId }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setFavorites((prevItems) => [...prevItems, newItem]);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Erreur lors de l'ajout à la wishlist"
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout à la wishlist:", error);
      throw error;
    }
  };

  /**
   * Supprime un produit de la liste des favoris
   * @param {number} productId - L'ID du produit à supprimer des favoris
   * @returns {Promise<void>}
   * @throws {Error} Si la suppression échoue
   */
  const removeFromFavorites = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setFavorites((prevItems) =>
          prevItems.filter((item) => item.product_id !== productId)
        );
      } else {
        throw new Error("Erreur lors de la suppression de la wishlist");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la wishlist:", error);
      throw error;
    }
  };

  /**
   * Vérifie si un produit est dans la liste des favoris
   * @param {number} productId - L'ID du produit à vérifier
   * @returns {boolean} True si le produit est dans les favoris, false sinon
   */
  const isInWishlist = (productId: number) => {
    const isInWishlist = favorites.some(
      (favorite) => favorite.product_id === productId
    );
    console.log({ isInWishlist });
    return isInWishlist;
  };

  return (
    <WishlistContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/**
 * Hook personnalisé pour utiliser le contexte Wishlist
 * @returns {WishlistContextType} Le contexte Wishlist
 * @throws {Error} Si le hook est utilisé en dehors d'un WishlistProvider
 */
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
