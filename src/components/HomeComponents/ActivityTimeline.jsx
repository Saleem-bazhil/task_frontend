import { CheckCircle2, Clock, MessageSquare, PlayCircle, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

// Helper to map activity types to the exact mobile colors
function configFor(action) {
  const actionLower = action?.toLowerCase() || "";
  
  if (actionLower.includes("complete")) {
    return {
      icon: CheckCircle2,
      iconBg: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-500",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-600",
      label: "Completed"
    };
  }
  if (actionLower.includes("progress") || actionLower.includes("start")) {
    return {
      icon: PlayCircle,
      iconBg: "bg-indigo-50 border-indigo-200",
      iconColor: "text-indigo-500",
      badgeBg: "bg-indigo-50",
      badgeText: "text-indigo-600",
      label: "In Progress"
    };
  }
  if (actionLower.includes("assigned") || actionLower.includes("create")) {
    return {
      icon: PlusCircle,
      iconBg: "bg-rose-50 border-rose-200",
      iconColor: "text-rose-500",
      badgeBg: "bg-rose-50",
      badgeText: "text-rose-600",
      label: "Assigned"
    };
  }
  
  // Default fallback
  return {
    icon: Clock,
    iconBg: "bg-slate-50 border-slate-200",
    iconColor: "text-slate-500",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
    label: "Updated"
  };
}

// Framer Motion staggered animations for Desktop "Wow" factor
const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function ActivityTimeline({ activities = [] }) {
  return (
    // Changed from dark bg-[#0f172a] to clean white bg-white
    <div className="relative flex h-full w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-500 hover:shadow-md">
      
      {/* Header Section - Matching the mobile "Recent Updates" text */}
      <div className="flex flex-col gap-1 border-b border-slate-100 p-5 md:p-6 lg:p-7">
        <span className="text-[10px] font-bold uppercase tracking-widest text-pink-600/80">
          Recent Updates
        </span>
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
            Activity Timeline
            </h2>
            {/* Kept your pulsing green dot indicator */}
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
        </div>
        <p className="mt-1 text-xs font-medium text-slate-500 md:text-sm">
          A clear stream of movement across the work happening in your space.
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50/30 py-16">
          <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">No recent activity yet.</p>
        </div>
      ) : (
        <div className="relative flex-1 p-5 md:p-6 lg:p-7 overflow-hidden">
          
          {/* The Continuous Vertical Timeline Line */}
          <div className="absolute bottom-0 left-[37px] top-8 md:left-[41px] lg:left-[45px] w-[2px] bg-slate-100" />

          <motion.div 
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {activities.map((activity) => {
              const style = configFor(activity.action);
              const Icon = style.icon;

              return (
                <motion.div 
                  variants={itemVariants}
                  key={`${activity.action}-${activity.id}`} 
                  // WOW EFFECT: Row hover creates a soft highlight
                  className="group relative flex gap-4 md:gap-5 items-start rounded-xl p-2 -mx-2 transition-colors duration-300 hover:bg-slate-50/80"
                >
                  
                  {/* Icon Node matching mobile (Green Checkmark, etc.) */}
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white md:h-9 md:w-9">
                    <div className={`flex h-6 w-6 md:h-7 md:w-7 items-center justify-center rounded-full border ${style.iconBg} ${style.iconColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Activity Content */}
                  <div className="flex flex-1 flex-col pt-1">
                    <div className="flex items-start justify-between gap-3">
                      
                      {/* Left: Task Title & Detail */}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-[15px] font-bold text-slate-900 transition-colors group-hover:text-slate-950">
                          {activity.title || "Task Updated"}
                        </span>
                        <p className="mt-0.5 text-[13px] text-slate-500 line-clamp-2">
                           {activity.detail || "Action completed"}
                        </p>
                      </div>

                      {/* Right: Mobile-style Badge (e.g., green "Completed") */}
                      <span className={`shrink-0 rounded-md px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider md:px-3 md:py-1.5 md:text-[10px] ${style.badgeBg} ${style.badgeText} transition-shadow duration-300 group-hover:shadow-sm`}>
                        {style.label}
                      </span>
                    </div>

                    {/* Meta Data matching mobile: User • Time */}
                    <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-indigo-500 transition-colors">
                                {activity.assigned_to?.username || "SYSTEM"}
                            </span>
                        </div>
                        
                        <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                        </span>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        </div>
      )}
    </div>
  );
}