import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import FacturesClient from "./pages/FacturesClient";
import FacturesComptable from "./pages/FacturesComptable";
import DocumentsClient from "./pages/DocumentsClient";
import DocumentsComptable from "./pages/DocumentsComptable";
import RendezVousClient from "./pages/RendezVousClient";
import RendezVousComptable from "./pages/RendezVousComptable";
import ClientsComptable from "./pages/ClientsComptable";
import Messagerie from "./pages/Messagerie";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";
import Profil from "./pages/Profil";
import ClientProfil from "./pages/ClientProfil";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : {};
  });
  const role = user.role;

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUser({});
    window.location.href = "/?showLogin=true";
  };

  const handleLogin = (token, userData) => {
    setToken(token);
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={<HomePage onLogin={handleLogin} />} />
        
        {/* Routes protégées - ClientDashboard en dehors du Layout */}
        {token && role === "client" && (
          <>
            <Route path="/dashboard" element={<ClientDashboard token={token} />} />
            <Route path="/profil" element={<ClientProfil />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
        
        {/* Routes protégées - Autres rôles dans le Layout */}
        {token && role !== "client" && (
          <Route path="/*" element={
            <Layout onLogout={handleLogout}>
              <Routes>
                {/* Dashboard pour comptables et admins */}
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                
                {/* Routes communes */}
                <Route path="/profil" element={<Profil />} />
                <Route path="/messagerie" element={<Messagerie />} />
                
                {/* Routes Comptable */}
                {role === "comptable" && (
                  <>
                    <Route path="/comptable/clients" element={<ClientsComptable />} />
                    <Route path="/comptable/factures" element={<FacturesComptable />} />
                    <Route path="/comptable/documents" element={<DocumentsComptable />} />
                    <Route path="/comptable/rendezvous" element={<RendezVousComptable />} />
                  </>
                )}
                
                {/* Routes Admin */}
                {role === "admin" && (
                  <>
                    <Route path="/admin" element={<AdminPanel />} />
                  </>
                )}
                
                {/* Redirection par défaut selon le rôle */}
                <Route path="*" element={
                  role === "admin" ? <Navigate to="/admin" /> :
                  role === "comptable" ? <Navigate to="/comptable/documents" /> :
                  <Navigate to="/dashboard" />
                } />
              </Routes>
            </Layout>
          } />
        )}
        
        {/* Redirection si pas de token */}
        {!token && (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
