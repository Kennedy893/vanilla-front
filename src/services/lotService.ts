import { getAccessToken, getActiveOrganizationId } from "./authService";
import type { CreateLotRequest, CreateTransferRequest, Exploitation, FarmUpdateRequest, FarmWriteRequest, FarmsList, Lot, LotHistoryEvent, LotsList, LotStatus, PendingTransferItem } from "../types/types";

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const organizationId = getActiveOrganizationId(); // organisation active choisie par l'utilisateur

  if (!organizationId) {
    throw new Error("Aucune organisation active. Veuillez vous reconnecter.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(organizationId ? { "X-Organization-Id": String(organizationId) } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(extractErrorMessage(result));
  }

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

export function getExploitations(): Promise<Exploitation[]> {
  return request<Exploitation[]>("/api/farms");
}

export function getFarmsList(
  filters: { query?: string; limit?: number; offset?: number } = {}
): Promise<FarmsList> {
  const params = new URLSearchParams();
  if (filters.query?.trim()) params.set("q", filters.query.trim());
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));
  const query = params.toString();
  return request<FarmsList>(`/api/farms/list${query ? `?${query}` : ""}`);
}

export function createFarm(payload: FarmWriteRequest): Promise<Exploitation> {
  return request<Exploitation>("/api/farms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateFarm(farmId: number, payload: FarmUpdateRequest): Promise<Exploitation> {
  return request<Exploitation>(`/api/farms/${farmId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteFarm(farmId: number): Promise<void> {
  await request<unknown>(`/api/farms/${farmId}`, { method: "DELETE" });
}

export function createLot(payload: CreateLotRequest): Promise<Lot> {
  return request<Lot>("/api/lots", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getLots(
  filters: { status?: LotStatus; limit?: number; offset?: number } = {}
): Promise<LotsList> {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.offset) params.set("offset", String(filters.offset));
  const query = params.toString();
  return request<LotsList>(`/api/lots${query ? `?${query}` : ""}`);
}

export function getLotDetail(lotId: number): Promise<LotHistoryEvent[]> {
  return request<LotHistoryEvent[]>(`/api/lots/${lotId}/history`);
}

export function validateLot(lotId: number): Promise<void> {
  return request<void>(`/api/lots/${lotId}/validate`, {
    method: "POST",
  });
}

export function createTransfer(lotId: number, payload: CreateTransferRequest): Promise<void> {
  return request<void>(`/api/lots/${lotId}/transfer`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPendingTransfers(): Promise<PendingTransferItem[]> {
  return request<PendingTransferItem[]>("/api/pending_transfers");
}

export function validateTransfer(transferId: number, receiptDate: string): Promise<void> {
  return request<void>(`/api/pending_transfers/${transferId}/validate`, {
    method: "POST",
    body: JSON.stringify({ receipt_date: receiptDate }),
  });
}

export function rejectTransfer(transferId: number, reason: string): Promise<void> {
  return request<void>(`/api/pending_transfers/${transferId}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function archiveLot(lotId: number, reason: string): Promise<Lot> {
  return request<Lot>(`/api/lots/${lotId}/archive`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function unarchiveLot(lotId: number): Promise<Lot> {
  return request<Lot>(`/api/lots/${lotId}/unarchive`, {
    method: "POST",
  });
}