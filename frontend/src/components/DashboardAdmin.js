import React, { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardAdmin({ token }) {
  const [users, setUsers] = useState([]);
  const [factures, setFactures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // 🔹 Liste des utilisateurs
        const usersRes = await api.get("users/admin/", { headers });
        setUsers(usersRes.data);

        // 🔹 Toutes les factures
        const facturesRes = await api.get("factures/admin/", { headers });
        setFactures(facturesRes.data);

        // 🔹 Tous les documents
        const documentsRes = await api.get("documents/admin/", { headers });
        setDocuments(documentsRes.data);

        // 🔹 Tous les rendez-vous
        const rdvRes = await api.get("rendezvous/admin/", { headers });
        setRendezvous(rdvRes.data);

        // 🔹 Audit des logs
        const logsRes = await api.get("users/admin/audit/", { headers });
        setLogs(logsRes.data);

      } catch (err) {
        console.error("Erreur chargement dashboard admin :", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>⚙️ Tableau de bord - Administrateur</h2>

      <section>
        <h3>👤 Utilisateurs</h3>
        {users.length === 0 ? <p>Aucun utilisateur.</p> : (
          <ul>
            {users.map((u) => (
              <li key={u.id}>{u.username} ({u.role})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>💰 Factures</h3>
        {factures.length === 0 ? <p>Aucune facture.</p> : (
          <ul>
            {factures.map((f) => (
              <li key={f.id}>{f.titre} - {f.montant_tvac}€ ({f.statut})</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📂 Documents</h3>
        {documents.length === 0 ? <p>Aucun document.</p> : (
          <ul>
            {documents.map((d) => (
              <li key={d.id}>{d.titre} → {d.status}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📅 Rendez-vous</h3>
        {rendezvous.length === 0 ? <p>Aucun rendez-vous.</p> : (
          <ul>
            {rendezvous.map((r) => (
              <li key={r.id}>{r.date} - {r.status}</li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>📜 Audit des logs</h3>
        {logs.length === 0 ? <p>Aucun log enregistré.</p> : (
          <ul>
            {logs.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default DashboardAdmin;
