import React, { useState } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material"; // ✅ icône par défaut

function Profil() {
  const [username] = useState(localStorage.getItem("username") || "");
  const [role] = useState(localStorage.getItem("role") || "client");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

  // 🔹 Changer l’avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Supprimer l’avatar (revient à l’icône par défaut)
  const handleDeleteAvatar = () => {
    setAvatar("");
    localStorage.removeItem("avatar");
  };

  // 🔹 Sauvegarder
  const handleSave = () => {
    if (avatar) {
      localStorage.setItem("avatar", avatar);
    }
    alert("Profil mis à jour ✅");
    window.location.reload(); // recharge le Layout pour montrer l’avatar
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 5, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Mon Profil
      </Typography>

      {/* ✅ Avatar ou icône par défaut */}
      {avatar ? (
        <Avatar
          src={avatar}
          alt="Avatar"
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />
      ) : (
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mx: "auto",
            mb: 2,
            bgcolor: "grey.400",
          }}
        >
          <PersonIcon sx={{ fontSize: 60 }} /> {/* 👤 icône dessin par défaut */}
        </Avatar>
      )}

      {/* ✅ Boutons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
        <Button variant="contained" component="label" color="primary">
          Changer la photo
          <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
        </Button>

        {avatar && (
          <Button variant="outlined" color="error" onClick={handleDeleteAvatar}>
            Supprimer
          </Button>
        )}
      </Box>

      <Box>
        <TextField
          label="Nom d'utilisateur"
          value={username}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
        <TextField
          label="Rôle"
          value={role}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />
      </Box>

      <Button
        variant="contained"
        color="success"
        onClick={handleSave}
        sx={{ textTransform: "none" }}
      >
        Sauvegarder
      </Button>
    </Box>
  );
}

export default Profil;
