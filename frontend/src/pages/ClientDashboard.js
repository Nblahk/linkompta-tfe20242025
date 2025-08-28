import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ClientDashboard() {
  const [userInfo, setUserInfo] = useState({});
  const [documents, setDocuments] = useState([]);
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/?showLogin=true");
  };

  const handleProfileClick = () => {
    navigate("/profil");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // Récupérer les infos utilisateur
        const userRes = await api.get("users/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(userRes.data);

        // Récupérer les documents
        const docsRes = await api.get("documents/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(docsRes.data);

        // Récupérer les factures
        const facturesRes = await api.get("factures/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFactures(facturesRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Charger l'image de profil depuis localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Écouter les changements de localStorage pour mettre à jour l'image
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem('profileImage');
      setProfileImage(updatedImage);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Écouter les changements locaux (même fenêtre)
    const checkForChanges = () => {
      const currentImage = localStorage.getItem('profileImage');
      if (currentImage !== profileImage) {
        setProfileImage(currentImage);
      }
    };

    const interval = setInterval(checkForChanges, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [profileImage]);

  // Calculs des statistiques
  const totalFactures = factures.reduce((sum, f) => sum + parseFloat(f.montant || 0), 0);
  const facturesEnAttente = factures.filter(f => f.statut === 'en_attente').length;
  const documentsCount = documents.length;

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
    logoSection: {
      flex: '0 0 auto',
      display: 'flex',
      alignItems: 'center',
    },
    logoText: {
      fontSize: '1.8rem',
      fontWeight: '900',
      color: '#1e293b',
      letterSpacing: '2px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    },
    searchSection: {
      flex: '1',
      display: 'flex',
      justifyContent: 'center',
      maxWidth: '500px',
      margin: '0 2rem',
    },
    searchBar: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
    },
    searchInput: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 3rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      background: 'white',
      transition: 'all 0.3s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
      fontSize: '1.2rem',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      flex: '0 0 auto',
    },
    userName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      background: 'rgba(226, 232, 240, 0.4)',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
    },
    userNameHover: {
      background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
      transform: 'translateY(-1px)',
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
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      overflow: 'hidden',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease',
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
    statLabel: {
      color: '#64748b',
      fontSize: '0.9rem',
      fontWeight: '500',
    },
    mainContent: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '2rem',
    },
    section: {
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      border: '1px solid #f1f5f9',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      color: '#1e293b',
    },
    actionButton: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      padding: '0.75rem 1.5rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    documentItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      border: '1px solid #f1f5f9',
      borderRadius: '10px',
      marginBottom: '0.75rem',
      transition: 'all 0.3s ease',
    },
    documentInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    documentIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem',
    },
    documentName: {
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '0.25rem',
    },
    documentMeta: {
      fontSize: '0.8rem',
      color: '#64748b',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '500',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
      fontSize: '1.2rem',
      color: '#64748b',
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingSpinner}>
        Chargement de votre tableau de bord...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.loadingSpinner, color: '#dc2626' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        {/* Logo Section */}
        <div style={styles.logoSection}>
          <div style={styles.logoText}>LINKOMPTA</div>
        </div>
        
        {/* Search Section */}
        <div style={styles.searchSection}>
          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Rechercher"
              style={styles.searchInput}
            />
          </div>
        </div>
        
        {/* User Info Section */}
        <div style={styles.userInfo}>
          <span>🔔</span>
          <button 
            style={styles.userName}
            onClick={handleProfileClick}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #e2e8f0, #cbd5e1)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(226, 232, 240, 0.4)';
              e.target.style.transform = 'translateY(0)';
            }}
            title="Voir mon profil"
          >
            {userInfo.first_name} {userInfo.last_name}
          </button>
          <div style={styles.avatar}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Photo de profil" 
                style={styles.avatarImage}
              />
            ) : (
              `${userInfo.first_name?.[0] || ''}${userInfo.last_name?.[0] || ''}`
            )}
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

      {/* Statistics Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalFactures.toFixed(2)} €</div>
          <div style={styles.statLabel}>Total factures</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{facturesEnAttente}</div>
          <div style={styles.statLabel}>Factures en attente</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{documentsCount}</div>
          <div style={styles.statLabel}>Documents</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Documents Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Mes Documents</h2>
            <button 
              style={styles.actionButton}
              onClick={() => navigate('/client/documents')}
            >
              📄 Voir tous
            </button>
          </div>
          
          {documents.slice(0, 5).map((doc, index) => (
            <div key={index} style={styles.documentItem}>
              <div style={styles.documentInfo}>
                <div style={styles.documentIcon}>📄</div>
                <div>
                  <div style={styles.documentName}>{doc.titre || 'Document'}</div>
                  <div style={styles.documentMeta}>
                    {new Date(doc.date_creation).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              <div style={{
                ...styles.statusBadge,
                background: doc.statut === 'valide' ? '#dcfce7' : '#fef3c7',
                color: doc.statut === 'valide' ? '#166534' : '#92400e'
              }}>
                {doc.statut || 'En cours'}
              </div>
            </div>
          ))}
        </div>

        {/* Factures Section */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Mes Factures</h2>
            <button 
              style={styles.actionButton}
              onClick={() => navigate('/client/factures')}
            >
              💰 Voir toutes
            </button>
          </div>
          
          {factures.slice(0, 5).map((facture, index) => (
            <div key={index} style={styles.documentItem}>
              <div style={styles.documentInfo}>
                <div style={{...styles.documentIcon, background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>💰</div>
                <div>
                  <div style={styles.documentName}>Facture #{facture.numero || index + 1}</div>
                  <div style={styles.documentMeta}>
                    {facture.montant}€ - {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
              <div style={{
                ...styles.statusBadge,
                background: facture.statut === 'payee' ? '#dcfce7' : facture.statut === 'en_attente' ? '#fef3c7' : '#fee2e2',
                color: facture.statut === 'payee' ? '#166534' : facture.statut === 'en_attente' ? '#92400e' : '#dc2626'
              }}>
                {facture.statut || 'En attente'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientDashboard;
