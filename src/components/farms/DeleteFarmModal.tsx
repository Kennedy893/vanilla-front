import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { deleteFarm } from "../../services/lotService";
import type { FarmListItem } from "../../types/types";

type DeleteFarmModalProps = {
  farm: FarmListItem;
  onClose: () => void;
  onDeleted: () => void;
};

export default function DeleteFarmModal({ farm, onClose, onDeleted }: DeleteFarmModalProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await deleteFarm(farm.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "La suppression a échoué.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4 backdrop-blur-sm" onClick={() => !deleting && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="delete-farm-title" className="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-stone-200" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-700"><AlertTriangle className="h-5 w-5" /></span><div><h2 id="delete-farm-title" className="text-lg font-semibold text-stone-900">Supprimer l'exploitation ?</h2><p className="mt-1 text-sm text-stone-600">« {farm.name || farm.farm_code} » sera supprimée définitivement.</p></div></div>
          <button type="button" onClick={onClose} disabled={deleting} aria-label="Fermer" className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <p className="text-sm text-stone-600">Une exploitation utilisée par un ou plusieurs lots ne peut pas être supprimée.</p>
          {error && (
            <div role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              <p className="font-semibold">Suppression impossible</p>
              <p className="mt-1">{error}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4"><button type="button" onClick={onClose} disabled={deleting} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 disabled:opacity-50">Annuler</button><button type="button" onClick={handleDelete} disabled={deleting} className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60">{deleting ? "Suppression…" : "Supprimer"}</button></div>
      </div>
    </div>
  );
}