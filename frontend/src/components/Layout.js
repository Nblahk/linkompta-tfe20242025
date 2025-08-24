import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, onLogout }) {
  const role = localStorage.getItem("role");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role={role} onLogout={onLogout} />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />
        
        {/* Zone de contenu */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
