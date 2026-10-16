import { useState, type FormEvent } from "react";
import { ArrowRightLeft, X } from "lucide-react";
import { createTransfer } from "../../services/lotService";
import type { TransferLocation, TransferOrganization } from "../../types/types";

const inputClass =
	"block w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-stone-900 transition focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500";
const labelClass = "mb-1.5 block text-sm font-medium text-stone-700";

interface LotTransfertModalProps {
	lotId: number;
	lotCode?: string;
	organizations: TransferOrganization[];
	locations: TransferLocation[];
	onClose: () => void;
	onTransferred: () => void;
}

function today() {
	return new Date().toISOString().slice(0, 10);
}

export default function LotTransfertModal({
	lotId,
	lotCode,
	organizations,
	locations,
	onClose,
	onTransferred,
}: LotTransfertModalProps) {
	const [organizationId, setOrganizationId] = useState("");
	const [locationId, setLocationId] = useState("");
	const [dispatchDate, setDispatchDate] = useState(today);
	const [notes, setNotes] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitting(true);
		setError(null);

		try {
			await createTransfer(lotId, {
				to_organization_id: Number(organizationId),
				destination_location_id: Number(locationId),
				dispatch_date: dispatchDate,
				notes: notes.trim() || undefined,
			});
			onTransferred();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Le transfert du lot a échoué.");
		} finally {
			setSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!submitting) onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/30 p-4 backdrop-blur-sm sm:items-center" onClick={handleClose}>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="transfer-lot-title"
				className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-stone-200"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between border-b border-stone-200 px-6 py-5">
					<div>
						<div className="flex items-center gap-2 text-emerald-800">
							<ArrowRightLeft className="h-5 w-5" />
							<h2 id="transfer-lot-title" className="text-lg font-semibold text-stone-900">Transférer le lot</h2>
						</div>
						<p className="mt-1 text-sm text-stone-500">{lotCode ? `Lot ${lotCode}` : "Sélectionnez la destination du lot."}</p>
					</div>
					<button type="button" onClick={handleClose} disabled={submitting} aria-label="Fermer" className="-mr-2 rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:opacity-50">
						<X className="h-5 w-5" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
					<div className="space-y-5 overflow-y-auto px-6 py-5">
						<div>
							<label htmlFor="transfer-organization" className={labelClass}>Organisation destinataire</label>
							<select id="transfer-organization" required value={organizationId} disabled={submitting} onChange={(event) => setOrganizationId(event.target.value)} className={inputClass}>
								<option value="" disabled>Sélectionner une organisation…</option>
								{organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
							</select>
						</div>

						<div>
							<label htmlFor="transfer-location" className={labelClass}>Lieu de destination</label>
							<select id="transfer-location" required value={locationId} disabled={submitting} onChange={(event) => setLocationId(event.target.value)} className={inputClass}>
								<option value="" disabled>Sélectionner un lieu…</option>
								{locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
							</select>
						</div>

						<div>
							<label htmlFor="transfer-date" className={labelClass}>Date d'expédition</label>
							<input id="transfer-date" type="date" required max={today()} value={dispatchDate} disabled={submitting} onChange={(event) => setDispatchDate(event.target.value)} className={inputClass} />
						</div>

						<div>
							<label htmlFor="transfer-notes" className={labelClass}>Notes <span className="font-normal text-stone-400">(facultatif)</span></label>
							<textarea id="transfer-notes" rows={3} maxLength={1000} value={notes} disabled={submitting} onChange={(event) => setNotes(event.target.value)} placeholder="Informations utiles pour la réception…" className={`${inputClass} resize-none`} />
						</div>

						{error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
					</div>

					<div className="flex justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
						<button type="button" onClick={handleClose} disabled={submitting} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:opacity-50">Annuler</button>
						<button type="submit" disabled={submitting || organizations.length === 0 || locations.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
							{submitting ? "Transfert…" : "Confirmer le transfert"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
