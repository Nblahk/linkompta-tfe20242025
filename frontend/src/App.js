import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FacturesClient from "./pages/FacturesClient";
import DocumentsClient from "./pages/DocumentsClient";
import RendezVousClient from "./pages/RendezVousClient";
import Layout from "./components/Layout";

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
            <Route path="/factures" element={<FacturesClient />} />
            <Route path="/documents" element={<DocumentsClient />} />
            <Route path="/rendezvous" element={<RendezVousClient />} />
          </Routes>
        </Layout>
      )}
    </Router>
  );
}

export default App;
