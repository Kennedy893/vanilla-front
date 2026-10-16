import {
	ArrowLeft,
	CalendarDays,
	CheckCircle2,
	CircleAlert,
	Clock3,
	Factory,
	MapPin,
	Package,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useLotDetail } from "../../hooks/useLotDetail";
import type { EventStatus, EventType, LotHistoryEvent, LotListItem } from "../../types/types";

const EVENT_LABELS: Record<EventType, string> = {
	harvest: "Récolte",
	collection: "Collecte",
	transfer: "Transfert",
	processing: "Transformation",
	quality_check: "Contrôle qualité",
	storage: "Stockage",
	shipment: "Expédition",
	export: "Export",
};

const STATUS_STYLES: Record<EventStatus, string> = {
	pending: "bg-amber-50 text-amber-800 ring-amber-200",
	validated: "bg-emerald-50 text-emerald-800 ring-emerald-200",
	rejected: "bg-red-50 text-red-700 ring-red-200",
	cancelled: "bg-stone-100 text-stone-600 ring-stone-200",
};

const STATUS_LABELS: Record<EventStatus, string> = {
	pending: "En attente",
	validated: "Validé",
	rejected: "Rejeté",
	cancelled: "Annulé",
};

function formatDate(value: string | null, withTime = false) {
	if (!value) return "Date non renseignée";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Date non renseignée";
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		...(withTime ? { timeStyle: "short" as const } : {}),
	}).format(date);
}

function formatQuantity(quantity: string | null) {
	if (!quantity) return null;
	return `${quantity.replace(".", ",")} kg`;
}

