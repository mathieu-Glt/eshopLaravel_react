import React from "react";
import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="container py-4">
      <h1 className="mb-4">Tableau de bord administrateur</h1>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Gestion des produits</h5>
              <p className="card-text">
                Gérez votre catalogue de produits, ajoutez, modifiez ou
                supprimez des produits.
              </p>
              <Link to="/admin/products" className="btn btn-primary">
                Gérer les produits
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Gestion des utilisateurs</h5>
              <p className="card-text">
                Gérez les utilisateurs, leurs rôles et leurs permissions.
              </p>
              <Link to="/admin/users" className="btn btn-primary">
                Gérer les utilisateurs
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Statistiques</h5>
              <p className="card-text">
                Consultez les statistiques de votre boutique.
              </p>
              <button className="btn btn-primary" disabled>
                Voir les statistiques
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
