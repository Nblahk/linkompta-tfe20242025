import React, { useEffect, useState } from "react";
import api from "../api/axios";

function RendezVousComptable() {
  const [rendezvous, setRendezvous] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // Charger les rendez-vous
  useEffect(() => {
    const fetchRendezVous = async () => {
      try {
        setLoading(true);
        const res = await api.get("rendezvous/comptable/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRendezvous(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des rendez-vous :", err);
        setError("Erreur lors du chargement des rendez-vous");
      } finally {
        setLoading(false);
      }
    };
    fetchRendezVous();
  }, [token]);

  // Mettre à jour le statut d'un rendez-vous
  const updateStatus = async (rdvId, newStatus) => {
    try {
      await api.patch(`rendezvous/${rdvId}/update-status/`, 
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Recharger la liste
      const res = await api.get("rendezvous/comptable/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRendezvous(res.data);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setError("Erreur lors de la mise à jour du statut");
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'accepte': return 'bg-green-100 text-green-800';
      case 'refuse': return 'bg-red-100 text-red-800';
      case 'termine': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    const statutMap = {
      'en_attente': 'En attente',
      'accepte': 'Accepté',
      'refuse': 'Refusé',
      'termine': 'Terminé'
    };
    return statutMap[statut] || statut;
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📅 Demandes de Rendez-vous
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {rendezvous.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune demande de rendez-vous trouvée.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {rendezvous.map((rdv) => (
              <div key={rdv.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {rdv.client?.first_name} {rdv.client?.last_name}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(rdv.statut)}`}>
                        {getStatusText(rdv.statut)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">📧 Email:</span>
                        <p className="text-sm text-gray-600">{rdv.client?.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">📅 Date souhaitée:</span>
                        <p className="text-sm text-gray-600">
                          {new Date(rdv.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">📝 Demandé le:</span>
                        <p className="text-sm text-gray-600">
                          {new Date(rdv.date_creation).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">💼 Motif:</span>
                      <p className="text-sm text-gray-600 mt-1">{rdv.motif}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {rdv.statut === 'en_attente' && (
                      <>
                        <button
                          onClick={() => updateStatus(rdv.id, 'accepte')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          ✅ Accepter
                        </button>
                        <button
                          onClick={() => updateStatus(rdv.id, 'refuse')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          ❌ Refuser
                        </button>
                      </>
                    )}
                    
                    {rdv.statut === 'accepte' && (
                      <button
                        onClick={() => updateStatus(rdv.id, 'termine')}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        ✅ Marquer terminé
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RendezVousComptable;
