import { motion } from "framer-motion";
import { ChevronRight, Clock, ListTodo, PlayCircle, CheckCircle2 } from "lucide-react";

// Refined Theme: Focused purely on color, glow, and lines (No physical scaling/bouncing)
const TASK_SPACES = [
  { 
    key: "open", 
    title: "Open Tasks", 
    subtitle: "Ready for your next move", 
    icon: ListTodo, 
    theme: {
      text: "text-rose-600",
      bg: "bg-rose-50",
      hoverBg: "group-hover:bg-rose-100",
      accentLine: "bg-rose-500",
      glowShadow: "group-hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.15)]",
      glowBorder: "group-hover:border-rose-200"
    }
  },
  { 
    key: "in_progress", 
    title: "In Progress", 
    subtitle: "Currently in motion", 
    icon: PlayCircle, 
    theme: {
      text: "text-indigo-600",
      bg: "bg-indigo-50",
      hoverBg: "group-hover:bg-indigo-100",
      accentLine: "bg-indigo-500",
      glowShadow: "group-hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.15)]",
      glowBorder: "group-hover:border-indigo-200"
    }
  },
  { 
    key: "pending", 
    title: "Pending", 
    subtitle: "Waiting for your attention", 
    icon: Clock, 
    theme: {
      text: "text-amber-600",
      bg: "bg-amber-50",
      hoverBg: "group-hover:bg-amber-100",
      accentLine: "bg-amber-500",
      glowShadow: "group-hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)]",
      glowBorder: "group-hover:border-amber-200"
    }
  },
  { 
    key: "completed", 
    title: "Completed", 
    subtitle: "Delivered successfully", 
    icon: CheckCircle2, 
    theme: {
      text: "text-emerald-600",
      bg: "bg-emerald-50",
      hoverBg: "group-hover:bg-emerald-100",
      accentLine: "bg-emerald-500",
      glowShadow: "group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]",
      glowBorder: "group-hover:border-emerald-200"
    }
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 400, damping: 30 } }
};

export default function DashboardCards({ stats }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-6"
    >
      {TASK_SPACES.map((card) => {
        const count = stats?.[card.key] ?? (card.key === 'open' ? stats?.total : 0) ?? 0;
        const Icon = card.icon;

        return (
          <motion.div
            variants={itemVariants}
            key={card.key}
            // REMOVED: hover:-translate-y-1. The card stays firmly planted.
            className={`group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 xl:p-6 transition-all duration-300 ${card.theme.glowShadow} ${card.theme.glowBorder}`}
          >
            {/* The expanding accent line (Still acts as the primary visual feedback) */}
            <div className={`absolute bottom-0 left-0 h-[3px] w-0 ${card.theme.accentLine} transition-all duration-300 ease-out group-hover:w-full`} />

            {/* Left Side: Icon & Text */}
            <div className="flex items-center gap-4 min-w-0 z-10">
              {/* REMOVED: group-hover:scale-110 and rotation. Just smooth color transitions. */}
              <div className={`flex h-12 w-12 xl:h-14 xl:w-14 shrink-0 items-center justify-center rounded-[14px] ${card.theme.bg} ${card.theme.text} transition-colors duration-300 ${card.theme.hoverBg}`}>
                <Icon className="h-6 w-6 xl:h-7 xl:w-7" strokeWidth={2.5} />
              </div>
              
              <div className="flex flex-col truncate pr-2">
                <h3 className="truncate text-[15px] xl:text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-slate-950">
                  {card.title}
                </h3>
                <p className="truncate text-[11px] xl:text-xs font-medium text-slate-400 mt-0.5 transition-colors duration-300 group-hover:text-slate-500">
                  {card.subtitle}
                </p>
              </div>
            </div>

            {/* Right Side: Number & Chevron */}
            <div className="flex shrink-0 items-center gap-2 pl-2 z-10">
              <span className="text-2xl xl:text-3xl font-black text-slate-800 transition-colors duration-300 group-hover:text-slate-900">
                {count}
              </span>
              {/* Only the tiny chevron moves slightly, as an indicator to click */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent transition-colors duration-300 group-hover:bg-slate-50">
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-600" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}