import { MapPin, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { FARM_PAGE_SIZE, useFarms } from "../../hooks/useFarms";
import type { FarmListItem } from "../../types/types";
import FarmFormModal from "./FarmFormModal";
import DeleteFarmModal from "./DeleteFarmModal";

function formatArea(area: string | null) {
	return area ? `${area.replace(".", ",")} ha` : "-";
}

export default function FarmsList() {
	const [query, setQuery] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [formFarm, setFormFarm] = useState<FarmListItem | null | undefined>(undefined);
	const [deleteFarm, setDeleteFarm] = useState<FarmListItem | null>(null);
	const { items, total, loading, error, refresh } = useFarms(search, page);
	const pageCount = Math.max(1, Math.ceil(total / FARM_PAGE_SIZE));

	const handleSearch = (value: string) => {
		setQuery(value);
		setSearch(value);
		setPage(1);
	};

	return (
		<section className="space-y-5">
			<div className="space-y-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div>
					<h2 className="text-lg font-semibold text-stone-900">Liste des exploitations ({total})</h2>
					<p className="mt-1 text-sm text-stone-500">Retrouvez les exploitations et les lots qui leur sont associés.</p>
					</div>
					<button type="button" onClick={() => setFormFarm(null)} className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 sm:w-auto"><Plus className="h-4 w-4" />Créer une exploitation</button>
				</div>
				<div className="rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
					<label className="relative block min-w-0 flex-1">
					<span className="sr-only">Rechercher une exploitation</span>
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
					<input
						type="search"
						value={query}
						onChange={(event) => handleSearch(event.target.value)}
						placeholder="Nom ou code"
						className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-900 placeholder-stone-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
					/>
					</label>
				</div>
			</div>

			{loading && <p className="py-10 text-center text-sm text-stone-500">Chargement des exploitations...</p>}

			{error && (
				<p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					Erreur lors du chargement : {error}
				</p>
			)}

			{!loading && !error && items.length === 0 && (
				<p className="rounded-xl border border-dashed border-stone-300 bg-white py-10 text-center text-sm text-stone-500">
					{search ? "Aucune exploitation ne correspond à cette recherche." : "Aucune exploitation disponible."}
				</p>
			)}

			{!loading && !error && items.length > 0 && (
				<>
					<div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-stone-200 text-sm">
								<thead className="bg-stone-50">
									<tr>
										{["Exploitation", "Localisation", "Surface", "Coordonnées", "Lots", "Créée le", "Actions"].map((title) => (
											<th key={title} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">{title}</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-stone-100">
									{items.map((farm) => (
										<tr key={farm.id} className="transition hover:bg-stone-50">
											<td className="px-4 py-3">
												<div className="font-medium text-stone-900">{farm.name || "Sans nom"}</div>
												<div className="mt-0.5 font-mono text-xs text-stone-500">{farm.farm_code}</div>
											</td>
											<td className="px-4 py-3 text-stone-700"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-700" />{farm.location_name}</span></td>
											<td className="px-4 py-3 tabular-nums text-stone-700">{formatArea(farm.area_hectares)}</td>
											<td className="px-4 py-3 text-stone-700">{farm.latitude !== null && farm.longitude !== null ? `${farm.latitude}, ${farm.longitude}` : "-"}</td>
											<td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 font-medium text-stone-700"><Package className="h-4 w-4 text-emerald-700" />{farm.lots_count}</span></td>
											<td className="whitespace-nowrap px-4 py-3 text-stone-700">{farm.created_at ? new Date(farm.created_at).toLocaleDateString("fr-FR") : "-"}</td>
											<td className="px-4 py-3"><div className="flex gap-1.5"><button type="button" onClick={() => setFormFarm(farm)} title="Modifier" aria-label={`Modifier ${farm.name || farm.farm_code}`} className="rounded-lg border border-stone-300 bg-white p-2 text-stone-600 transition hover:bg-stone-100"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => setDeleteFarm(farm)} title="Supprimer" aria-label={`Supprimer ${farm.name || farm.farm_code}`} className="rounded-lg border border-red-200 bg-white p-2 text-red-700 transition hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div></td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50">Précédent</button>
						<span className="text-sm text-stone-600">Page {page} / {pageCount}</span>
						<button type="button" disabled={page >= pageCount} onClick={() => setPage(page + 1)} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50">Suivant</button>
					</div>
				</>
			)}

			{formFarm !== undefined && <FarmFormModal key={formFarm?.id ?? "new"} farm={formFarm ?? undefined} onClose={() => setFormFarm(undefined)} onSaved={refresh} />}
			{deleteFarm && <DeleteFarmModal farm={deleteFarm} onClose={() => setDeleteFarm(null)} onDeleted={refresh} />}
		</section>
	);
}
