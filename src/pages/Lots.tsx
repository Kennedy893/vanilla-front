import { useState } from "react";
import CreateLotModal from "../components/lots/CreateLotModal";
import LotsList from "../components/lots/LotsList";

export default function Lots() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-stone-900">Lots</h1>
        <button
          type="button"
          className="rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Créer un nouveau lot
        </button>
      </div>

      <LotsList />

      {isCreateModalOpen && (
        <CreateLotModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => undefined}
        />
      )}
    </section>
  );
}