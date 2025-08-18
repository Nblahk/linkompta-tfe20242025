import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard({ token }) {
  const [factures, setFactures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);

  // Charger les données quand le composant s'affiche
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Récupère les factures
        const facturesRes = await api.get("factures/client/", { headers });
        setFactures(facturesRes.data);

        // Récupère les documents
        const documentsRes = await api.get("documents/client/", { headers });
        setDocuments(documentsRes.data);

        // Récupère les rendez-vous
        const rdvRes = await api.get("rendezvous/me/", { headers });
        setRendezvous(rdvRes.data);

      } catch (err) {
        console.error("Erreur chargement dashboard :", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div>
      <h2>📊 Tableau de bord</h2>

      <h3>💰 Mes factures</h3>
      <ul>
        {factures.map((f) => (
          <li key={f.id}>
            {f.titre} - {f.montant_tvac}€ ({f.statut})
          </li>
        ))}
      </ul>

      <h3>📂 Mes documents</h3>
      <ul>
        {documents.map((d) => (
          <li key={d.id}>
            {d.titre} - {d.status}
          </li>
        ))}
      </ul>

      <h3>📅 Mes rendez-vous</h3>
      <ul>
        {rendezvous.map((r) => (
          <li key={r.id}>
            {r.date} - {r.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
