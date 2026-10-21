import { useCallback, useEffect, useState } from "react";
import { getFarmsList } from "../services/lotService";
import type { FarmListItem } from "../types/types";

export const FARM_PAGE_SIZE = 20;

export function useFarms(query: string, page: number) {
  const [items, setItems] = useState<FarmListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const refresh = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchFarms() {
      try {
        setLoading(true);
        setError(null);
        const result = await getFarmsList({
          query,
          limit: FARM_PAGE_SIZE,
          offset: (page - 1) * FARM_PAGE_SIZE,
        });
        if (!cancelled) {
          setItems(result.items);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Une erreur est survenue.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFarms();
    return () => { cancelled = true; };
  }, [query, page, refreshVersion]);

  return { items, total, loading, error, refresh };
}