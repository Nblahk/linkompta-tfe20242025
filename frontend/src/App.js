import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
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

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Page d'accueil publique */}
        <Route path="/" element={!token ? <HomePage /> : <Navigate to="/dashboard" />} />
        
        {/* Routes protégées */}
        {token ? (
          <Route path="/*" element={
            <Layout onLogout={handleLogout}>
              <Routes>
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                
                {/* Routes communes */}
                <Route path="/profil" element={<Profil />} />
                <Route path="/messagerie" element={<Messagerie />} />
                
                {/* Routes Client */}
                {role === "client" && (
                  <>
                    <Route path="/client/factures" element={<FacturesClient />} />
                    <Route path="/client/documents" element={<DocumentsClient />} />
                    <Route path="/client/rendezvous" element={<RendezVousClient />} />
                  </>
                )}
                
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
                  <Navigate to="/client/documents" />
                } />
              </Routes>
            </Layout>
          } />
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
