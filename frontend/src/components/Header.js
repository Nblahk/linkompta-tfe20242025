import React from "react";

function Header({ onLogout }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  return (
    <header style={{
      background: "#1e3a8a",
      color: "white",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h3>Linkompta 💼</h3>
      <div>
        <span style={{ marginRight: "15px" }}>
          Connecté : <strong>{username || "Utilisateur"}</strong> ({role})
        </span>
        <button 
          onClick={onLogout} 
          style={{
            background: "#ef4444",
            border: "none",
            padding: "6px 12px",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px"
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export default Header;
