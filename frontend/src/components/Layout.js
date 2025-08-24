import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Button,
  Box
} from "@mui/material";
import { Receipt, Description, Event, Person } from "@mui/icons-material";  // ✅ Person ajouté
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  // 🔹 Récupérer infos utilisateur
  const username = localStorage.getItem("username") || "Utilisateur";
  const role = localStorage.getItem("role") || "client";
  const avatar = localStorage.getItem("avatar"); // ✅ futur support image

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#0d47a1",
            color: "white",
          },
        }}
      >
        <Toolbar />
        <List>
          <Toolbar>
            {/* 🔹 Logo titre Linkompta */}
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              LINKOMPTA 💼
            </Typography>
          </Toolbar>
            <ListItem onClick={() => navigate("/profil")} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Avatar style={{ width: 25, height: 25 }} /></ListItemIcon>
              <ListItemText primary="Mon Profil" />
            </ListItem>
            <ListItem onClick={() => navigate("/factures")} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Receipt style={{ color: "white" }} /></ListItemIcon>
              <ListItemText primary="Mes Factures" />
            </ListItem>
              <ListItem onClick={() => navigate("/documents")} sx={{ cursor: 'pointer' }}>
              <ListItemIcon><Description style={{ color: "white" }} /></ListItemIcon>
              <ListItemText primary="Mes Documents" />
            </ListItem>
            <ListItem onClick={() => navigate("/rendezvous")} sx={{ cursor: 'pointer' }}>
             <ListItemIcon><Event style={{ color: "white" }} /></ListItemIcon>
             <ListItemText primary="Mes Rendez-vous" />
            </ListItem>
          </List>
    </Drawer>

      {/* Contenu principal */}
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <AppBar
          position="fixed"
          sx={{
            ml: `${drawerWidth}px`,
            backgroundColor: "#1565c0",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: "20px"
          }}
        >
          <Toolbar>
            {/* 🔹 Titre dans la barre du haut */}
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ fontWeight: "bold", letterSpacing: 1 }}
            >
              LINKOMPTA 💼
            </Typography>
          </Toolbar>

          {/* 🔹 Section droite : utilisateur + bouton déconnexion */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {username} ({role})
            </Typography>

            {/* ✅ Avatar : photo si dispo, sinon Person 👤 */}
            {avatar ? (
              <Avatar alt={username} src={avatar} />
            ) : (
              <Avatar sx={{ bgcolor: "grey.400" }}>
                <Person />
              </Avatar>
            )}

            <Button
              variant="contained"
              color="error"
              onClick={onLogout}
              sx={{ textTransform: "none" }}
            >
              Déconnexion
            </Button>
          </Box>
        </AppBar>

        <Toolbar />
        {children}
      </main>
    </div>
  );
}

export default Layout;
