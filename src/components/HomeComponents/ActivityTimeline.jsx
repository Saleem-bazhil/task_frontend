import { AlertTriangle, CheckCircle2, Clock3, UserPlus2 } from "lucide-react";

function configFor(action) {
  switch (action) {
    case "completed":
      return { 
        icon: CheckCircle2, 
        color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        glow: "shadow-[0_0_15px_rgba(52,211,153,0.1)]"
      };
    case "in_progress":
      return { 
        icon: Clock3, 
        color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
        glow: "shadow-[0_0_15px_rgba(56,189,248,0.1)]"
      };
    case "assigned":
      return { 
        icon: UserPlus2, 
        color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
        glow: "shadow-[0_0_15px_rgba(129,140,248,0.1)]"
      };
    default:
      return { 
        icon: AlertTriangle, 
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        glow: "shadow-[0_0_15px_rgba(251,191,36,0.1)]"
      };
  }
}

export default function ActivityTimeline({ activities = [] }) {
  return (
    <div className="h-full min-h-[420px] rounded-[2rem] border border-slate-800 bg-[#0f172a] p-8 shadow-2xl overflow-hidden relative">
      {/* Soft Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full" />
      
      <div className="relative mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Activity Timeline</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Latest task movement in your workspace.</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center">
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        </div>
      ) : (
        <div className="relative ml-2 space-y-0">
          {/* Timeline Vertical Line */}
          <div className="absolute left-[19px] top-4 h-[calc(100%-32px)] w-[1px] bg-gradient-to-b from-slate-700 via-slate-800 to-transparent" />

          {activities.map((activity) => {
            const { icon: Icon, color, glow } = configFor(activity.action);
            return (
              <div key={`${activity.action}-${activity.id}`} className="group relative pl-12 pb-8 last:pb-0">
                {/* Icon Circle */}
                <div className={`absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm transition-all duration-300 group-hover:scale-110 ${color} ${glow}`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content Card */}
                <div className="rounded-2xl border border-white/[0.03] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/[0.08]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">{activity.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-400">{activity.detail}</p>
                      
                      <div className="pt-3 flex items-center gap-2">
                         <div className="h-5 w-5 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                            <span className="text-[9px] font-bold text-slate-300">{activity.assigned_to?.username?.charAt(0)}</span>
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                           {activity.assigned_to?.username}
                         </span>
                      </div>
                    </div>
                    
                    <span className="shrink-0 text-[10px] font-medium text-slate-600 tabular-nums">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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