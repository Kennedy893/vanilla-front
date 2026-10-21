import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { createFarm, updateFarm } from "../../services/lotService";
import type { FarmListItem } from "../../types/types";

const inputClass = "block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 placeholder-stone-400 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

type FarmFormModalProps = {
  farm?: FarmListItem;
  onClose: () => void;
  onSaved: () => void;
};

type FarmForm = {
  name: string;
  area_hectares: string;
  location_name: string;
  latitude: string;
  longitude: string;
};

function initialForm(farm?: FarmListItem): FarmForm {
  return {
    name: farm?.name ?? "",
    area_hectares: farm?.area_hectares ?? "",
    location_name: farm?.location_name ?? "",
    latitude: farm?.latitude ?? "",
    longitude: farm?.longitude ?? "",
  };
}

export default function FarmFormModal({ farm, onClose, onSaved }: FarmFormModalProps) {
  const [form, setForm] = useState(() => initialForm(farm));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(farm);

  const handleChange = (field: keyof FarmForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const hasLatitude = form.latitude.trim() !== "";
    const hasLongitude = form.longitude.trim() !== "";
    if (hasLatitude !== hasLongitude) {
      setError("La latitude et la longitude doivent être renseignées ensemble.");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      area_hectares: form.area_hectares.trim() ? Number(form.area_hectares) : null,
      location_name: form.location_name.trim(),
      latitude: hasLatitude ? Number(form.latitude) : null,
      longitude: hasLongitude ? Number(form.longitude) : null,
    };

    try {
      if (farm) {
        await updateFarm(farm.id, payload);
      } else {
        await createFarm(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'enregistrement a échoué.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/30 p-4 backdrop-blur-sm sm:items-center" onClick={handleClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="farm-form-title" className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
          <div>
            <h2 id="farm-form-title" className="text-lg font-semibold text-stone-900">{isEditing ? "Modifier l'exploitation" : "Créer une exploitation"}</h2>
            <p className="mt-0.5 text-sm text-stone-500">{isEditing ? "Mettez à jour les informations de cette exploitation." : "Renseignez les informations de l'exploitation."}</p>
          </div>
          <button type="button" onClick={handleClose} disabled={submitting} aria-label="Fermer" className="-mr-2 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 disabled:opacity-50"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <label htmlFor="farm-name" className={labelClass}>Nom</label>
              <input id="farm-name" required maxLength={50} autoFocus value={form.name} disabled={submitting} onChange={(event) => handleChange("name", event.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="farm-area" className={labelClass}>Surface (ha)</label>
                <input id="farm-area" type="number" min="0.01" max="10000" step="0.01" value={form.area_hectares} disabled={submitting} onChange={(event) => handleChange("area_hectares", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="farm-location" className={labelClass}>Localisation</label>
                <input id="farm-location" required maxLength={50} value={form.location_name} disabled={submitting} onChange={(event) => handleChange("location_name", event.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="farm-latitude" className={labelClass}>Latitude <span className="font-normal text-stone-400">(facultatif)</span></label>
                <input id="farm-latitude" type="number" min="-90" max="90" step="0.000001" value={form.latitude} disabled={submitting} onChange={(event) => handleChange("latitude", event.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="farm-longitude" className={labelClass}>Longitude <span className="font-normal text-stone-400">(facultatif)</span></label>
                <input id="farm-longitude" type="number" min="-180" max="180" step="0.000001" value={form.longitude} disabled={submitting} onChange={(event) => handleChange("longitude", event.target.value)} className={inputClass} />
              </div>
            </div>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          </div>
          <div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
            <button type="button" onClick={handleClose} disabled={submitting} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Enregistrement…" : isEditing ? "Enregistrer" : "Créer l'exploitation"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}