import { getAccessToken, getActiveOrganizationId } from "./authService";
import type { CreateLotRequest, CreateTransferRequest, Exploitation, Lot, LotHistoryEvent, LotsList, LotStatus, Organization } from "../types/types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

/** FastAPI renvoie `detail` en string (403, 404...) ou en tableau d'objets (422). */
function extractErrorMessage(result: unknown): string {
  const detail = (result as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((d) => (d as { msg?: string }).msg)
      .filter((msg): msg is string => Boolean(msg))
      .map((msg) => msg.replace(/^Value error, /, ""));
    if (messages.length > 0) return messages.join(" ");
  }
  return "Une erreur est survenue.";
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(extractErrorMessage(result));
  }

  return response.json() as Promise<T>;
}

export function getLocations(): Promise<Location[]> {
    return request<Location[]>("/api/locations");
}

export function getOrganizations(): Promise<Organization[]> {
    return request<Organization[]>("/api/organizations");
}