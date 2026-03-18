import { AlertTriangle, CheckCircle2, Clock3, UserPlus2 } from "lucide-react";

function configFor(action) {
  switch (action) {
    case "completed":
      return { icon: CheckCircle2, color: "border-emerald-100 bg-emerald-50 text-emerald-700" };
    case "in_progress":
      return { icon: Clock3, color: "border-indigo-100 bg-indigo-50 text-indigo-700" };
    case "assigned":
      return { icon: UserPlus2, color: "border-sky-100 bg-sky-50 text-sky-700" };
    default:
      return { icon: AlertTriangle, color: "border-slate-100 bg-slate-50 text-slate-700" };
  }
}

export default function ActivityTimeline({ activities = [] }) {
  return (
    <div className="h-full min-h-[420px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Activity Timeline</h2>
        <p className="mt-1 text-sm text-slate-500">Latest task movement in your workspace.</p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No recent activity yet.</div>
      ) : (
        <div className="relative ml-3 space-y-6 border-l border-slate-200">
          {activities.map((activity) => {
            const { icon: Icon, color } = configFor(activity.action);
            return (
              <div key={`${activity.action}-${activity.id}`} className="relative pl-7">
                <div className={`absolute -left-4 top-0 rounded-full border p-1.5 ring-4 ring-white ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{activity.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{activity.detail}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                        {activity.assigned_to?.username}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
