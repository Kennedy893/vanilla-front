import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logout as logoutService } from "../services/authService";

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    // 1. Nettoyer le token
    logoutService();

    // 2. Rediriger vers la page de connexion
    navigate("/login", { replace: true });
  }, [navigate]);

  return { handleLogout };
}