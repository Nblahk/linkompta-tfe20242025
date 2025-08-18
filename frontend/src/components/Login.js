import React, { useState } from "react";
import api from "../api/axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Appel à Django pour obtenir un token
      const res = await api.post("token/", { username, password });   // ➡️ endpoint /api/token/
      localStorage.setItem("token", res.data.access);                 // ➡️ stocke le token
      setToken(res.data.access);                                      // ➡️ informe App.js
      alert("Connexion réussie !");
    } catch (err) {
      alert("Échec de connexion : vérifie tes identifiants");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}   // ➡️ met à jour username
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}   // ➡️ met à jour password
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default Login;
