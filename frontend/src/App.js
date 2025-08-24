import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
  };

  return (
    <Router>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            
            {/* Routes communes */}
            <Route path="/profil" element={<Profil />} />
            <Route path="/messagerie" element={<Messagerie />} />
            
            {/* Routes Client */}
            {role === "client" && (
              <>
                <Route path="/factures" element={<FacturesClient />} />
                <Route path="/documents" element={<DocumentsClient />} />
                <Route path="/rendezvous" element={<RendezVousClient />} />
              </>
            )}
            
            {/* Routes Comptable */}
            {role === "comptable" && (
              <>
                <Route path="/clients" element={<ClientsComptable />} />
                <Route path="/factures" element={<FacturesComptable />} />
                <Route path="/documents" element={<DocumentsComptable />} />
                <Route path="/rendezvous" element={<RendezVousComptable />} />
              </>
            )}
            
            {/* Routes Admin */}
            {role === "admin" && (
              <>
                <Route path="/admin" element={<AdminPanel />} />
              </>
            )}
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
