import React, { useEffect, useState } from "react";
import api from "../api/axios";

function DocumentsComptable() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Charger tous les documents des clients du comptable
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const res = await api.get("documents/comptable/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des documents :", err);
        setError("Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [token]);

  // Mettre Ã  jour le statut d'un document
  const updateStatus = async (documentId, newStatus) => {
    try {
      await api.patch(`documents/${documentId}/update-status/`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recharger la liste
      const res = await api.get("documents/comptable/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("Erreur lors de la mise Ã  jour :", err);
      setError("Erreur lors de la mise Ã  jour du statut");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'envoye': return 'bg-blue-100 text-blue-800';
      case 'recu': return 'bg-yellow-100 text-yellow-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      case 'traite': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'envoye': 'EnvoyÃ©',
      'recu': 'ReÃ§u',
      'en_cours': 'En cours',
      'traite': 'TraitÃ©'
    };
    return statusMap[status] || status;
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ðŸ“ Documents de mes clients
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun document trouvÃ©.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Titre</th>
                  <th className="px-4 py-2 text-left">Taille</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {doc.client?.user?.first_name} {doc.client?.user?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {doc.client?.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-sm text-gray-500">{doc.file_type}</div>
                    </td>
                    <td className="px-4 py-3">
                      {formatFileSize(doc.file_size)}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
                        {getStatusText(doc.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {doc.status !== 'traite' && (
                          <select
                            value={doc.status}
                            onChange={(e) => updateStatus(doc.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="envoye">EnvoyÃ©</option>
                            <option value="recu">ReÃ§u</option>
                            <option value="en_cours">En cours</option>
                            <option value="traite">TraitÃ©</option>
                          </select>
                        )}
                        
                        <a
                          href={`http://127.0.0.1:8000${doc.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          TÃ©lÃ©charger
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default DocumentsComptable;
