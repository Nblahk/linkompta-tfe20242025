import React, { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardComptable({ token }) {
  const [clients, setClients] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [factures, setFactures] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 🔹 Récupérer les clients
        const clientsRes = await api.get("clients/comptable-list/", { headers });
        setClients(clientsRes.data);

        // 🔹 Récupérer les documents (de tous ses clients)
        const documentsRes = await api.get("documents/comptable/", { headers });
        setDocuments(documentsRes.data);

        // 🔹 Récupérer toutes les factures (il peut les créer)
        const facturesRes = await api.get("factures/admin/", { headers });
        setFactures(facturesRes.data);

        // 🔹 Récupérer les demandes de rendez-vous reçues
        const rdvRes = await api.get("rendezvous/comptable/", { headers });
        setRendezvous(rdvRes.data);

      } catch (err) {
        console.error("Erreur chargement dashboard comptable :", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Tableau de bord - Espace Comptable</h2>

      <section>
        <h3>👥 Mes clients</h3>
        {clients.length === 0 ? (
          <p>Aucun client assigné.</p>
        ) : (
          <ul>
            {clients.map((c) => (
              <li key={c.id}>
                {c.user.username} - {c.entreprise}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📂 Documents reçus</h3>
        {documents.length === 0 ? (
          <p>Aucun document à traiter.</p>
        ) : (
          <ul>
            {documents.map((d) => (
              <li key={d.id}>
                {d.titre} → {d.status}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>💰 Factures</h3>
        {factures.length === 0 ? (
          <p>Aucune facture trouvée.</p>
        ) : (
          <ul>
            {factures.map((f) => (
              <li key={f.id}>
                {f.titre} - {f.montant_tvac}€ ({f.statut})
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📅 Rendez-vous</h3>
        {rendezvous.length === 0 ? (
          <p>Aucun rendez-vous demandé.</p>
        ) : (
          <ul>
            {rendezvous.map((r) => (
              <li key={r.id}>
                {r.client} → {r.date} ({r.status})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardComptable;
