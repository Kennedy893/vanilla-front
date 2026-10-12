
import { useState, useCallback } from "react";
import { login } from "../services/authService";
import type { LoginRequest } from "../types/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      setLoading(true);
      setError(null);

      try {
        const result = await login(credentials);

        sessionStorage.setItem(
          "access_token",
          result.access_token
        );

        return result;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Une erreur est survenue.";

        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    handleLogin,
    loading,
    error,
  };
}
