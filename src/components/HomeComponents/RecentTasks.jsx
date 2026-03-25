import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Circle, LayOut, Plus } from "lucide-react";

// Professional Gradient Priority Tags
function priorityClasses(priority) {
  switch (priority) {
    case "high":
      return "bg-rose-50/50 text-rose-600 border-rose-100/50 ring-1 ring-rose-200/30 shadow-[0_2px_10px_-3px_rgba(225,29,72,0.2)]";
    case "medium":
      return "bg-amber-50/50 text-amber-600 border-amber-100/50 ring-1 ring-amber-200/30 shadow-[0_2px_10px_-3px_rgba(217,119,6,0.2)]";
    case "low":
      return "bg-emerald-50/50 text-emerald-600 border-emerald-100/50 ring-1 ring-emerald-200/30 shadow-[0_2px_10px_-3px_rgba(5,150,105,0.2)]";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
}

// Professional "Status Pill" with Micro-Glow
function statusClasses(status) {
  switch (status) {
    case "completed":
      return "bg-emerald-500 text-white shadow-[0_4px_12px_-2px_rgba(16,185,129,0.4)]";
    case "in_progress":
      return "bg-indigo-600 text-white shadow-[0_4px_12px_-2px_rgba(79,70,229,0.4)]";
    case "pending":
      return "bg-slate-700 text-white shadow-[0_4px_12px_-2px_rgba(51,65,85,0.4)]";
    default:
      return "bg-slate-400 text-white";
  }
}

function formatStatus(status) {
  return status === "in_progress" ? "In Progress" : `${status?.charAt(0).toUpperCase()}${status?.slice(1)}`;
}

export default function RecentTasks({ tasks = [], isAdmin }) {
  return (
    <div className="relative w-full rounded-[3rem] border border-slate-200/60 bg-[#FBFBFC] p-4 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
      
      {/* Header Section: Modern & Spacious */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-10 py-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-8 bg-indigo-600 rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-600/80">Active Workflow</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter text-slate-900 lg:text-5xl">Recent Tasks</h2>
          <p className="max-w-md text-sm font-medium leading-relaxed text-slate-500/80">
            {isAdmin ? "Oversee latest assignments across the workspace." : "Stay updated on your current work trajectory."}
          </p>
        </div>
        
        <Link 
          to="/app/my-tasks" 
          className="group relative flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 px-8 text-sm font-bold text-white transition-all hover:bg-black hover:shadow-2xl active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            Explore All Tasks
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-2" />
          </span>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white border border-dashed border-slate-200 py-20">
          <div className="rounded-full bg-slate-50 p-4 text-slate-300">
            <LayOut className="h-8 w-8" />
          </div>
          <p className="mt-4 text-sm font-bold text-slate-400">Queue is currently empty</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="inline-block min-w-full align-middle px-4">
            {/* Custom Table Head (Floating) */}
            <div className="grid grid-cols-5 px-10 mb-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              <div className="col-span-2">Task / Identity</div>
              <div className="text-center">Complexity</div>
              <div className="text-center">Current Phase</div>
              <div className="text-right">Expected Date</div>
            </div>

            {/* Task Rows as Bento Cards */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="group grid grid-cols-5 items-center rounded-[2rem] border border-white bg-white px-8 py-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-all duration-500 hover:translate-y-[-4px] hover:border-slate-200 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.06)]"
                >
                  {/* Task Info */}
                  <div className="col-span-2 flex items-center gap-5">
                    <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        <span className="text-xs font-black uppercase tracking-tighter">
                             {task.title?.substring(0, 2)}
                        </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[17px] font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </span>
                      <span className="mt-0.5 line-clamp-1 text-xs font-semibold text-slate-400/80">
                         {isAdmin ? `Assigned to ${task.user?.username || "Unassigned"}` : "Direct Assignment"}
                      </span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${priorityClasses(task.priority)}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                      {task.priority}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] transition-transform duration-500 group-hover:scale-110 ${statusClasses(task.status)}`}>
                      {formatStatus(task.status)}
                    </span>
                  </div>

                  {/* Date/Timeline */}
                  <div className="flex items-center justify-end gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-slate-700">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "No Date"}
                      </span>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                         <CalendarDays className="h-3 w-3" />
                         <span>Deadline</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subtle Footer Action */}
      <div className="flex items-center justify-center p-6">
         <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors hover:text-indigo-600">
            <Plus className="h-4 w-4" />
            Quick Add New Task
         </button>
      </div>
    </div>
  );
}