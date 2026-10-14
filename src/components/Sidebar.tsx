import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Sprout,
  ClipboardCheck,
  QrCode,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/lots", label: "Lots", icon: Package },
  { to: "/exploitations", label: "Exploitations", icon: Sprout },
  { to: "/controles-qualite", label: "Contrôles qualité", icon: ClipboardCheck },
  { to: "/qr-codes", label: "QR codes", icon: QrCode },
  { to: "/utilisateurs", label: "Utilisateurs", icon: Users },
];

type SidebarProps = {
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
};

export default function Sidebar({
  userName = "Utilisateur",
  userRole = "Rôle",
  onLogout,
}: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Barre supérieure mobile */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-emerald-800 bg-emerald-900 px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-200 font-bold text-emerald-900">
            DV
          </span>
          <span className="font-semibold text-emerald-50">Dago Vanilla</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="rounded-lg p-2 text-emerald-100 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-amber-200"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Fond sombre mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-emerald-900 text-emerald-50 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-800 px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-200 text-lg font-bold text-emerald-900">
              DV
            </span>
            <span className="font-semibold tracking-wide">Dago Vanilla</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-800 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-amber-200 ${
                  isActive
                    ? "bg-emerald-800 text-white"
                    : "text-emerald-200 hover:bg-emerald-800/60 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-amber-200" : "text-emerald-300 group-hover:text-amber-200"
                    }`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Utilisateur */}
        <div className="border-t border-emerald-800 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-emerald-900">
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-emerald-300">{userRole}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Se déconnecter"
              title="Se déconnecter"
              className="rounded-lg p-2 text-emerald-200 hover:bg-emerald-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}