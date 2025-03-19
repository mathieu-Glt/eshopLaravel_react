import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ProductManagement from "./pages/admin/ProductManagement";
import UserManagement from "./pages/admin/UserManagement";
import ProductDetail from "./pages/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/cartContext";
import { WishlistProvider } from "./context/wishlistContext";
import AdminIndex from "./pages/admin/AdminIndex";
import CreateProduct from "./pages/admin/CreateProduct";
import EditProduct from "./pages/admin/EditProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { CommentProvider } from "./context/commentContext";

const App = () => {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <CommentProvider>
            <Router>
              <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-grow-1 py-4">
                  <div className="container">
                    <Routes>
                      {/* Routes publiques */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/" element={<Index />} />
                      {/* Routes protégées */}
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminIndex />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/users"
                        element={
                          <ProtectedRoute>
                            <UserManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products"
                        element={
                          <ProtectedRoute>
                            <ProductManagement />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products/create"
                        element={
                          <ProtectedRoute>
                            <CreateProduct />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/admin/products/edit/:id"
                        element={
                          <ProtectedRoute>
                            <EditProduct />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </main>
              </div>
              <ToastContainer />
            </Router>
          </CommentProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
};

export default App;
