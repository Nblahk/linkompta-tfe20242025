import React, { useEffect, useState } from "react";
import api from "../api/axios";

function FacturesComptable() {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    client: '',
    titre: '',
    description: '',
    montant_htva: '',
    tva: 21
  });
  const token = localStorage.getItem("token");

  // Charger factures et clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        
        // Charger les factures des clients du comptable
        const facturesRes = await api.get("factures/comptable/", { headers });
        setFactures(facturesRes.data);
        
        // Charger les clients du comptable
        const clientsRes = await api.get("clients/comptable-list/", { headers });
        setClients(clientsRes.data);
        
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur lors du chargement des donnÃ©es");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // CrÃ©er une nouvelle facture
  const handleCreateFacture = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("factures/create/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recharger les factures
      const res = await api.get("factures/comptable/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFactures(res.data);
      
      // Reset form
      setFormData({
        client: '',
        titre: '',
        description: '',
        montant_htva: '',
        tva: 21
      });
      setShowCreateForm(false);
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la crÃ©ation :", err);
      setError("Erreur lors de la crÃ©ation de la facture");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'payee': return 'bg-green-100 text-green-800';
      case 'annulee': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    const statutMap = {
      'en_attente': 'En attente',
      'payee': 'PayÃ©e',
      'annulee': 'AnnulÃ©e'
    };
    return statutMap[statut] || statut;
  };

  if (loading) return <div className="text-center py-4">Chargement...</div>;

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            ðŸ’° Gestion des Factures
          </h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Nouvelle Facture
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulaire de crÃ©ation */}
        {showCreateForm && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">CrÃ©er une nouvelle facture</h3>
            <form onSubmit={handleCreateFacture} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client *
                </label>
                <select
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">SÃ©lectionner un client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.user?.first_name} {client.user?.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant HTVA (â‚¬) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.montant_htva}
                  onChange={(e) => setFormData({...formData, montant_htva: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TVA (%) *
                </label>
                <select
                  value={formData.tva}
                  onChange={(e) => setFormData({...formData, tva: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={0}>0%</option>
                  <option value={6}>6%</option>
                  <option value={12}>12%</option>
                  <option value={21}>21%</option>
                </select>
              </div>

              <div className="md:col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  disabled={loading}
                >
                  CrÃ©er la Facture
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des factures */}
        {factures.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune facture trouvÃ©e.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">NÂ° Facture</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-left">Titre</th>
                  <th className="px-4 py-2 text-left">Montant HTVA</th>
                  <th className="px-4 py-2 text-left">TVA</th>
                  <th className="px-4 py-2 text-left">Montant TVAC</th>
                  <th className="px-4 py-2 text-left">Statut</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {factures.map((facture) => (
                  <tr key={facture.id} className="border-t">
                    <td className="px-4 py-3 font-mono">#{facture.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {facture.client?.user?.first_name} {facture.client?.user?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {facture.client?.user?.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{facture.titre}</div>
                      {facture.description && (
                        <div className="text-sm text-gray-500">{facture.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">{facture.montant_htva} â‚¬</td>
                    <td className="px-4 py-3">{facture.tva}%</td>
                    <td className="px-4 py-3 font-bold">{facture.montant_tvac} â‚¬</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(facture.statut)}`}>
                        {getStatusText(facture.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {new Date(facture.date_creation).toLocaleDateString('fr-FR')}
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

export default FacturesComptable;
