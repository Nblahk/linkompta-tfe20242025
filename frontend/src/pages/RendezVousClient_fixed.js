import React from "react";
import { useNavigate } from "react-router-dom";

function RendezVousClient() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

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
        
        <h2>📅 Mes rendez-vous</h2>
        <p>Ici tu verras tes demandes de rendez-vous.</p>
      </div>
    </div>
  );
}

export default RendezVousClient;
