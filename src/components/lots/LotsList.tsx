"use client";

import { useState } from "react";
import { PAGE_SIZE, useLots } from "../../hooks/useLots";
import type { LotStatus } from "../../types/types";

// Onglets de filtre : value = statut envoyé au backend (undefined = tous les lots)
const STATUS_TABS: { value: LotStatus | undefined; label: string }[] = [
  { value: undefined, label: "Tous" },
  { value: "created", label: "En attente" },
  { value: "available", label: "Disponibles" },
  { value: "in_transfer", label: "En transfert" },
  { value: "processing", label: "En transformation" },
  { value: "blocked", label: "Bloqués" },
  { value: "exported", label: "Exportés" },
  { value: "archived", label: "Archivés" },
];

export default function LotsList() {
  const [status, setStatus] = useState<LotStatus | undefined>(undefined);
  const [page, setPage] = useState(1);
  const { lots, total, statusCounts, loading, error } = useLots(status, page);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Compteur affiché dans chaque onglet ("Tous" = somme de tous les statuts)
  const countFor = (tabStatus: LotStatus | undefined): number => {
    if (!statusCounts) return 0;
    if (tabStatus) return statusCounts[tabStatus] ?? 0;
    return Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  };

  const handleSelectStatus = (nextStatus: LotStatus | undefined) => {
    setStatus(nextStatus);
    setPage(1); // nouveau filtre => retour à la première page
  };

  // Plus de "return" anticipé : les onglets restent toujours affichés,
  // seule la zone sous les onglets change selon l'état.
  return (
    <div className="space-y-5">
        <h2 className="text-lg font-semibold text-stone-900">Liste des lots ({total})</h2>

        <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
            <button
            key={tab.label}
            type="button"
            onClick={() => handleSelectStatus(tab.value)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-700/30 ${
                tab.value === status
                ? "border-emerald-800 bg-emerald-800 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
            }`}
            >
            {tab.label}
            {statusCounts && ` (${countFor(tab.value)})`}
            </button>
        ))}
        </div>

        {loading && <p className="py-10 text-center text-sm text-stone-500">Chargement des lots...</p>}

        {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Erreur lors du chargement : {error}
        </p>
        )}

        {!loading && !error && lots.length === 0 && (
        <p className="rounded-xl border border-dashed border-stone-300 bg-white py-10 text-center text-sm text-stone-500">
            {status ? "Aucun lot avec ce statut." : "Aucun lot disponible."}
        </p>
        )}

        {!loading && !error && lots.length > 0 && (
        <>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200 text-sm">
                <thead className="bg-stone-50">
                    <tr>
                    {[
                        "Code du lot",
                        "Exploitation",
                        "État du produit",
                        "Quantité (kg)",
                        "Statut",
                        "Date de récolte",
                    ].map((title) => (
                        <th
                        key={title}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500"
                        >
                        {title}
                        </th>
                    ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                    {lots.map((lot) => (
                    <tr key={lot.id} className="transition hover:bg-stone-50">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-900">{lot.lot_code}</td>
                        <td className="px-4 py-3 text-stone-700">{lot.farm.name ?? lot.farm.farm_code}</td>
                        <td className="px-4 py-3 text-stone-700">{lot.product_state ?? "-"}</td>
                        <td className="px-4 py-3 tabular-nums text-stone-700">{lot.quantity_kg}</td>
                        <td className="px-4 py-3">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
                            {lot.status ?? "-"}
                        </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-stone-700">
                        {lot.harvest_date
                            ? new Date(lot.harvest_date).toLocaleDateString("fr-FR")
                            : "-"}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            <div className="flex items-center justify-between">
            <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Précédent
            </button>
            <span className="text-sm text-stone-600">
                Page {page} / {pageCount}
            </span>
            <button
                type="button"
                disabled={page >= pageCount}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Suivant
            </button>
            </div>
        </>
        )}
    </div>
    );
}