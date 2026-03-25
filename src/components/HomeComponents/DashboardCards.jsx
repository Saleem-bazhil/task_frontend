import { AlertTriangle, CheckCircle2, Clock, ListTodo, PlayCircle, TimerReset } from "lucide-react";
import { motion } from "framer-motion";

const CARD_CONFIG = [
  { key: "total", title: "Total Tasks", icon: ListTodo, theme: "from-pink-500 to-rose-500", subtitle: "All workspace activity" },
  { key: "pending", title: "Pending", icon: Clock, theme: "from-amber-400 to-orange-500", subtitle: "Awaiting kickoff" },
  { key: "in_progress", title: "In Progress", icon: PlayCircle, theme: "from-blue-500 to-indigo-600", subtitle: "Currently being refined" },
  { key: "completed", title: "Completed", icon: CheckCircle2, theme: "from-emerald-400 to-teal-600", subtitle: "Successfully executed" },
  { key: "overdue", title: "Overdue", icon: AlertTriangle, theme: "from-rose-600 to-red-700", subtitle: "Critical attention required" },
  { key: "due_soon", title: "Due Soon", icon: TimerReset, theme: "from-orange-400 to-yellow-500", subtitle: "Upcoming deadlines" },
];

function StatCard({ title, count, icon: Icon, theme, subtitle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-[2.5rem] p-[2px] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]"
    >
      {/* --- SaaS BORDER ANIMATION --- */}
      <div className={`absolute inset-0 bg-gradient-to-r ${theme} opacity-20 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite]`} 
           style={{ backgroundSize: '200% 200%' }} />

      {/* Main Card Body */}
      <div className="relative h-full w-full rounded-[calc(2.5rem-2px)] bg-white/90 p-8 backdrop-blur-3xl transition-colors duration-500 group-hover:bg-white/95">
        
        {/* Animated Background Mesh Glow */}
        <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${theme} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-15`} />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <Icon className="h-7 w-7 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status</span>
               <div className={`mt-2 h-2 w-2 rounded-full bg-gradient-to-r ${theme} animate-pulse`} />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-5xl font-black tracking-tighter text-slate-900 group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              {count}
            </h3>
            <p className="mt-2 text-[15px] font-bold tracking-tight text-slate-500 group-hover:text-slate-900 transition-colors">
              {title}
            </p>
          </div>

          <div className="mt-auto pt-8">
            <div className="h-[1px] w-full bg-slate-100 transition-colors group-hover:bg-slate-200" />
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {CARD_CONFIG.map((card, index) => (
        <StatCard
          key={card.key}
          index={index}
          title={card.title}
          count={stats?.[card.key] ?? 0}
          icon={card.icon}
          theme={card.theme}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
}