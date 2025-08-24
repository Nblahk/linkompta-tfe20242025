import React, { useEffect, useState } from "react";
import api from "../api/axios";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [factures, setFactures] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [rendezvous, setRendezvous] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab) => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      switch (tab) {
        case 'users':
          const usersRes = await api.get("users/admin-list/", { headers });
          setUsers(usersRes.data);
          break;
        
        case 'clients':
          const clientsRes = await api.get("clients/admin-list/", { headers });
          setClients(clientsRes.data);
          break;
        
        case 'factures':
          const facturesRes = await api.get("factures/admin/", { headers });
          setFactures(facturesRes.data);
          break;
        
        case 'documents':
          const documentsRes = await api.get("documents/admin/", { headers });
          setDocuments(documentsRes.data);
          break;
        
        case 'rendezvous':
          const rdvRes = await api.get("rendezvous/admin/", { headers });
          setRendezvous(rdvRes.data);
          break;
        
        case 'audit':
          const auditRes = await api.get("users/admin/audit/", { headers });
          setAuditLogs(auditRes.data.audit_logs || []);
          break;
      }
      setError(null);
    } catch (err) {
      console.error(`Erreur lors du chargement de ${tab}:`, err);
      setError(`Erreur lors du chargement des données`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'comptable': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'en_attente': return 'bg-yellow-100 text-yellow-800';
      case 'accepte': case 'payee': case 'traite': return 'bg-green-100 text-green-800';
      case 'refuse': case 'annulee': return 'bg-red-100 text-red-800';
      case 'envoye': return 'bg-blue-100 text-blue-800';
      case 'recu': return 'bg-purple-100 text-purple-800';
      case 'en_cours': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'users', label: '👥 Utilisateurs', count: users.length },
    { id: 'clients', label: '🏢 Clients', count: clients.length },
    { id: 'factures', label: '💰 Factures', count: factures.length },
    { id: 'documents', label: '📁 Documents', count: documents.length },
    { id: 'rendezvous', label: '📅 Rendez-vous', count: rendezvous.length },
    { id: 'audit', label: '🔍 Audit', count: auditLogs.length }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md">
        
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800">
            🛠️ Panel Administrateur
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              {/* Utilisateurs */}
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Nom</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Rôle</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                        <th className="px-4 py-2 text-left">Dernière connexion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{user.first_name} {user.last_name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </td>
                          <td className="px-4 py-3">{user.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.is_active ? 'Actif' : 'Inactif'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {user.last_login ? formatDate(user.last_login) : 'Jamais'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Clients */}
              {activeTab === 'clients' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Client</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Comptable assigné</th>
                        <th className="px-4 py-2 text-left">Adresse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {client.user?.first_name} {client.user?.last_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {client.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div>{client.user?.email}</div>
                            <div className="text-sm text-gray-500">{client.phone}</div>
                          </td>
                          <td className="px-4 py-3">
                            {client.comptable ? (
                              <div>
                                <div className="font-medium">
                                  {client.comptable.first_name} {client.comptable.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{client.comptable.email}</div>
                              </div>
                            ) : (
                              <span className="text-red-500">Non assigné</span>
                            )}
                          </td>
                          <td className="px-4 py-3">{client.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Factures */}
              {activeTab === 'factures' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">N° Facture</th>
                        <th className="px-4 py-2 text-left">Client</th>
                        <th className="px-4 py-2 text-left">Titre</th>
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
                            <div className="font-medium">
                              {facture.client?.user?.first_name} {facture.client?.user?.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">{facture.titre}</td>
                          <td className="px-4 py-3 font-bold">{facture.montant_tvac} €</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(facture.statut)}`}>
                              {facture.statut}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatDate(facture.date_creation)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Documents */}
              {activeTab === 'documents' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Document</th>
                        <th className="px-4 py-2 text-left">Client</th>
                        <th className="px-4 py-2 text-left">Type/Taille</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                        <th className="px-4 py-2 text-left">Date d'upload</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-gray-500">ID: {doc.id}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {doc.client?.user?.first_name} {doc.client?.user?.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div>{doc.file_type}</div>
                            <div className="text-sm text-gray-500">
                              {Math.round(doc.file_size / 1024)} KB
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatDate(doc.uploaded_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Rendez-vous */}
              {activeTab === 'rendezvous' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Client</th>
                        <th className="px-4 py-2 text-left">Comptable</th>
                        <th className="px-4 py-2 text-left">Date souhaitée</th>
                        <th className="px-4 py-2 text-left">Motif</th>
                        <th className="px-4 py-2 text-left">Statut</th>
                        <th className="px-4 py-2 text-left">Demandé le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rendezvous.map((rdv) => (
                        <tr key={rdv.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {rdv.client?.first_name} {rdv.client?.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-medium">
                              {rdv.comptable?.first_name} {rdv.comptable?.last_name}
                            </div>
                          </td>
                          <td className="px-4 py-3">{formatDate(rdv.date)}</td>
                          <td className="px-4 py-3">
                            <div className="max-w-xs truncate">{rdv.motif}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(rdv.statut)}`}>
                              {rdv.statut}
                            </span>
                          </td>
                          <td className="px-4 py-3">{formatDate(rdv.date_creation)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Audit Logs */}
              {activeTab === 'audit' && (
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold">Dernières activités du système</h3>
                    <p className="text-sm text-gray-600">200 dernières entrées des logs</p>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    {auditLogs.length === 0 ? (
                      <div className="text-gray-500">Aucun log disponible</div>
                    ) : (
                      auditLogs.map((log, index) => (
                        <div key={index} className="mb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
