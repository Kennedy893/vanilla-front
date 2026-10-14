
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Layout from "../components/Layout";

export default function AppRouter() {
  return (
    <Routes>
      {/* Page de connexion */}
      <Route path="/login" element={<Login />} />

      {/* Pages avec sidebar */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Redirections */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}