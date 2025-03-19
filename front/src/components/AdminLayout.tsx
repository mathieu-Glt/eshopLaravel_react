import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold">Administration</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin/products"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Gestion des Produits
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 hover:bg-gray-700">
            Gestion des Utilisateurs
          </Link>
          <Link to="/" className="block px-4 py-2 hover:bg-gray-700">
            Retour au site
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
