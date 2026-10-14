import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useLogout } from "../hooks/useLogout";

function Layout() {
  const { handleLogout } = useLogout();

  return (
    <div className="min-h-screen bg-stone-50 lg:flex">
      <Sidebar
        userName="Jean Dupont"
        userRole="Administrateur"
        onLogout={handleLogout} 
      />
      <main className="min-w-0 flex-1 px-6 pb-10 pt-20 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;