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

  // Fonction pour formater la taille du fichier
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 🔹 Charger les documents du client
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!token) {
        setError("Vous devez être connecté pour voir vos documents");
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const res = await api.get("documents/me/", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });
        setDocuments(res.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des documents :", err);
        if (err.response?.status === 401) {
          setError("Session expirée. Veuillez vous reconnecter.");
          localStorage.clear();
          navigate("/");
        } else {
          setError("Erreur lors du chargement des documents");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [token, navigate]);

  // 🔹 Upload d’un document
 const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier avant l'envoi");
      return;
    }

    // Vérification de la taille du fichier (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError(`Le fichier est trop volumineux. Taille maximale : ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    // Vérification du type de fichier
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError("Type de fichier non supporté. Formats acceptés : PDF, JPEG, PNG, DOC, DOCX");
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    // Log des données avant envoi
    console.log("Données envoyées :", {
      fileSize: file.size,
      fileType: file.type,
      fileName: file.name
    });

    try {
      const response = await api.post("documents/upload/", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data) {
        setFile(null);
        setUploadProgress(0);
        setError(null);
        
        // Recharge la liste
        const res = await api.get("documents/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDocuments(res.data);
      }
    } catch (err) {
      console.error("Erreur upload :", err);
      console.error("Détails de l'erreur :", err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else if (err.response?.data?.file) {
        setError(err.response.data.file[0]);
      } else if (err.response?.status === 413) {
        setError("Le fichier est trop volumineux pour le serveur");
      } else if (err.response?.status === 415) {
        setError("Type de fichier non supporté");
      } else {
        setError("Une erreur est survenue lors de l'envoi du document");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
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
                setUploadProgress(0);
              }
            }}
            style={{ marginRight: "1rem" }}
            disabled={loading}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <button 
            type="submit" 
            disabled={loading || !file}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: loading ? "#ccc" : "#1976d2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.3s"
            }}
          >
            {loading ? `Envoi en cours... ${uploadProgress}%` : "Uploader"}
          </button>

          {file && (
            <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#666" }}>
              Fichier sélectionné : {file.name} ({formatFileSize(file.size)})
            </div>
          )}

          {loading && uploadProgress > 0 && (
            <div style={{ marginTop: "10px", width: "100%", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
              <div
                style={{
                  width: `${uploadProgress}%`,
                  height: "10px",
                  backgroundColor: "#4caf50",
                  borderRadius: "4px",
                  transition: "width 0.3s"
                }}
              />
            </div>
          )}
        </div>
      </form>

      {/* Liste des documents */}
      <h3>Liste des documents envoyés</h3>
      {loading && !uploadProgress ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <div style={{ color: "#666" }}>Chargement...</div>
        </div>
      ) : documents.length === 0 ? (
        <div style={{ 
          textAlign: "center", 
          padding: "40px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          color: "#666" 
        }}>
          Aucun document disponible.
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
          gap: "20px",
          padding: "10px" 
        }}>
          {documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                padding: "20px",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                cursor: "pointer",
                border: "1px solid #e0e0e0"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                <strong style={{ fontSize: "1.1em" }}>{doc.title}</strong>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center",
                color: "#666",
                fontSize: "0.9em"
              }}>
                <span>
                  {doc.file_type && `Type: ${doc.file_type.split('/')[1].toUpperCase()}`}
                </span>
                <span>{doc.file_size && formatFileSize(doc.file_size)}</span>
              </div>

              <div style={{ 
                marginTop: "10px",
                padding: "5px 10px",
                borderRadius: "20px",
                display: "inline-block",
                fontSize: "0.9em",
                backgroundColor: 
                  doc.status === "traite" ? "#e8f5e9" :
                  doc.status === "en_cours" ? "#fff3e0" :
                  doc.status === "recu" ? "#e3f2fd" : "#f5f5f5",
                color:
                  doc.status === "traite" ? "#2e7d32" :
                  doc.status === "en_cours" ? "#f57c00" :
                  doc.status === "recu" ? "#1565c0" : "#616161"
              }}>
                {doc.status === "traite" ? "✅ Traité" : 
                 doc.status === "en_cours" ? "🔄 En cours" :
                 doc.status === "recu" ? "📥 Reçu" : "📤 Envoyé"}
              </div>

              <div style={{ 
                marginTop: "10px", 
                fontSize: "0.8em", 
                color: "#999" 
              }}>
                Envoyé le : {new Date(doc.uploaded_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DocumentsClient;
