import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Comment {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  rating: number;
  created_at: string | Date;
}

interface CommentContextType {
  comments: { [key: number]: Comment[] };
  addComment: (
    productId: number,
    comment: string,
    rating: number
  ) => Promise<void>;
  getComments: (productId: number) => Comment[];
  fetchComments: (productId: number) => Promise<void>;
  loading: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export const CommentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const API_URL = "http://localhost:8000";

  const fetchComments = async (productId: number) => {
    console.log("fetchComments", productId);
    try {
      const response = await fetch(
        `${API_URL}/api/comments/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          console.error("Route non trouvée. Vérifiez l'URL de l'API");
          return;
        }
        const errorData = await response.json().catch(() => null);
        console.error("Error data:", errorData);
        throw new Error("Erreur lors de la récupération des commentaires");
      }

      if (response.status === 200) {
        const data = await response.json();
        console.log("Commentaires reçus:", data);
        setLoading(false);
        setComments((prev) => ({
          ...prev,
          [productId]: data,
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des commentaires:", error);
    }
  };

  const addComment = async (
    productId: number,
    comment: string,
    rating: number
  ) => {
    try {
      if (!token) {
        console.error("Token manquant");
        throw new Error("Vous devez être connecté pour ajouter un commentaire");
      }

      console.log("Tentative d'ajout de commentaire avec:", {
        productId,
        comment,
        rating,
        token: token.substring(0, 20) + "...",
      });
      const tokenBearer = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenBearer}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          comment,
          rating,
        }),
      });

      console.log("Status de la réponse:", response.status);
      console.log(
        "Headers de la réponse:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse d'erreur brute:", errorText);
        try {
          const errorData = JSON.parse(errorText);
          console.error("Données d'erreur parsées:", errorData);
          throw new Error(
            errorData.message || "Erreur lors de l'ajout du commentaire"
          );
        } catch (e) {
          throw new Error(
            `Erreur lors de l'ajout du commentaire: ${errorText}`
          );
        }
      }

      const data = await response.json();
      console.log("Commentaire ajouté avec succès:", data);
      setComments((prev) => ({
        ...prev,
        [productId]: [...(prev[productId] || []), data],
      }));
    } catch (error) {
      console.error("Erreur détaillée:", error);
      throw error;
    }
  };

  const getComments = (productId: number) => {
    return comments[productId] || [];
  };

  return (
    <CommentContext.Provider
      value={{ comments, addComment, getComments, fetchComments, loading }}
    >
      {children}
    </CommentContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error("useComments must be used within a CommentProvider");
  }
  return context;
};
