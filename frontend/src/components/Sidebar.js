import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar({ role, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    block px-4 py-2 text-sm rounded-lg transition-colors duration-200
    ${isActive(path) 
      ? 'bg-blue-600 text-white' 
      : 'text-gray-700 hover:bg-gray-100'
    }
  `;

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-2xl font-bold text-blue-600">📊 Linkompta</h3>
        <p className="text-sm text-gray-500 mt-1">
          {role === 'admin' && 'Administrateur'}
          {role === 'comptable' && 'Comptable'}
          {role === 'client' && 'Client'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Dashboard pour tous */}
          <li>
            <Link to="/" className={linkClass('/')}>
              🏠 Tableau de bord
            </Link>
          </li>

          {/* Menu Client */}
          {role === "client" && (
            <>
              <li className="pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Mes Services
                </div>
              </li>
              <li>
                <Link to="/documents" className={linkClass('/documents')}>
                  📁 Mes Documents
                </Link>
              </li>
              <li>
                <Link to="/factures" className={linkClass('/factures')}>
                  💰 Mes Factures
                </Link>
              </li>
              <li>
                <Link to="/rendezvous" className={linkClass('/rendezvous')}>
                  📅 Mes Rendez-vous
                </Link>
              </li>
              <li>
                <Link to="/messagerie" className={linkClass('/messagerie')}>
                  💬 Messagerie
                </Link>
              </li>
            </>
          )}

          {/* Menu Comptable */}
          {role === "comptable" && (
            <>
              <li className="pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Gestion Clients
                </div>
              </li>
              <li>
                <Link to="/clients" className={linkClass('/clients')}>
                  👥 Mes Clients
                </Link>
              </li>
              <li>
                <Link to="/documents" className={linkClass('/documents')}>
                  📁 Documents Clients
                </Link>
              </li>
              <li>
                <Link to="/factures" className={linkClass('/factures')}>
                  💰 Factures
                </Link>
              </li>
              <li>
                <Link to="/rendezvous" className={linkClass('/rendezvous')}>
                  📅 Rendez-vous
                </Link>
              </li>
              <li>
                <Link to="/messagerie" className={linkClass('/messagerie')}>
                  💬 Messagerie
                </Link>
              </li>
            </>
          )}

          {/* Menu Admin */}
          {role === "admin" && (
            <>
              <li className="pt-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Administration
                </div>
              </li>
              <li>
                <Link to="/admin" className={linkClass('/admin')}>
                  🛠️ Panel Admin
                </Link>
              </li>
              <li>
                <Link to="/messagerie" className={linkClass('/messagerie')}>
                  💬 Messagerie
                </Link>
              </li>
            </>
          )}

          {/* Profil pour tous */}
          <li className="pt-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Mon Compte
            </div>
          </li>
          <li>
            <Link to="/profil" className={linkClass('/profil')}>
              👤 Mon Profil
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer avec bouton déconnexion */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
