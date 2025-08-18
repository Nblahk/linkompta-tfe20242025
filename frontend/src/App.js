import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";             // client
import DashboardComptable from "./components/DashboardComptable"; // comptable
import DashboardAdmin from "./components/DashboardAdmin";   // admin

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const role = localStorage.getItem("role");

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} />
      ) : role === "comptable" ? (
        <DashboardComptable token={token} />   // tableau de bord comptable
      ) : role === "admin" ? (
        <DashboardAdmin token={token} />       // tableau de bord admin
      ) : (
        <Dashboard token={token} />            // tableau de bord client
      )}
    </div>
  );
}

export default App;
