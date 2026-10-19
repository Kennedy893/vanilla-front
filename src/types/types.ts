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


// ---------------------------------------------------------------------------
// Détail d'un lot : GET /lots/{id}  (en-tête du lot + chronologie)
// ---------------------------------------------------------------------------
 
export type EventType =
  | "harvest"
  | "collection"
  | "transfer"
  | "processing"
  | "quality_check"
  | "storage"
  | "shipment"
  | "export";
 
export type EventStatus = "pending" | "validated" | "rejected" | "cancelled";
 
export type EventLotRole = "input" | "output" | "transferred";
 
export type QualityResult = "passed" | "failed" | "conditional";
 
// Rempli uniquement pour les événements de type "quality_check"
export interface QualityCheckSummary {
  result: QualityResult;
  grade: string | null;
  moisture_percentage: string | null; // Decimal côté Python => string en JSON
  comments: string | null;
  checked_by: string; // nom d'utilisateur du contrôleur
}
 
// Une entrée de la chronologie (schéma LotHistoryEvent)
export interface LotHistoryEvent {
  event_id: number;
  event_code: string;
  event_type: EventType | null;
  event_date: string | null; // ISO 8601, sans fuseau
  status: EventStatus;
  description: string | null;
  location_name: string;
  organization_name: string | null;
  recorded_by: string;
  validated_by: string | null;
  validated_at: string | null;
  role: EventLotRole | null;
  quantity_kg: string | null;
  quality_check: QualityCheckSummary | null;
}
 
export interface LotHolder {
  id: number;
  name: string | null;
}
 
export interface LotDetail {
  id: number;
  lot_code: string;
  lot_type: "harvest" | "raw" | "intermediate" | "finished";
  product_state: string | null;
  quantity_kg: string;
  status: LotStatus | null;
  created_at: string | null;
  updated_at: string | null;
  farm: LotFarm;
  holder: LotHolder;
  events: LotHistoryEvent[]; // du plus ancien au plus récent
}

export interface TransferOrganization {
  id: number;
  name: string;
}

export interface TransferLocation {
  id: number;
  name: string;
}

export interface CreateTransferRequest {
  to_organization_id: number;
  destination_location_id: number;
  dispatch_date: string;
  notes?: string;
}

export interface Organization {
  id: number;
  name: string;
  organization_type: string | null;
  created_at: string | null;
}

export interface Location {
  id: number;
  name: string;
  location_type: string | null;
  latitude: number;
  longitude: number;
}

export interface PendingTransferItem {
  transfer_id: number;
  event_code: string;
  dispatch_date: string | null;
  from_organization_id: number;
  from_organization_name: string | null;
  sent_by: string;
  origin_location_name: string;
  destination_location_name: string;
  notes: string | null;
  lot_id: number;
  lot_code: string;
  quantity_kg: number;
  product_state: string | null;
}