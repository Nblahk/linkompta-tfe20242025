import React, { useEffect, useState } from "react";
import api from "../api/axios";

function ClientsComptable() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetails, setClientDetails] = useState(null);
  const token = localStorage.getItem("token");

  // Charger la liste des clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await api.get("clients/comptable-list/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClients(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des clients :", err);
        setError("Erreur lors du chargement des clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, [token]);

  // Charger les dÃ©tails d'un client (documents, factures, etc.)
  const loadClientDetails = async (client) => {
    try {
      setSelectedClient(client);
      const headers = { Authorization: `Bearer ${token}` };
      
      // Charger documents du client
      const documentsRes = await api.get("documents/comptable/", { headers });
      const clientDocuments = documentsRes.data.filter(doc => doc.client?.id === client.id);
      
      // Charger factures du client
      const facturesRes = await api.get("factures/comptable/", { headers });
      const clientFactures = facturesRes.data.filter(facture => facture.client?.id === client.id);
      
      // Charger rendez-vous du client
      const rdvRes = await api.get("rendezvous/comptable/", { headers });
      const clientRdv = rdvRes.data.filter(rdv => rdv.client?.id === client.user?.id);

      setClientDetails({
        documents: clientDocuments,
        factures: clientFactures,
        rendezvous: clientRdv
      });
    } catch (err) {
      console.error("Erreur lors du chargement des dÃ©tails :", err);
      setError("Erreur lors du chargement des dÃ©tails du client");
    }
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Liste des clients */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ðŸ‘¥ Mes Clients ({clients.length})
            </h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {clients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun client assignÃ©.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {clients.map((client) => (
                  <div
                    key={client.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedClient?.id === client.id
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                    onClick={() => loadClientDetails(client)}
                  >
                    <div className="font-medium text-gray-900">
                      {client.user?.first_name} {client.user?.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.user?.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      ðŸ“ž {client.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DÃ©tails du client sÃ©lectionnÃ© */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="space-y-6">
              
              {/* Informations gÃ©nÃ©rales */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  ðŸ“‹ Profil de {selectedClient.user?.first_name} {selectedClient.user?.last_name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{selectedClient.user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">TÃ©lÃ©phone:</span>
                    <p className="text-gray-600">{selectedClient.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-sm font-medium text-gray-700">Adresse:</span>
                    <p className="text-gray-600">{selectedClient.address}</p>
                  </div>
                </div>
              </div>

              {/* RÃ©sumÃ© des activitÃ©s */}
              {clientDetails && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Documents */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">ðŸ“ Documents</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {clientDetails.documents.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {clientDetails.documents.slice(0, 3).map((doc) => (
                        <div key={doc.id} className="text-sm">
                          <div className="font-medium truncate">{doc.title}</div>
                          <div className="text-gray-500 text-xs">
                            {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      ))}
                      {clientDetails.documents.length > 3 && (
                        <div className="text-xs text-gray-500">
                          et {clientDetails.documents.length - 3} autres...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Factures */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">ðŸ’° Factures</h4>
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {clientDetails.factures.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {clientDetails.factures.slice(0, 3).map((facture) => (
                        <div key={facture.id} className="text-sm">
                          <div className="font-medium truncate">{facture.titre}</div>
                          <div className="text-gray-500 text-xs">
                            {facture.montant_tvac} â‚¬ - {facture.statut}
                          </div>
                        </div>
                      ))}
                      {clientDetails.factures.length > 3 && (
                        <div className="text-xs text-gray-500">
                          et {clientDetails.factures.length - 3} autres...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rendez-vous */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">ðŸ“… RDV</h4>
                      <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {clientDetails.rendezvous.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {clientDetails.rendezvous.slice(0, 3).map((rdv) => (
                        <div key={rdv.id} className="text-sm">
                          <div className="font-medium text-xs">
                            {new Date(rdv.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {rdv.statut}
                          </div>
                        </div>
                      ))}
                      {clientDetails.rendezvous.length > 3 && (
                        <div className="text-xs text-gray-500">
                          et {clientDetails.rendezvous.length - 3} autres...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-500">
                <p className="text-lg mb-2">ðŸ‘† SÃ©lectionnez un client</p>
                <p>Cliquez sur un client Ã  gauche pour voir ses dÃ©tails</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default ClientsComptable;
