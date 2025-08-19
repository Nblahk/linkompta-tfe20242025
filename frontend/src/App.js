import React, { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";             
import DashboardComptable from "./components/DashboardComptable"; 
import DashboardAdmin from "./components/DashboardAdmin";   
import Header from "./components/Header";   // ✅ nouveau header

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    setToken(null);
  };

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Header onLogout={handleLogout} />  {/* ✅ le header apparaît */}
          {role === "comptable" ? (
            <DashboardComptable token={token} />
          ) : role === "admin" ? (
            <DashboardAdmin token={token} />
          ) : (
            <Dashboard token={token} />
          )}
        </>
      )}
    </div>
  );
}

export default App;
