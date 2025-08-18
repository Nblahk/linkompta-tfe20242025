import React, { useState } from "react";
import Login from "./components/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} />    // ➡️ si pas connecté → affiche Login
      ) : (
        <h2>Bienvenue ! Vous êtes connecté ✅</h2>   // ➡️ si connecté → message
      )}
    </div>
  );
}

export default App;
