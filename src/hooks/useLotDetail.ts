import { useEffect, useState } from "react";
import { getLotDetail } from "../services/lotService";
import type { LotHistoryEvent } from "../types/types";

export function useLotDetail(lotId: number | undefined) {
  const [events, setEvents] = useState<LotHistoryEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Identifiant absent ou invalide dans l'URL (ex. /lots/abc) : inutile d'appeler l'API
    if (lotId === undefined || !Number.isInteger(lotId) || lotId <= 0) {
      setEvents([]);
      setError("Identifiant de lot invalide.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchLot(id: number) {
      try {
        setLoading(true);
        setError(null);
        const result = await getLotDetail(id);
        if (!cancelled) setEvents(result);
      } catch (err) {
        if (!cancelled) {
          setEvents([]);
          setError(
            err instanceof Error
              ? err.message
              : "Une erreur est survenue lors du chargement du lot."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLot(lotId);
    return () => {
      cancelled = true;
    };
  }, [lotId]);

  // Dernier contrôle qualité VALIDÉ (les événements arrivent du plus ancien au plus récent).
  // Un contrôle en attente ou rejeté ne doit pas devenir l'état qualité du lot.
  const lastQualityEvent =
    [...events].reverse().find((e) => e.quality_check && e.status === "validated") ?? null;

  return { events, lastQualityEvent, loading, error };
}