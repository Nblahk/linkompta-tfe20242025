// frontend/src/components/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Tableau de bord - Espace Client</h2>

      <div style={{ marginTop: "20px" }}>
        <ul>
          <li>
            <Link to="/factures">💰 Mes factures</Link>
          </li>
          <li>
            <Link to="/documents">📂 Mes documents</Link>
          </li>
          <li>
            <Link to="/rendezvous">📅 Mes rendez-vous</Link>
          </li>
          <li>
            <Link to="/messages">✉️ Ma messagerie</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
