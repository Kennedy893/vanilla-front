
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Lots from "../pages/Lots";
import LotDetail from "../components/lots/LotDetail";
import Transfert from "../pages/Transfert";
import Exploitation from "../pages/Exploitation";

export default function AppRouter() {
  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />

      {/* Pages avec sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lots" element={<Lots />} />
        <Route path="/lots/:lotId" element={<LotDetail />} />
        <Route path="/transfers" element={<Transfert />} />
        <Route path="/exploitations" element={<Exploitation />} />
        <Route path="/controles-qualite" element={<div>Contrôles qualité</div>} />
        <Route path="/qr-codes" element={<div>QR codes</div>} />
        <Route path="/utilisateurs" element={<div>Utilisateurs</div>} />
      </Route>

      {/* Redirections */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}