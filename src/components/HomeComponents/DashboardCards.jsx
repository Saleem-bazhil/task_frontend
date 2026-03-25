import { AlertTriangle, CheckCircle2, Clock, ListTodo, PlayCircle, TimerReset } from "lucide-react";

const CARD_CONFIG = [
  {
    key: "total",
    title: "Total Tasks",
    icon: ListTodo,
    color: "bg-pink-50 text-pink-700",
    subtitle: "All visible tasks",
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock,
    color: "bg-amber-50 text-amber-700",
    subtitle: "Waiting to start",
  },
  {
    key: "in_progress",
    title: "In Progress",
    icon: PlayCircle,
    color: "bg-pink-50 text-pink-700",
    subtitle: "Active work now",
  },
  {
    key: "completed",
    title: "Completed",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-700",
    subtitle: "Finished tasks",
  },
  {
    key: "overdue",
    title: "Overdue",
    icon: AlertTriangle,
    color: "bg-rose-50 text-rose-700",
    subtitle: "Past due date",
  },
  {
    key: "due_soon",
    title: "Due Soon",
    icon: TimerReset,
    color: "bg-orange-50 text-orange-700",
    subtitle: "Next 7 days",
  },
];

function StatCard({ title, count, icon, color, subtitle }) {
  const CardIcon = icon;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/50 to-transparent transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-700">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900 transition-colors group-hover:text-[#E41F6A]">{count}</h3>
        </div>
        <div className={`rounded-2xl p-3 transition-transform duration-300 group-hover:scale-110 ${color}`}>
          <CardIcon className="h-6 w-6" />
        </div>
      </div>
      <p className="relative z-10 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function DashboardCards({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {CARD_CONFIG.map((card) => (
        <StatCard
          key={card.key}
          title={card.title}
          count={stats?.[card.key] ?? 0}
          icon={card.icon}
          color={card.color}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  );
}

