import { useEffect, useState, type FormEvent } from "react";
import { createLot, getExploitations } from "../../services/lotService";
import type { Exploitation } from "../../types/types";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Créer un nouveau lot
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exploitation */}
          <div>
            <label
              htmlFor="exploitationId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Exploitation
            </label>
            <select
              id="exploitationId"
              name="exploitationId"
              required
              value={form.exploitationId}
              disabled={loadingExploitations || submitting}
              onChange={(e) => handleChange("exploitationId", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
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

          {/* Quantité */}
          <div>
            <label
              htmlFor="quantiteKg"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Quantité (kg)
            </label>
            <input
              type="number"
              id="quantiteKg"
              name="quantiteKg"
              min="0"
              step="0.01"
              required
              value={form.quantiteKg}
              disabled={submitting}
              onChange={(e) =>
                handleChange("quantiteKg", e.target.value)
              }
              placeholder="0.00"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Date de récolte */}
          <div>
            <label
              htmlFor="dateRecolte"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date de récolte
            </label>
            <input
              type="date"
              id="dateRecolte"
              name="dateRecolte"
              required
              value={form.dateRecolte}
              disabled={submitting}
              onChange={(e) => handleChange("dateRecolte", e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes}
              disabled={submitting}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Description, observations…"
              className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
            >
              {submitting ? "Création…" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}