import { useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import { NotificationBell } from "../components/notifications";

const TITLES = {
  "/app/home": "Dashboard",
  "/app/my-tasks": "My Tasks",
  "/app/accepted-tasks": "Accepted Tasks",
  "/app/completed-tasks": "Completed Tasks",
  "/app/messages": "Messages",
  "/app/profile": "Profile",
};

export default function Header() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-14 md:h-[72px] items-center justify-between border-b border-white/60 bg-white/60 px-4 md:px-8 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
      {/* Empty div for balancing flex layout on mobile */}
      <div className="w-10 md:hidden"></div>

      <div className="flex flex-1 justify-center md:justify-start">
        <h1 className="text-lg md:text-xl font-semibold text-slate-900">
          {TITLES[location.pathname] || "Atrack"}
        </h1>
      </div>

      <div className="flex items-center justify-end gap-3 rounded-full md:border md:border-slate-200 md:bg-slate-50 md:py-1 md:px-2">
        {/* Notification Bell */}
        <NotificationBell />

        <div className="hidden text-right md:block">
          <p className="text-sm font-medium text-slate-900">
            {user?.username || "Guest"}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            {user?.role || "Employee"}
          </p>
        </div>
        <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-[#E41F6A]/10 font-semibold text-[#E41F6A]">
          {(user?.username || "U").slice(0, 1).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
