import { useEffect, useState } from "react";
import { Check, CircleAlert, LoaderCircle, X } from "lucide-react";
import {
	getPendingTransfers,
	rejectTransfer,
	validateTransfer,
} from "../services/lotService";
import type { PendingTransferItem } from "../types/types";

function formatDate(value: string | null) {
	return value ? new Date(value).toLocaleDateString("fr-FR") : "-";
}

export default function Transfert() {
	const [transfers, setTransfers] = useState<PendingTransferItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [actionError, setActionError] = useState<string | null>(null);
	const [rejectReasons, setRejectReasons] = useState<Record<number, string>>({});
	const [submittingId, setSubmittingId] = useState<number | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function loadTransfers() {
			setLoading(true);
			setError(null);

			try {
				const result = await getPendingTransfers();
				if (!cancelled) setTransfers(result);
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "Impossible de charger les transferts.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		loadTransfers();
		return () => {
			cancelled = true;
		};
	}, []);

	const removeTransfer = (transferId: number) => {
		setTransfers((current) => current.filter((transfer) => transfer.transfer_id !== transferId));
		setRejectReasons((current) => {
			const next = { ...current };
			delete next[transferId];
			return next;
		});
	};

	const handleValidate = async (transferId: number, lotCode: string) => {
		if (!window.confirm(`Confirmer la réception du lot ${lotCode} ?`)) return;

		setSubmittingId(transferId);
		setActionError(null);

		try {
			await validateTransfer(transferId, new Date().toISOString().slice(0, 10));
			removeTransfer(transferId);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "La validation du transfert a échoué.");
		} finally {
			setSubmittingId(null);
		}
	};

	const handleReject = async (transferId: number) => {
		const reason = rejectReasons[transferId]?.trim() ?? "";
		if (reason.length < 3) {
			setActionError("Le motif du refus doit contenir au moins 3 caractères.");
			return;
		}

		setSubmittingId(transferId);
		setActionError(null);

		try {
			await rejectTransfer(transferId, reason);
			removeTransfer(transferId);
		} catch (err) {
			setActionError(err instanceof Error ? err.message : "Le refus du transfert a échoué.");
		} finally {
			setSubmittingId(null);
		}
	};

	return (
		<section className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold text-stone-900">Transferts en attente</h1>
				<p className="mt-1 text-sm text-stone-500">Réceptionnez les lots envoyés à votre organisation.</p>
			</div>

			{(error || actionError) && (
				<div role="alert" className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					<CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
					<span>{error ?? actionError}</span>
				</div>
			)}

			{loading && <p className="py-10 text-center text-sm text-stone-500">Chargement des transferts...</p>}

			{!loading && !error && transfers.length === 0 && (
				<div className="rounded-xl border border-dashed border-stone-300 bg-white py-12 text-center">
					<p className="font-medium text-stone-700">Aucun transfert en attente</p>
					<p className="mt-1 text-sm text-stone-500">Les nouveaux transferts apparaîtront ici.</p>
				</div>
			)}

			{!loading && !error && transfers.length > 0 && (
				<div className="space-y-4">
					{transfers.map((transfer) => {
						const isSubmitting = submittingId === transfer.transfer_id;

						return (
							<article key={transfer.transfer_id} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
								<div className="flex flex-wrap items-start justify-between gap-4">
									<div>
										<p className="text-lg font-semibold text-stone-900">Lot {transfer.lot_code}</p>
										<p className="mt-1 text-sm text-stone-500">
											Envoyé par {transfer.from_organization_name ?? "Organisation inconnue"} le {formatDate(transfer.dispatch_date)}
										</p>
									</div>
									<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">En attente</span>
								</div>

								<dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
									<div><dt className="text-stone-500">Quantité</dt><dd className="mt-1 font-medium text-stone-900">{transfer.quantity_kg} kg</dd></div>
									<div><dt className="text-stone-500">État du produit</dt><dd className="mt-1 font-medium text-stone-900">{transfer.product_state ?? "-"}</dd></div>
									<div><dt className="text-stone-500">Origine</dt><dd className="mt-1 font-medium text-stone-900">{transfer.origin_location_name}</dd></div>
									<div><dt className="text-stone-500">Destination</dt><dd className="mt-1 font-medium text-stone-900">{transfer.destination_location_name}</dd></div>
								</dl>

								{transfer.notes && <p className="mt-4 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">Note : {transfer.notes}</p>}

								<div className="mt-5 flex flex-col gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
									<div className="w-full sm:max-w-md">
										<label htmlFor={`reason-${transfer.transfer_id}`} className="mb-1.5 block text-sm font-medium text-stone-700">Motif du refus</label>
										<textarea
											id={`reason-${transfer.transfer_id}`}
											rows={2}
											maxLength={500}
											value={rejectReasons[transfer.transfer_id] ?? ""}
											disabled={isSubmitting}
											onChange={(event) => setRejectReasons((current) => ({ ...current, [transfer.transfer_id]: event.target.value }))}
											placeholder="Obligatoire pour refuser ce transfert"
											className="block w-full resize-none rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:bg-stone-100"
										/>
									</div>
									<div className="flex shrink-0 gap-2">
										<button type="button" disabled={isSubmitting} onClick={() => handleReject(transfer.transfer_id)} className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
											{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />} Refuser
										</button>
												<button type="button" disabled={isSubmitting} onClick={() => handleValidate(transfer.transfer_id, transfer.lot_code)} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50">
											{isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Valider
										</button>
									</div>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</section>
	);
}