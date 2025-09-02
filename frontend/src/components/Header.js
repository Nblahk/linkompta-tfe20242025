import React from "react";

function Header({ userType = 'client' }) {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>LINKOMPTA</div>
      <div>Header Simple - {userType}</div>
    </header>
  );
}

export default Header;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await api.get("users/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };

    if (token) {
      fetchUserInfo();
    }
  }, [token]);

  // Charger l'image de profil depuis localStorage
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem('profileImage');
      setProfileImage(updatedImage);
    };

    window.addEventListener('storage', handleStorageChange);
    
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('profileImage');
    navigate('/');
  };

  const handleProfileClick = () => {
    if (role === 'client' || userType === 'client') {
      navigate('/client-profil');
    } else if (userType === 'admin') {
      navigate('/admin-panel');
    } else {
      navigate('/profil');
    }
  };

  const handleLogoClick = () => {
    if (role === 'client' || userType === 'client') {
      navigate('/client-dashboard');
    } else if (userType === 'admin') {
      navigate('/admin-panel');
    } else {
      navigate('/dashboard');
    }
  };

  const styles = {
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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
      cursor: 'pointer',
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
      cursor: 'pointer',
    },
  };

  return (
    <header style={styles.header}>
      {/* Section Logo */}
      <div style={styles.logoSection}>
        <div style={styles.logoText} onClick={handleLogoClick}>
          LINKOMPTA
        </div>
      </div>

      {/* Section Recherche */}
      <div style={styles.searchSection}>
        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Rechercher..."
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Section Utilisateur */}
      <div style={styles.userInfo}>
        <span style={{ fontSize: '1.2rem' }}>🔔</span>
        <button
          onClick={handleProfileClick}
          style={styles.userName}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #e2e8f0, #cbd5e1)';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(226, 232, 240, 0.4)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          {user ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
        </button>
        <div
          style={{
            ...styles.avatar,
            backgroundImage: profileImage ? `url(${profileImage})` : 'none'
          }}
          onClick={handleProfileClick}
        >
          {!profileImage && (user ? user.first_name?.[0]?.toUpperCase() || 'U' : 'U')}
        </div>
        <button
          onClick={handleLogout}
          style={styles.logoutButton}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)';
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Déconnexion
        </button>
      </div>
    </header>
  );
}

export default Header;