function EventCard({ event }: { event: LotHistoryEvent }) {
	const eventLabel = event.event_type ? EVENT_LABELS[event.event_type] : "Événement";
	const quantity = formatQuantity(event.quantity_kg);

	return (
		<article className="relative rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md sm:p-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="flex min-w-0 gap-3">
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
						{event.event_type === "quality_check" ? (
							<ShieldCheck className="h-5 w-5" />
						) : (
							<Package className="h-5 w-5" />
						)}
					</span>
					<div className="min-w-0">
						<p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{eventLabel}</p>
						<h3 className="mt-1 text-base font-semibold text-stone-900">{event.description || eventLabel}</h3>
						<p className="mt-1 font-mono text-xs text-stone-500">{event.event_code}</p>
					</div>
				</div>
				<span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[event.status]}`}>
					{event.status === "validated" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
					{STATUS_LABELS[event.status]}
				</span>
			</div>

			<div className="mt-5 grid gap-3 border-t border-stone-100 pt-4 text-sm text-stone-600 sm:grid-cols-2">
				<div className="flex items-center gap-2">
					<CalendarDays className="h-4 w-4 shrink-0 text-stone-400" />
					<span>{formatDate(event.event_date, true)}</span>
				</div>
				<div className="flex items-center gap-2">
					<MapPin className="h-4 w-4 shrink-0 text-stone-400" />
					<span className="truncate">{event.location_name}</span>
				</div>
				<div className="flex items-center gap-2">
					<UserRound className="h-4 w-4 shrink-0 text-stone-400" />
					<span>Enregistré par {event.recorded_by}</span>
				</div>
				{quantity && (
					<div className="flex items-center gap-2">
						<Package className="h-4 w-4 shrink-0 text-stone-400" />
						<span>{quantity}</span>
					</div>
				)}
			</div>

			{event.quality_check && (
				<div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/70 p-4">
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm font-semibold text-stone-900">Résultat du contrôle qualité</p>
						<span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold capitalize text-amber-900 shadow-sm">
							{event.quality_check.result}
						</span>
					</div>
					<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
						<div>
							<dt className="text-xs text-stone-500">Classe</dt>
							<dd className="font-medium text-stone-800">{event.quality_check.grade || "-"}</dd>
						</div>
						<div>
							<dt className="text-xs text-stone-500">Humidité</dt>
							<dd className="font-medium text-stone-800">{event.quality_check.moisture_percentage ? `${event.quality_check.moisture_percentage.replace(".", ",")} %` : "-"}</dd>
						</div>
						<div>
							<dt className="text-xs text-stone-500">Contrôlé par</dt>
							<dd className="truncate font-medium text-stone-800">{event.quality_check.checked_by}</dd>
						</div>
					</dl>
					{event.quality_check.comments && <p className="mt-3 border-t border-amber-200 pt-3 text-sm text-stone-700">{event.quality_check.comments}</p>}
				</div>
			)}

			{event.validated_by && (
				<p className="mt-4 flex items-center gap-2 text-xs text-stone-500">
					<CheckCircle2 className="h-4 w-4 text-emerald-600" />
					Validé par {event.validated_by}{event.validated_at ? ` le ${formatDate(event.validated_at, true)}` : ""}
				</p>
			)}
		</article>
	);
}

export default function LotDetail() {
	const { lotId } = useParams<{ lotId: string }>();
	const location = useLocation();
	const parsedLotId = lotId ? Number(lotId) : undefined;
	const selectedLot = (location.state as { lot?: LotListItem } | null)?.lot;
	const { events, lastQualityEvent, loading, error } = useLotDetail(parsedLotId);

	if (loading) {
		return (
            <div className="flex items-center justify-center gap-3 py-16 text-sm text-stone-500">
                <svg className="h-5 w-5 animate-spin text-emerald-700" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className="opacity-75" />
                </svg>
                Chargement du détail du lot...
            </div>
        );
	}

	if (error) {
		return (
			<div className="space-y-5">
				<Link to="/lots" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-950">
					<ArrowLeft className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700/30" /> Retour aux lots
				</Link>
				<p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
			</div>
		);
	}

	return (
		<section className="mx-auto max-w-4xl space-y-6">
			<Link to="/lots" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition hover:text-emerald-950">
				<ArrowLeft className="h-4 w-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-700/30" /> Retour aux lots
			</Link>

			<header className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Détail du lot</p>
						<h1 className="mt-1 text-2xl font-bold text-stone-900">{selectedLot?.lot_code || `Lot #${parsedLotId}`}</h1>
						<p className="mt-1 text-sm text-stone-500">{selectedLot?.product_state || "Historique de traçabilité"}</p>
					</div>
					<span className="inline-flex w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold capitalize text-emerald-800">{selectedLot?.status || "Statut inconnu"}</span>
				</div>

				<dl className="mt-6 grid gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
					<div><dt className="text-xs uppercase tracking-wide text-stone-500">Quantité</dt><dd className="mt-1 font-semibold text-stone-900">{formatQuantity(selectedLot?.quantity_kg || events[events.length - 1]?.quantity_kg) ?? "-"}</dd></div>
					<div><dt className="text-xs uppercase tracking-wide text-stone-500">Exploitation</dt><dd className="mt-1 flex items-center gap-1.5 font-semibold text-stone-900"><Factory className="h-4 w-4 text-emerald-700" />{selectedLot?.farm.name || selectedLot?.farm.farm_code || events[events.length - 1]?.organization_name || "Non renseignée"}</dd></div>
					<div><dt className="text-xs uppercase tracking-wide text-stone-500">Détenteur</dt><dd className="mt-1 flex items-center gap-1.5 font-semibold text-stone-900"><UserRound className="h-4 w-4 text-emerald-700" />{events[events.length - 1]?.recorded_by || "Non renseigné"}</dd></div>
					<div><dt className="text-xs uppercase tracking-wide text-stone-500">Dernière activité</dt><dd className="mt-1 flex items-center gap-1.5 font-semibold text-stone-900"><Clock3 className="h-4 w-4 text-emerald-700" />{events.length ? formatDate(events[events.length - 1].event_date) : "Aucune"}</dd></div>
				</dl>
			</header>

			<section className="space-y-4">
				<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-xl font-bold text-stone-900">Historique du lot</h2>
						<p className="text-sm text-stone-500">{events.length} événement{events.length > 1 ? "s" : ""}, du plus ancien au plus récent</p>
					</div>
					{lastQualityEvent && <span className="text-sm text-emerald-800">Qualité : <strong>{lastQualityEvent.quality_check?.grade || lastQualityEvent.quality_check?.result}</strong></span>}
				</div>

				{events.length > 0 ? (
					<ol className="relative space-y-4 border-l-2 border-emerald-100 pl-6 sm:pl-8">
                        {events.map((event) => (
                            <li key={event.event_id} className="relative">
                                <span className="absolute -left-[31px] top-9 h-3 w-3 rounded-full border-2 border-white bg-emerald-600 ring-2 ring-emerald-100 sm:-left-[39px]" />
                                <EventCard event={event} />
                            </li>
                        ))}
                    </ol>
				) : (
					<div className="rounded-xl border border-dashed border-stone-300 bg-white py-12 text-center text-sm text-stone-500">Aucun événement enregistré pour ce lot.</div>
				)}
			</section>
		</section>
	);
}
