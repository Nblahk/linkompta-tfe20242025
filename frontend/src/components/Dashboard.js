import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Dashboard({ token }) {
  const [factures, setFactures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);

  // Charger les données du backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 🔹 Récupérer les factures du client
        const facturesRes = await api.get("factures/client/", { headers });
        setFactures(facturesRes.data);

        // 🔹 Récupérer les documents du client
        const documentsRes = await api.get("documents/client/", { headers });
        setDocuments(documentsRes.data);

        // 🔹 Récupérer les rendez-vous du client
        const rdvRes = await api.get("rendezvous/me/", { headers });
        setRendezvous(rdvRes.data);

      } catch (err) {
        console.error("Erreur lors du chargement du dashboard :", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Tableau de bord - Espace Client</h2>

      <section>
        <h3>💰 Mes factures</h3>
        {factures.length === 0 ? (
          <p>Aucune facture disponible.</p>
        ) : (
          <ul>
            {factures.map((f) => (
              <li key={f.id}>
                <strong>{f.titre}</strong> - {f.montant_tvac}€ ({f.statut})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📂 Mes documents</h3>
        {documents.length === 0 ? (
          <p>Aucun document disponible.</p>
        ) : (
          <ul>
            {documents.map((d) => (
              <li key={d.id}>
                <strong>{d.titre}</strong> - {d.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📅 Mes rendez-vous</h3>
        {rendezvous.length === 0 ? (
          <p>Aucun rendez-vous planifié.</p>
        ) : (
          <ul>
            {rendezvous.map((r) => (
              <li key={r.id}>
                {r.date} → {r.status} {r.commentaire && `(${r.commentaire})`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
