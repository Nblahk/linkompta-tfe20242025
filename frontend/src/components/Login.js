import React, { useState } from "react";
import api from "../api/axios";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🔹 Étape 1 : récupérer un token JWT
      const res = await api.post("token/", { username, password });
      localStorage.setItem("token", res.data.access);
      setToken(res.data.access);

      // 🔹 Étape 2 : utiliser ce token pour récupérer l'utilisateur connecté
      const userRes = await api.get("users/me/", {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      // 🔹 On stocke le rôle ET le username dans localStorage
      localStorage.setItem("role", userRes.data.role);
      localStorage.setItem("username", userRes.data.username);

      alert(`Connexion réussie ✅ Bienvenue ${userRes.data.username} (${userRes.data.role})`);
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
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
    </form>
  );
}

export default Login;
