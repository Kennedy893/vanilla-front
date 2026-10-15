import { useEffect, useState, type FormEvent } from "react";
import { createLot, getExploitations } from "../../services/lotService";
import type { Exploitation } from "../../types/types";
import { X } from "lucide-react";

// À placer avant le composant : classes partagées par tous les champs
const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";
interface CreateLotModalProps {
  onClose: () => void;
  onCreated: () => void;
}

interface LotForm {
  exploitationId: string;
  quantiteKg: string;
  dateRecolte: string;
  notes: string;
}

const initialForm: LotForm = {
  exploitationId: "",
  quantiteKg: "",
  dateRecolte: "",
  notes: "",
};

export default function CreateLotModal({
  onClose,
  onCreated,
}: CreateLotModalProps) {
    const [form, setForm] = useState<LotForm>(initialForm);
    const [exploitations, setExploitations] = useState<Exploitation[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingExploitations, setLoadingExploitations] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      getExploitations()
        .then(setExploitations)
        .catch((err: unknown) => {
          setError(err instanceof Error ? err.message : "Impossible de charger les exploitations.");
        })
        .finally(() => setLoadingExploitations(false));
    }, []);

    const handleChange = (field: keyof LotForm, value: string) => {
      setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        await createLot({
          farm_id: Number(form.exploitationId),
          quantity_kg: Number(form.quantiteKg),
          harvest_date: form.dateRecolte,
          notes: form.notes.trim() || undefined,
        });
        onCreated();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "La création du lot a échoué.");
      } finally {
        setSubmitting(false);
      }
    };

    const handleClose = () => {
        if (submitting) return;
        onClose?.();
    };

    return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/30 p-4 backdrop-blur-sm sm:items-center"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-lot-title"
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <h2 id="create-lot-title" className="text-lg font-semibold text-stone-900">
              Créer un nouveau lot
            </h2>
            <p className="mt-0.5 text-sm text-stone-500">
              Renseignez l'origine et la quantité récoltée.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Fermer"
            className="-mr-2 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          {/* Corps (défile si l'écran est petit) */}
          <div className="space-y-5 overflow-y-auto px-6 py-5">
            {/* Exploitation */}
            <div>
              <label htmlFor="exploitationId" className={labelClass}>
                Exploitation
              </label>
              <select
                id="exploitationId"
                name="exploitationId"
                required
                autoFocus
                value={form.exploitationId}
                disabled={loadingExploitations || submitting}
                onChange={(e) => handleChange("exploitationId", e.target.value)}
                className={inputClass}
              >
                <option value="" disabled>
                  {loadingExploitations ? "Chargement…" : "Sélectionner une exploitation…"}
                </option>
                {exploitations.map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {exp.name ?? exp.farm_code}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantité + date côte à côte dès que la place le permet */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quantiteKg" className={labelClass}>
                  Quantité
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="quantiteKg"
                    name="quantiteKg"
                    min="0"
                    step="0.01"
                    required
                    value={form.quantiteKg}
                    disabled={submitting}
                    onChange={(e) => handleChange("quantiteKg", e.target.value)}
                    placeholder="0.00"
                    className={`${inputClass} pr-11`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-stone-500">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="dateRecolte" className={labelClass}>
                  Date de récolte
                </label>
                <input
                  type="date"
                  id="dateRecolte"
                  name="dateRecolte"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  value={form.dateRecolte}
                  disabled={submitting}
                  onChange={(e) => handleChange("dateRecolte", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className={labelClass}>
                Notes <span className="font-normal text-stone-400">(facultatif)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={form.notes}
                disabled={submitting}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Description, observations…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions toujours visibles */}
          <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                </svg>
              )}
              {submitting ? "Création…" : "Créer le lot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}