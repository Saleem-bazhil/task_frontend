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
    <nav className="fixed bottom-5 left-1/2 z-50 flex h-16 w-[92%] max-w-sm -translate-x-1/2 items-center justify-around rounded-full border border-white/60 bg-white/75 pb-0 pt-0 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? "text-[#E41F6A]" : "text-slate-400 hover:text-slate-900"
            }`}
          >
            <div className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${isActive ? "bg-[#E41F6A]/10" : "bg-transparent"}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
