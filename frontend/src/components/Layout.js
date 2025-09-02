import React from "react";
import Header from "./Header";

function Layout({ children, userType = 'client' }) {
  const styles = {
    container: {
      minHeight: '100vh',
      paddingTop: '5rem', // Espace pour le header fixe
    },
    content: {
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: 'calc(100vh - 5rem)',
    }
  };

  return (
    <div style={styles.container}>
      <Header userType={userType} />
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Layout;
