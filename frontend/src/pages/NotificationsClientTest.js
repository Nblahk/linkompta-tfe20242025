import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationsClient = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          ← Retour au tableau de bord
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Notifications
        </h1>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <p>Page de notifications en test - Fonctionne ! 🎉</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsClient;
