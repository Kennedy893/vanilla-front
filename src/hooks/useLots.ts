import { useCallback, useEffect, useState } from "react";
import type { LotsList, LotStatus } from "../types/types";
import { getLots } from "../services/lotService";

export const PAGE_SIZE = 20;

export function useLots(status?: LotStatus, page = 1) {
  const [data, setData] = useState<LotsList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);

  const refresh = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchLots() {
      try {
        setLoading(true);
        setError(null);
        const result = await getLots({
          status,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        });
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLots();
    return () => { cancelled = true; };
  }, [status, page, refreshVersion]);

  return {
    lots: data?.items ?? [],
    total: data?.total ?? 0,
    statusCounts: data?.status_counts ?? null,
    loading,
    error,
    refresh,
  };
}