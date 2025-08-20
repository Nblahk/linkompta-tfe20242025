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
import { Receipt, Description, Event } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

function Layout({ children, onLogout }) {
  const navigate = useNavigate();

  // 🔹 Récupérer infos utilisateur
  const username = localStorage.getItem("username") || "Utilisateur";
  const role = localStorage.getItem("role") || "client";

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
          <ListItem button onClick={() => navigate("/factures")}>
            <ListItemIcon><Receipt style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Mes Factures" />
          </ListItem>
          <ListItem button onClick={() => navigate("/documents")}>
            <ListItemIcon><Description style={{ color: "white" }} /></ListItemIcon>
            <ListItemText primary="Mes Documents" />
          </ListItem>
          <ListItem button onClick={() => navigate("/rendezvous")}>
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

          {/* 🔹 Section droite : utilisateur + bouton déconnexion */}
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {username} ({role})
            </Typography>
            <Avatar alt={username} src="/static/images/avatar/1.jpg" /> {/* image de profil */}
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
