import React, { useEffect, useState } from "react";
import api from "../api/axios";

function DocumentsClient({ token }) {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  // 🔹 Charger les documents du client
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await api.get("documents/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des documents :", err);
      }
    };
    fetchDocuments();
  }, [token]);

  // 🔹 Upload d’un document
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Sélectionne un fichier avant d’envoyer !");
      return;
    }

    const formData = new FormData();
    formData.append("fichier", file); // ⚠️ doit correspondre au champ dans ton modèle Document
    formData.append("titre", file.name);

    try {
      await api.post("documents/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Document envoyé ✅");
      setFile(null);

      // Recharge la liste
      const res = await api.get("documents/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Erreur upload :", err);
      alert("Erreur lors de l’envoi du document ❌");
    }
  };

  return (
    <div>
      <h2>📂 Mes Documents</h2>

      {/* Formulaire upload */}
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Uploader</button>
      </form>

      {/* Liste des documents */}
      <h3>Liste des documents envoyés</h3>
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.titre} - Statut : {doc.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DocumentsClient;
