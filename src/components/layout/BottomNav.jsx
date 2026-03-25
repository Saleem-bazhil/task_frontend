import { CheckSquare, LayoutDashboard, ListTodo, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/app/home", icon: LayoutDashboard },
    { name: "Tasks", path: "/app/my-tasks", icon: ListTodo },
    { name: "Accepted", path: "/app/accepted-tasks", icon: CheckSquare },
    { name: "Chat", path: "/app/messages", icon: MessageSquare },
    { name: "Profile", path: "/app/profile", icon: User },
  ];

  return (
    // Replaced max-w-sm with max-w-md for better tablet spacing, upgraded glassmorphism
    <nav className="fixed bottom-6 left-1/2 z-50 flex h-16 w-[95%] sm:w-[85%] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-white/50 bg-white/80 px-2 backdrop-blur-2xl shadow-xl shadow-slate-200/40 md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            // Added flex-1 to distribute items evenly, group for hover states
            className="group relative flex flex-1 flex-col items-center justify-center h-full active:scale-95 transition-transform duration-200"
            style={{ WebkitTapHighlightColor: "transparent" }} // Removes blue tap highlight on mobile
          >
            {/* Animated Active Pill Background */}
            <div
              className={`absolute top-1 flex h-8 w-14 items-center justify-center rounded-full transition-all duration-300 ease-out ${
                isActive
                  ? "bg-[#E41F6A]/10 scale-100 opacity-100"
                  : "bg-slate-100 scale-50 opacity-0 group-hover:scale-90 group-hover:opacity-100"
              }`}
            />

            {/* Icon with scaling and color transitions */}
            <Icon
              className={`relative z-10 mb-1 h-5 w-5 transition-all duration-300 ease-out ${
                isActive
                  ? "text-[#E41F6A] scale-110"
                  : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110"
              }`}
            />

            {/* Text label with slight upward float on active */}
            <span
              className={`relative z-10 text-[10px] tracking-wide transition-all duration-300 ease-out ${
                isActive
                  ? "font-bold text-[#E41F6A] translate-y-0 opacity-100"
                  : "font-medium text-slate-400 translate-y-0.5 opacity-90 group-hover:text-slate-600"
              }`}
            >
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}