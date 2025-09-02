import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function DocumentsClient() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir vos documents");
        return;
      }

      try {
        setLoading(true);
        const response = await api.get("documents/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [token]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("fichier", file);
    formData.append("titre", file.name);

    try {
      setLoading(true);
      setUploadProgress(0);
      
      const response = await api.post("documents/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      setDocuments(prev => [response.data, ...prev]);
      setFile(null);
      setError(null);
      setUploadProgress(0);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error("Erreur upload:", err);
      setError(err.response?.data?.error || "Erreur lors de l'upload");
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    }

    try {
      await api.delete(`documents/${documentId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    } catch (err) {
      console.error("Erreur suppression:", err);
      setError("Erreur lors de la suppression");
    }
  };

  const handleDownload = async (documentId, filename) => {
    try {
      const response = await api.get(`documents/${documentId}/download/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      setError("Erreur lors du téléchargement");
    }
  };

  if (loading && documents.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Chargement des documents...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "20px" }}>
        {/* Bouton retour */}
        <button
          style={{
            background: 'linear-gradient(135deg, #64748b, #475569)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            marginBottom: '1rem',
          }}
          onClick={handleBackToDashboard}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          ← Retour au tableau de bord
        </button>
        
        <h2>📂 Mes Documents</h2>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem", padding: "10px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
            ❌ {error}
          </div>
        )}

        {/* Formulaire upload */}
        <form onSubmit={handleUpload} style={{ marginBottom: "2rem" }}>
          <div style={{ marginBottom: "1rem", padding: "20px", border: "2px dashed #ccc", borderRadius: "8px" }}>
            <input
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setError(null);
                }
              }}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            
            {file && (
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
                <strong>Fichier sélectionné:</strong> {file.name} ({formatFileSize(file.size)})
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ backgroundColor: "#e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
                  <div 
                    style={{ 
                      backgroundColor: "#4caf50", 
                      height: "20px", 
                      width: `${uploadProgress}%`,
                      transition: "width 0.3s ease"
                    }}
                  ></div>
                </div>
                <p style={{ textAlign: "center", margin: "5px 0" }}>{uploadProgress}%</p>
              </div>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={!file || loading}
            style={{
              backgroundColor: file && !loading ? "#007bff" : "#ccc",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              cursor: file && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Upload en cours..." : "📤 Uploader le document"}
          </button>
        </form>

        {/* Liste des documents */}
        <div>
          <h3>📋 Mes documents ({documents.length})</h3>
          
          {documents.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", fontStyle: "italic" }}>
              Aucun document trouvé. Uploadez votre premier document !
            </p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {documents.map((doc) => (
                <div 
                  key={doc.id} 
                  style={{ 
                    border: "1px solid #ddd", 
                    borderRadius: "8px", 
                    padding: "15px",
                    backgroundColor: "#f9f9f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>📄 {doc.titre}</h4>
                    <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
                      📅 Créé le: {new Date(doc.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#666" }}>
                      📊 Statut: <span style={{ 
                        color: doc.statut === 'valide' ? '#28a745' : doc.statut === 'en_attente' ? '#ffc107' : '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        {doc.statut || 'En attente'}
                      </span>
                    </p>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      onClick={() => handleDownload(doc.id, doc.titre)}
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                      title="Télécharger"
                    >
                      📥 Télécharger
                    </button>
                    
                    <button
                      onClick={() => handleDelete(doc.id)}
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.9rem"
                      }}
                      title="Supprimer"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentsClient;
