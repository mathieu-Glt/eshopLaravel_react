import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
  discount_percentage: number | null;
  discounted_price: number | null;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  console.log("items cart", items);

  // Sauvegarde le panier dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error("Stock insuffisant");
          return currentItems;
        }
        // Vérifie que la nouvelle quantité ne dépasse pas le stock
        const newQuantity = Math.min(
          existingItem.quantity + quantity,
          product.stock
        );

        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }

      // Vérifie que la quantité initiale ne dépasse pas le stock
      const validQuantity = Math.min(quantity, product.stock);

      return [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: validQuantity,
          image: product.image,
          stock: product.stock,
          discount_percentage: product.discount_percentage,
          discounted_price: product.discounted_price,
        },
      ];
    });
    toast.success("Produit ajouté au panier");
  };

  const removeItem = (productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(
      (currentItems) =>
        currentItems
          .map((item) => {
            if (item.id === productId) {
              // Vérifie que la nouvelle quantité est valide
              const validQuantity = Math.max(0, Math.min(quantity, item.stock));
              return { ...item, quantity: validQuantity };
            }
            return item;
          })
          .filter((item) => item.quantity > 0) // Supprime les items avec quantité 0
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((total, item) => {
      const price = item.discount_percentage
        ? item.discounted_price!
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  /**
   * Calcule le nombre total d'articles dans le panier
   * @returns {number} Le nombre total d'articles (somme des quantités)
   * @example
   * // Si le panier contient :
   * // - Article 1: quantité 2
   * // - Article 2: quantité 3
   * getItemCount() // Retourne 5
   */
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
