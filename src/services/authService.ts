import type { LoginRequest, LoginResponse } from "../types/auth";

const ACTIVE_ORGANIZATION_KEY = "active_organization_id";

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

export function logout(): void {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
}

// helper pour récupérer le token
export function getAccessToken(): string | null {
  return sessionStorage.getItem("access_token");
}

export function setUserName(username: string): void {
  sessionStorage.setItem("username", username);
}

export function getUserName(): string | null {
  return sessionStorage.getItem("username");
}

export function getActiveOrganizationId(): number | null {
  const value = sessionStorage.getItem(ACTIVE_ORGANIZATION_KEY);
  if (!value) return null;

  const organizationId = Number(value);
  return Number.isInteger(organizationId) && organizationId > 0
    ? organizationId
    : null;
}

export function setActiveOrganizationId(organizationId: number): void {
  sessionStorage.setItem(ACTIVE_ORGANIZATION_KEY, String(organizationId));
}

export function setActiveOrganizationRole(role: string): void {
  sessionStorage.setItem("active_organization_role", role);
}

export function getActiveOrganizationRole(): string | null {
  return sessionStorage.getItem("active_organization_role");
}

// helper pour savoir si connecté
export function isAuthenticated(): boolean {
  return Boolean(sessionStorage.getItem("access_token"));
}