
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";
import Lots from "../pages/Lots";
import LotDetail from "../components/lots/LotDetail";

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
      </Route>

      {/* Redirections */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}