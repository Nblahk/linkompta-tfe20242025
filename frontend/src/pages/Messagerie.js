import React, { useEffect, useState } from "react";
import api from "../api/axios";

function Messagerie() {
  const [messages, setMessages] = useState([]);
  const [messagesEnvoyes, setMessagesEnvoyes] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSendForm, setShowSendForm] = useState(false);
  const [activeTab, setActiveTab] = useState('recus'); // 'recus' ou 'envoyes'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    destinataire: '',
    sujet: '',
    contenu: ''
  });
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Charger les donnÃ©es
  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      
      // Messages reÃ§us
      const recusRes = await api.get("messagerie/recus/", { headers });
      setMessages(recusRes.data);
      
      // Messages envoyÃ©s
      const envoyesRes = await api.get("messagerie/envoyes/", { headers });
      setMessagesEnvoyes(envoyesRes.data);
      
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des messages :", err);
      setError("Erreur lors du chargement des messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let endpoint = "";
      
      // Selon le rÃ´le, on charge diffÃ©rents utilisateurs
      if (userRole === 'admin') {
        endpoint = "users/admin-list/";
      } else if (userRole === 'comptable') {
        endpoint = "clients/comptable-list/"; // Ses clients
      } else {
        // Pour un client, on ne peut Ã©crire qu'Ã  son comptable
        const userRes = await api.get("users/me/", { headers });
        if (userRes.data.client_profile?.comptable) {
          setUsers([userRes.data.client_profile.comptable]);
        }
        return;
      }
      
      const res = await api.get(endpoint, { headers });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("messagerie/envoyer/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Reset form et recharger messages
      setFormData({ destinataire: '', sujet: '', contenu: '' });
      setShowSendForm(false);
      await fetchMessages();
      setError(null);
    } catch (err) {
      console.error("Erreur lors de l'envoi :", err);
      setError("Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await api.patch(`messagerie/${messageId}/lu/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recharger les messages
      await fetchMessages();
    } catch (err) {
      console.error("Erreur lors du marquage :", err);
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

  if (loading && messages.length === 0) {
    return <div className="text-center py-4">Chargement...</div>;
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-md">
        
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              ðŸ’¬ Messagerie
            </h2>
            <button
              onClick={() => setShowSendForm(!showSendForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              âœ‰ï¸ Nouveau Message
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
            {error}
          </div>
        )}

        {/* Formulaire d'envoi */}
        {showSendForm && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Nouveau Message</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destinataire *
                </label>
                <select
                  value={formData.destinataire}
                  onChange={(e) => setFormData({...formData, destinataire: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                >
                  <option value="">SÃ©lectionner un destinataire</option>
                  {users.map((user) => (
                    <option key={user.id || user.user?.id} value={user.id || user.user?.id}>
                      {user.first_name || user.user?.first_name} {user.last_name || user.user?.last_name}
                      {user.role && ` (${user.role})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <input
                  type="text"
                  value={formData.sujet}
                  onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={formData.contenu}
                  onChange={(e) => setFormData({...formData, contenu: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  rows="5"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  disabled={loading}
                >
                  ðŸ“¤ Envoyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowSendForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('recus')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'recus'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ðŸ“¥ Messages ReÃ§us ({messages.length})
            </button>
            <button
              onClick={() => setActiveTab('envoyes')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'envoyes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              ðŸ“¤ Messages EnvoyÃ©s ({messagesEnvoyes.length})
            </button>
          </nav>
        </div>

        {/* Liste des messages */}
        <div className="p-6">
          {activeTab === 'recus' ? (
            // Messages reÃ§us
            messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun message reÃ§u.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      message.lu 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200 font-medium'
                    }`}
                    onClick={() => !message.lu && markAsRead(message.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`w-2 h-2 rounded-full ${message.lu ? 'bg-gray-400' : 'bg-blue-500'}`}></span>
                        <div>
                          <div className="font-medium text-gray-900">
                            De: {message.expediteur?.first_name} {message.expediteur?.last_name}
                          </div>
                          <div className="text-sm text-gray-600">{message.expediteur?.email}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(message.date_envoi)}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="font-medium text-gray-900">{message.sujet}</div>
                    </div>
                    
                    <div className="text-gray-700 text-sm">
                      {message.contenu.length > 150 
                        ? `${message.contenu.substring(0, 150)}...`
                        : message.contenu
                      }
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Messages envoyÃ©s
            messagesEnvoyes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun message envoyÃ©.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messagesEnvoyes.map((message) => (
                  <div key={message.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-gray-900">
                          Ã€: {message.destinataire?.first_name} {message.destinataire?.last_name}
                        </div>
                        <div className="text-sm text-gray-600">{message.destinataire?.email}</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(message.date_envoi)}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="font-medium text-gray-900">{message.sujet}</div>
                    </div>
                    
                    <div className="text-gray-700 text-sm">
                      {message.contenu}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default Messagerie;
