import React from "react";
import { useNavigate } from "react-router-dom";

const AppContent = ({ token, setToken, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    navigate("/?showLogin=true");
  };

  return { handleLogout };
};

export default AppContent;
