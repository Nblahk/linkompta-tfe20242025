import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Header() {
  const [user, setUser] = useState(null);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("users/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  const getRoleText = (role) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'comptable': return 'Comptable';
      case 'client': return 'Client';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'comptable': return 'bg-blue-500';
      case 'client': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Titre de la page courante */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {window.location.pathname === '/' && 'Tableau de bord'}
            {window.location.pathname === '/documents' && (role === 'client' ? 'Mes Documents' : 'Documents Clients')}
            {window.location.pathname === '/factures' && (role === 'client' ? 'Mes Factures' : 'Gestion des Factures')}
            {window.location.pathname === '/rendezvous' && (role === 'client' ? 'Mes Rendez-vous' : 'Demandes de Rendez-vous')}
            {window.location.pathname === '/clients' && 'Mes Clients'}
            {window.location.pathname === '/messagerie' && 'Messagerie'}
            {window.location.pathname === '/admin' && 'Administration'}
            {window.location.pathname === '/profil' && 'Mon Profil'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Informations utilisateur */}
        <div className="flex items-center space-x-4">
          {user && (
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user.first_name} {user.last_name}
              </div>
              <div className="flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-500">{user.email}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getRoleBadgeClass(role)}`}>
                  {getRoleText(role)}
                </span>
              </div>
            </div>
          )}
          
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}` : '👤'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
