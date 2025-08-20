// frontend/src/pages/FacturesClient.js
import React, { useEffect, useState } from "react";
import api from "../api/axios";

function FacturesClient() {
  const [factures, setFactures] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await api.get("factures/client/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFactures(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des factures :", err);
      }
    };
    fetchFactures();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>💰 Mes factures</h2>
      {factures.length === 0 ? (
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
