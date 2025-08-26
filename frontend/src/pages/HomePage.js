import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LinkomptaLogo from '../components/LinkomptaLogo';
// import '../styles/HomePage.css';

const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Styles en ligne temporaires
  const styles = {
    homepage: {
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)',
    },
    homepageContent: {
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      padding: '2rem',
      gap: '4rem',
      position: 'relative',
      zIndex: 1,
    },
    brandingSection: {
      flex: 1,
      maxWidth: '600px',
      color: 'white',
      padding: '2rem',
    },
    brandTitle: {
      fontSize: '4rem',
      fontWeight: 900,
      margin: '1rem 0',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      letterSpacing: '3px',
      textAlign: 'center',
    },
    brandSubtitle: {
      fontSize: '1.5rem',
      marginBottom: '2rem',
      opacity: 0.9,
      fontWeight: 300,
      textAlign: 'center',
    },
    loginSection: {
      flex: '0 0 450px',
      padding: '2rem',
      opacity: showLogin ? 1 : 0,
      transform: showLogin ? 'translateX(0)' : 'translateX(50px)',
      transition: 'all 0.8s ease-out',
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '2.5rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      marginBottom: '2rem',
    },
    loginHeader: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    loginInput: {
      width: '100%',
      padding: '1rem 1.2rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      background: '#ffffff',
    },
    loginBtn: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    demoSection: {
      marginTop: '2rem',
      paddingTop: '1.5rem',
    },
    demoButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
    },
    demoBtn: {
      flex: 1,
      background: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '8px',
      fontSize: '0.9rem',
      textAlign: 'center',
      border: '1px solid #fecaca',
    },
  };

  // Animation d'apparition progressive
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirection selon le rôle
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else if (data.user.role === 'comptable') {
          navigate('/comptable/documents');
        } else {
          navigate('/client/documents');
        }
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    if (userType === 'client') {
      setEmail('sophie.merle');
      setPassword('password123');
    } else if (userType === 'comptable') {
      setEmail('comptable.paul.dupont');
      setPassword('password123');
    }
  };

  return (
    <div style={styles.homepage}>
      {/* Contenu principal */}
      <div style={styles.homepageContent}>
        {/* Section gauche - Branding */}
        <div style={styles.brandingSection}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <LinkomptaLogo size="180" />
          </div>
          
          <div>
            <h1 style={styles.brandTitle}>LINKOMPTA</h1>
            <p style={styles.brandSubtitle}>
              Votre partenaire comptable digital
            </p>
            <div style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
              <p style={{ fontSize: '1.1rem', margin: '0.8rem 0', paddingLeft: '1rem', opacity: 0.85 }}>✓ Gestion documentaire sécurisée</p>
              <p style={{ fontSize: '1.1rem', margin: '0.8rem 0', paddingLeft: '1rem', opacity: 0.85 }}>✓ Suivi en temps réel</p>
              <p style={{ fontSize: '1.1rem', margin: '0.8rem 0', paddingLeft: '1rem', opacity: 0.85 }}>✓ Communication simplifiée</p>
              <p style={{ fontSize: '1.1rem', margin: '0.8rem 0', paddingLeft: '1rem', opacity: 0.85 }}>✓ Expertise comptable professionnelle</p>
            </div>
          </div>
        </div>

        {/* Section droite - Connexion */}
        <div style={styles.loginSection}>
          <div style={styles.loginCard}>
            <div style={styles.loginHeader}>
              <h2 style={{ color: '#1e3a8a', fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Connexion</h2>
              <p style={{ color: '#64748b', fontSize: '1rem' }}>Accédez à votre espace personnel</p>
            </div>

            <form onSubmit={handleLogin} style={styles.loginForm}>
              <div>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.loginInput}
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={styles.loginInput}
                />
              </div>

              {error && <div style={styles.errorMessage}>{error}</div>}

              <button 
                type="submit" 
                style={{
                  ...styles.loginBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <a href="#forgot" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.9rem' }}>Mot de passe oublié ?</a>
            </div>

            {/* Section démo */}
            <div style={styles.demoSection}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#e2e8f0' }}></div>
                <span style={{ background: 'white', padding: '0 1rem', color: '#64748b', fontSize: '0.9rem', position: 'relative' }}>Découvrir l'application</span>
              </div>
              
              <div style={styles.demoButtons}>
                <button 
                  onClick={() => handleDemoLogin('client')}
                  style={styles.demoBtn}
                >
                  <span style={{ fontSize: '1.5rem' }}>👤</span>
                  Démo Client
                  <small style={{ color: '#64748b', fontSize: '0.8rem' }}>Sophie Merle</small>
                </button>
                
                <button 
                  onClick={() => handleDemoLogin('comptable')}
                  style={styles.demoBtn}
                >
                  <span style={{ fontSize: '1.5rem' }}>💼</span>
                  Démo Comptable
                  <small style={{ color: '#64748b', fontSize: '0.8rem' }}>Paul Dupont</small>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
