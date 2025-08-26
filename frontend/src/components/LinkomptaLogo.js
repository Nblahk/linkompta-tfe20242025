import React from 'react';

const LinkomptaLogo = ({ className = "", size = "200" }) => {
  return (
    <div className={`linkompta-logo ${className}`} style={{ width: size, height: 'auto' }}>
      <svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
        {/* Bouclier principal - forme exacte de votre logo */}
        <path
          d="M100 10 L170 30 L175 90 C175 130 140 170 100 190 C60 170 25 130 25 90 L30 30 Z"
          fill="#1e3a8a"
          stroke="#1e3a8a"
          strokeWidth="1"
        />
        
        {/* Zone blanche intérieure */}
        <path
          d="M100 20 L160 35 L164 90 C164 125 135 160 100 175 C65 160 36 125 36 90 L40 35 Z"
          fill="white"
        />
        
        {/* Poignée de main simple et réaliste */}
        <g fill="#1e3a8a">
          {/* Main gauche simplifiée */}
          <path d="M60 80 L85 95 L90 100 L85 105 L60 90 Z" fill="#1e3a8a"/>
          
          {/* Main droite simplifiée */}
          <path d="M140 80 L115 95 L110 100 L115 105 L140 90 Z" fill="#1e3a8a"/>
          
          {/* Zone de serrage central - simple et claire */}
          <rect x="85" y="95" width="30" height="10" rx="5" fill="#1e3a8a"/>
          
          {/* Poignets/manches */}
          <rect x="50" y="75" width="20" height="15" rx="3" fill="#1e3a8a"/>
          <rect x="130" y="75" width="20" height="15" rx="3" fill="#1e3a8a"/>
          
          {/* Détails pour montrer que c'est une poignée de main */}
          <circle cx="75" cy="90" r="3" fill="#1e3a8a"/> {/* Pouce gauche */}
          <circle cx="125" cy="90" r="3" fill="#1e3a8a"/> {/* Pouce droit */}
          
          {/* Ligne de jonction pour clarifier la poignée */}
          <line x1="85" y1="100" x2="115" y2="100" stroke="white" strokeWidth="2"/>
        </g>
      </svg>
      
      {/* Texte LINKOMPTA exactement comme dans votre logo */}
      <div style={{
        textAlign: 'center',
        marginTop: '15px',
        color: '#1e3a8a',
        fontSize: Math.max(size / 8, 20) + 'px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '3px'
      }}>
        LINKOMPTA
      </div>
    </div>
  );
};

export default LinkomptaLogo;
