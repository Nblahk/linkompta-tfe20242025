// frontend/src/pages/FacturesClient.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function FacturesClient() {
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchFactures = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir vos factures");
        navigate("/");
        return;
      }

      try {
        const res = await api.get("factures/me/", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        setFactures(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des factures :", err);
        if (err.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          localStorage.clear();
          navigate("/");
        } else {
          setError("Erreur lors du chargement des factures");
        }
      }
    };
    fetchFactures();
  }, [token, navigate]);

  return (
    <div>
      {/* Bouton retour en haut */}
      <div style={{ padding: "10px 20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #e9ecef" }}>
        <button
          style={{
            background: 'linear-gradient(135deg, #64748b, #475569)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onClick={handleBackToDashboard}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          ← Retour au tableau de bord
        </button>
      </div>
      
      <div style={{ padding: "20px" }}>
        <h2>💰 Mes factures</h2>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : factures.length === 0 ? (
          <p>Aucune facture disponible.</p>
        ) : (
          <ul>
            {factures.map((facture) => (
              <li key={facture.id}>
                <strong>{facture.titre}</strong> - {facture.montant_tvac} €
                <br />
                Statut : {facture.statut === "payee" ? "✅ Payée" : "❌ Non payée"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default FacturesClient;
