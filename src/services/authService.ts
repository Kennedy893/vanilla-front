import type { LoginRequest, LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function login(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    }
  );

  if (!response.ok) {
    const result = await response.json().catch(() => null);

    throw new Error(
      result?.detail ?? "Échec de la connexion."
    );
  }

  return response.json() as Promise<LoginResponse>;
}