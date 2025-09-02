import React from "react";
import { useNavigate } from "react-router-dom";

function MessagesClient() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      {/* Bouton retour en haut */}
      <div style={{ padding: "10px 20px", backgroundColor: "#f8f9fa", borderBottom: "1px solid #e9ecef" }}>
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
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
          onClick={handleBackToDashboard}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          ← Retour au tableau de bord
        </button>
      </div>
      
      <div style={{ padding: "20px" }}>
        <h2>✉️ Ma messagerie</h2>
        <p>Ici tu verras tes messages échangés avec ton comptable.</p>
      </div>
    </div>
  );
}

export default MessagesClient;
