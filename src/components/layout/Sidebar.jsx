import { CheckCircle, CheckSquare, ChevronDown, LayoutDashboard, ListTodo, LogOut, MessageSquare, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { useAuth } from "../../context/useAuth";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // Removed the 'badge' properties as requested
  const menuItems = [
    { name: "Dashboard", path: "/app/home", icon: LayoutDashboard },
    { name: "My Tasks", path: "/app/my-tasks", icon: ListTodo },
    { name: "Accepted Tasks", path: "/app/accepted-tasks", icon: CheckSquare },
    { name: "Completed Tasks", path: "/app/completed-tasks", icon: CheckCircle },
    { name: "Messages / Chat", path: "/app/messages", icon: MessageSquare },
    { name: "Profile", path: "/app/profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-68 flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      
      {/* Brand & User Profile Section */}
      <div className="flex flex-col gap-6 border-b border-slate-100 px-6 py-8">
        
        {/* Renderways Logo - replaced with brand image */}
        <Link to="/app/home" className="group flex items-center gap-3 w-fit">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white">
            <img src="/logo.jpeg" alt="Renderways" className="h-full w-full object-cover" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900 transition-colors group-hover:text-[#E41F6A]">
            Renderways
          </span>
        </Link>

        {/* User Interactive Menu Button */}
        <button className="group flex w-full items-center justify-between overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-3 transition-colors duration-300 hover:border-slate-200 hover:bg-slate-100 text-left">
          <div className="flex items-center gap-3 relative z-10 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 font-bold transition-colors group-hover:bg-[#E41F6A]/10 group-hover:text-[#E41F6A]">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-bold text-slate-900">
                {user?.username || "Guest User"}
              </span>
              <span className="truncate text-[10px] font-black uppercase tracking-widest text-slate-400">
                {user?.role || "Employee"}
              </span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-colors duration-300 group-hover:text-slate-600" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className="group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors outline-none"
            >
              {/* Sliding Active Background (Kept because it looks premium without jumping) */}
              {isActive && (
                <motion.div
                  layoutId="sidebarIndicator"
                  className="absolute inset-0 rounded-2xl bg-[#E41F6A]/10"
                  initial={false}
                  transition={{ 
                    type: "spring", 
                    stiffness: 350, 
                    damping: 30 
                  }}
                />
              )}

              {/* Icon - Removed scale hover, perfectly matched colors */}
              <Icon 
                className={`relative z-10 h-5 w-5 shrink-0 transition-colors duration-300 ${
                  isActive 
                    ? "text-[#E41F6A]" 
                    : "text-slate-500 group-hover:text-slate-800"
                }`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              
              {/* Text - Removed sliding hover, fixed color matching */}
              <span 
                className={`relative z-10 text-sm truncate transition-colors duration-300 ${
                  isActive 
                    ? "font-bold text-[#E41F6A]" 
                    : "font-medium text-slate-500 group-hover:text-slate-800"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/", { replace: true });
          }}
          className="group flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-500 transition-colors duration-300 hover:bg-rose-50 hover:text-rose-600 outline-none"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 transition-colors duration-300" />
            <span>Secure Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
}
