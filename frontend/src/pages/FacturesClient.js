// frontend/src/pages/FacturesClient.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function FacturesClient() {
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
  );
}

export default FacturesClient;
