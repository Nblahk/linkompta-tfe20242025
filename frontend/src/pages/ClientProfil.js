import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ClientProfil() {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/?showLogin=true");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const userRes = await api.get("users/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(userRes.data);
        setFormData(userRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement du profil");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, navigate]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setFormData(userInfo); // Reset les données si on annule
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put("users/me/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserInfo(response.data);
      setIsEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    backButton: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    userName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    logoutButton: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.5rem 1rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    avatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.5rem',
      fontWeight: '600',
    },
    profileCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '3rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      maxWidth: '800px',
      margin: '0 auto',
    },
    profileHeader: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    profileTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    profileSubtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
    },
    avatarLarge: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '3rem',
      fontWeight: '600',
      margin: '0 auto 2rem auto',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      background: 'white',
    },
    inputFocused: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    readOnlyField: {
      background: '#f9fafb',
      color: '#6b7280',
      fontSize: '1rem',
      padding: '0.75rem 1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      display: 'block',
      width: '100%',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    editButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    saveButton: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    cancelButton: {
      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '0.75rem 2rem',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '1.2rem',
      color: '#64748b',
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingSpinner}>
          Chargement de votre profil...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.loadingSpinner, color: '#dc2626' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={handleBackToDashboard}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          ← Retour au tableau de bord
        </button>
        <div style={styles.userInfo}>
          <span style={styles.userName}>
            {userInfo.first_name} {userInfo.last_name}
          </span>
          <div style={styles.avatar}>
            {userInfo.first_name?.[0]}{userInfo.last_name?.[0]}
          </div>
          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileHeader}>
          <div style={styles.avatarLarge}>
            {userInfo.first_name?.[0]}{userInfo.last_name?.[0]}
          </div>
          <h1 style={styles.profileTitle}>Mon Profil</h1>
          <p style={styles.profileSubtitle}>
            Gérez vos informations personnelles
          </p>
        </div>

        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Prénom</label>
            {isEditing ? (
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            ) : (
              <div style={styles.readOnlyField}>{userInfo.first_name}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Nom de famille</label>
            {isEditing ? (
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            ) : (
              <div style={styles.readOnlyField}>{userInfo.last_name}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            ) : (
              <div style={styles.readOnlyField}>{userInfo.email}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Téléphone</label>
            {isEditing ? (
              <input
                type="tel"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            ) : (
              <div style={styles.readOnlyField}>{userInfo.telephone || 'Non renseigné'}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Adresse</label>
            {isEditing ? (
              <input
                type="text"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleInputChange}
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            ) : (
              <div style={styles.readOnlyField}>{userInfo.adresse || 'Non renseignée'}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Rôle</label>
            <div style={styles.readOnlyField}>Client</div>
          </div>
        </div>

        <div style={styles.buttonGroup}>
          {isEditing ? (
            <>
              <button 
                style={styles.saveButton}
                onClick={handleSave}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Sauvegarder
              </button>
              <button 
                style={styles.cancelButton}
                onClick={handleEditToggle}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Annuler
              </button>
            </>
          ) : (
            <button 
              style={styles.editButton}
              onClick={handleEditToggle}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Modifier mon profil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientProfil;
