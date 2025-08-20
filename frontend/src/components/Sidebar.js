import React from "react";

function Sidebar({ role, onLogout }) {
  return (
    <div className="sidebar">
      <h3>Linkompta</h3>
      <ul>
        {role === "client" && (
          <>
            <li><a href="/documents">Mes Documents</a></li>
            <li><a href="/factures">Mes Factures</a></li>
            <li><a href="/rendezvous">Mes Rendez-vous</a></li>
            <li><a href="/messagerie">Messagerie</a></li>
          </>
        )}

        {role === "comptable" && (
          <>
            <li><a href="/clients">Mes Clients</a></li>
            <li><a href="/documents">Documents Clients</a></li>
            <li><a href="/factures">Factures</a></li>
            <li><a href="/rendezvous">Rendez-vous</a></li>
            <li><a href="/messagerie">Messagerie</a></li>
          </>
        )}

        {role === "admin" && (
          <>
            <li><a href="/utilisateurs">Utilisateurs</a></li>
            <li><a href="/factures">Toutes les Factures</a></li>
            <li><a href="/paiements">Paiements</a></li>
            <li><a href="/audit">Audit</a></li>
          </>
        )}
      </ul>
      <button onClick={onLogout}>Déconnexion</button>
    </div>
  );
}

export default Sidebar;
