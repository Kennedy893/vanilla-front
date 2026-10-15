// Contrat avec l'API FastAPI : mêmes noms de champs que les schémas Pydantic.

export interface Exploitation {
  id: number;
  farm_code: string;
  name: string | null;
  area_hectares: string | null; // Decimal côté Python => string en JSON
  location_id: number;
  producer_organization_id: number;
  created_at: string | null;
}

export interface CreateLotRequest {
  farm_id: number;
  quantity_kg: number;
  harvest_date: string; // "YYYY-MM-DD"
  notes?: string;
}

export type LotStatus =
  | "created"
  | "available"
  | "in_transfer"
  | "processing"
  | "blocked"
  | "exported"
  | "archived";

export interface Lot {
  id: number;
  lot_code: string;
  lot_type: "harvest" | "raw" | "intermediate" | "finished";
  product_state: string | null;
  quantity_kg: string; // Decimal côté Python => string en JSON
  status: LotStatus | null;
  farm_id: number;
  holder_id: number;
  created_at: string | null;
  updated_at: string | null;
}

// Exploitation incluse dans la réponse de la liste des lots
export interface LotFarm {
  id: number;
  farm_code: string;
  name: string | null;
}

// Lot avec les informations de son exploitation
export interface LotListItem extends Lot {
  farm: LotFarm;
  harvest_date: string | null;
}

// Nombre de lots par statut
export interface LotStatusCounts {
  created: number;
  available: number;
  in_transfer: number;
  processing: number;
  blocked: number;
  exported: number;
  archived: number;
}

// Réponse de l'API pour la liste paginée des lots
export interface LotsList {
  items: LotListItem[];
  total: number;
  limit: number;
  offset: number;
  status_counts: LotStatusCounts;
}