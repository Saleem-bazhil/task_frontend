import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";

const TITLES = {
  "/app/home": "Dashboard",
  "/app/my-tasks": "My Tasks",
  "/app/accepted-tasks": "Accepted Tasks",
  "/app/completed-tasks": "Completed Tasks",
  "/app/messages": "Messages",
  "/app/notifications": "Notifications",
  "/app/profile": "Profile",
};

export default function Header({ toggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={toggleSidebar} className="p-1 text-slate-500 transition hover:text-slate-700 md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Workspace</p>
          <h1 className="text-xl font-semibold text-slate-900">{TITLES[location.pathname] || "Atrack"}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
          {(user?.username || "U").slice(0, 1).toUpperCase()}
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-900">{user?.username}</p>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
