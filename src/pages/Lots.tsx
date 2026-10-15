import { useState } from "react";
import CreateLotModal from "../components/lots/CreateLotModal";

export default function Lots() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">Lots</h1>
      <button 
        className="mt-4 rounded bg-emerald-900 px-4 py-2 text-white hover:bg-emerald-800"
        onClick={() => setIsCreateModalOpen(true)}
     >   
        Créer un nouveau lot
      </button>
      {isCreateModalOpen && (
        <CreateLotModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={() => undefined}
        />
      )}
    </section>
  );
}