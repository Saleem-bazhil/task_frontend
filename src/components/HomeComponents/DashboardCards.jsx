import { AlertTriangle, CheckCircle2, Clock, ListTodo, PlayCircle, TimerReset } from "lucide-react";

const CARD_CONFIG = [
  {
    key: "total",
    title: "Total Tasks",
    icon: ListTodo,
    color: "bg-sky-50 text-sky-700",
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
    color: "bg-indigo-50 text-indigo-700",
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
    <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-semibold text-slate-900">{count}</h3>
        </div>
        <div className={`rounded-2xl p-3 ${color}`}>
          <CardIcon className="h-6 w-6" />
        </div>
      </div>
      <p className="text-sm text-slate-400">{subtitle}</p>
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
