import { CheckSquare, LayoutDashboard, ListTodo, MessageSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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
    // UPGRADED: Refined the glassmorphism shadow to look like a premium iOS floating dock
    <nav className="fixed bottom-6 left-1/2 z-50 flex h-16 w-[92%] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-slate-200/80 bg-white/90 px-1.5 backdrop-blur-xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] md:hidden">
      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.path);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.path}
            // UPGRADED: Removed hover states (bad for touchscreens), kept the active:scale-95 tap bounce
            className="relative flex flex-1 flex-col items-center justify-center h-full active:scale-95 transition-transform duration-200"
            style={{ WebkitTapHighlightColor: "transparent" }} // Removes ugly blue tap highlight on Android
          >
            {/* THE "WOW" FACTOR: Framer Motion Sliding Pill */}
            {/* Instead of fading in, this pill physically slides to the active tab */}
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute inset-y-1.5 inset-x-1 rounded-full bg-[#E41F6A]/10"
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30 
                }}
              />
            )}

            {/* Icon: Becomes slightly thicker when active to make it pop */}
            <Icon
              className={`relative z-10 mb-0.5 h-[22px] w-[22px] transition-colors duration-300 ${
                isActive ? "text-[#E41F6A]" : "text-slate-400"
              }`}
              strokeWidth={isActive ? 2.5 : 2}
            />

            {/* Text label */}
            <span
              className={`relative z-10 text-[10px] tracking-wide transition-colors duration-300 ${
                isActive ? "font-bold text-[#E41F6A]" : "font-medium text-slate-400"
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