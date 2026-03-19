import { Bell, CheckCircle, CheckSquare, LayoutDashboard, ListTodo, LogOut, MessageSquare, User, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/useAuth";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "Dashboard", path: "/app/home", icon: LayoutDashboard },
    { name: "My Tasks", path: "/app/my-tasks", icon: ListTodo },
    { name: "Accepted Tasks", path: "/app/accepted-tasks", icon: CheckSquare },
    { name: "Completed Tasks", path: "/app/completed-tasks", icon: CheckCircle },
    { name: "Messages / Chat", path: "/app/messages", icon: MessageSquare },
    { name: "Notifications", path: "/app/notifications", icon: Bell },
    { name: "Profile", path: "/app/profile", icon: User },
  ];

  return (
    <>
      {isOpen ? <div className="fixed inset-0 z-40 bg-slate-950/35 md:hidden" onClick={toggleSidebar} /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/app/messages" className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <MessageSquare className="h-5 w-5" />
              </span>
              Atrack
            </Link>
            <button type="button" onClick={toggleSidebar} className="md:hidden text-slate-500 transition hover:text-slate-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 rounded-3xl bg-slate-50 px-4 py-4">
            <p className="text-sm font-medium text-slate-900">{user?.username}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{user?.role || "employee"}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 text-sm font-medium">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                  isActive ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
