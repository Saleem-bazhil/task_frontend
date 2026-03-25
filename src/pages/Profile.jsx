import { CalendarDays, CheckCircle2, Clock, ListTodo, Mail, PlayCircle, ShieldCheck, Sparkles, User2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useAuth } from "../context/useAuth";
import { fetchProfileOverview } from "../services/tasks";

function formatRole(role) {
  if (!role) return "Employee";
  return role.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function formatDate(dateValue) {
  if (!dateValue) return "Not set";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not set";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function getInitials(user) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const username = user?.username?.trim()?.[0];
  return [first, last].filter(Boolean).join("").toUpperCase() || username?.toUpperCase() || "U";
}

// Framer Motion Animation Variants for initial page load only
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Profile() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);
      try {
        const response = await fetchProfileOverview();
        if (!cancelled) {
          setOverview(response);
          setError("");
        }
      } catch {
        if (!cancelled) setError("Unable to load your profile details right now.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, []);

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() || user?.username || "User";
  const stats = overview?.dashboard?.stats;
  const tasks = overview?.tasks ?? [];

  const derived = useMemo(() => {
    const completed = stats?.completed ?? 0;
    const total = stats?.total ?? 0;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const nextDueTask = tasks
      .filter((task) => task.due_date && task.status !== "completed")
      .sort((left, right) => new Date(left.due_date) - new Date(right.due_date))[0];

    const highPriorityOpen = tasks.filter(
      (task) => task.priority === "high" && task.status !== "completed"
    ).length;

    const recentTasks = [...tasks]
      .sort((left, right) => new Date(right.updated_at) - new Date(left.updated_at))
      .slice(0, 4);

    return { completionRate, nextDueTask, highPriorityOpen, recentTasks };
  }, [stats, tasks]);

  return (
    <div className="w-full bg-[#F8F9FA] px-4 py-5 md:px-6 lg:px-8">
      
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <p className="text-sm font-semibold text-rose-700">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent animate-[shimmer_2s_infinite]" />
          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute h-full w-full animate-ping rounded-full bg-pink-600/20" />
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-100 border-t-pink-600" />
          </div>
        </div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6">
          
          {/* HEADER SECTION - Matches the "Renderways" Mobile Profile Header */}
          <motion.section variants={itemVariants} className="relative overflow-hidden rounded-[2rem] bg-[#E41F6A] p-6 md:p-8 lg:p-10 shadow-sm">
            {/* Background Accents */}
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-[40px]" />
            <div className="absolute bottom-0 right-10 opacity-10 pointer-events-none">
              <Sparkles className="h-48 w-48 text-white" />
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center rounded-full bg-white/20 px-3 py-1 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Profile</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* User Info */}
                <div className="flex items-center gap-5 min-w-0">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-black text-[#E41F6A] shadow-md">
                    {getInitials(user)}
                  </div>
                  <div className="min-w-0">
                    <h1 className="truncate text-3xl font-bold tracking-tight text-white md:text-4xl">
                      {fullName}
                    </h1>
                    <p className="text-pink-100 font-medium mt-0.5 truncate">@{user?.username || "user"}</p>
                    
                    {/* Role & Email Pills */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {formatRole(user?.role)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold tracking-wide text-white backdrop-blur-md">
                        <Mail className="h-3.5 w-3.5" />
                        {user?.email ? "Email verified" : "No email"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Completion Rate Dark Card */}
                <div className="flex w-full md:w-auto flex-col justify-center rounded-2xl bg-slate-900 px-6 py-5 text-white shadow-lg md:min-w-[280px]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Completion Rate</p>
                  <div className="mt-1 flex items-end justify-between">
                    <span className="text-4xl font-black">{derived.completionRate}%</span>
                    <span className="mb-1 rounded-md bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300">
                      {stats?.total ?? 0} Tasks
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${derived.completionRate}%` }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-[#E41F6A]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* WORKLOAD SNAPSHOT - Stable, flat cards with expanded padding */}
          <motion.section variants={itemVariants} className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E41F6A]/80">Snapshot</span>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Workload overview</h2>
              <p className="mt-1 text-xs font-medium text-slate-500 md:text-sm">A quick view of active work, completed delivery, and deadlines.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {/* Total Card */}
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <ListTodo className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
                <p className="mt-0.5 text-2xl font-black text-slate-900">{stats?.total ?? 0}</p>
              </div>

              {/* Pending Card */}
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                  <Clock className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Pending</p>
                <p className="mt-0.5 text-2xl font-black text-slate-900">{stats?.pending ?? 0}</p>
              </div>

              {/* In Progress Card */}
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                  <PlayCircle className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">In Progress</p>
                <p className="mt-0.5 text-2xl font-black text-slate-900">{stats?.in_progress ?? 0}</p>
              </div>

              {/* Completed Card */}
              <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">Completed</p>
                <p className="mt-0.5 text-2xl font-black text-slate-900">{stats?.completed ?? 0}</p>
              </div>
            </div>
          </motion.section>

          {/* LOWER GRID: Recent Activity & Details */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
            
            {/* Left Column: Recent Task Activity */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-slate-100 p-5 md:p-6 bg-slate-50/50">
                <h2 className="text-base font-bold text-slate-900">Recent task activity</h2>
                <p className="mt-0.5 text-xs text-slate-500">Your most recently updated work items.</p>
              </div>
              
              <div>
                {derived.recentTasks.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {derived.recentTasks.map((task) => (
                      <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors duration-300 hover:bg-slate-50">
                        <div className="flex flex-col min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900">{task.title}</p>
                          <p className="mt-0.5 truncate text-xs text-slate-500">{task.description || "No description provided."}</p>
                        </div>
                        <div className="flex shrink-0 flex-col sm:items-end gap-2">
                           <span className="inline-flex w-fit items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                              {task.status.replace("_", " ")}
                           </span>
                           <span className="text-[10px] font-medium text-slate-400">
                             {formatDate(task.updated_at)}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <ListTodo className="h-8 w-8 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No task activity yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Account Details & Next Due */}
            <div className="space-y-6">
              
              {/* Account Details */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-[#E41F6A]/10 p-2.5 text-[#E41F6A]">
                    <User2 className="h-4 w-4" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900">Account Details</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Username</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{user?.username || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email Address</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{user?.email || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Open Action Items</p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                       {(stats?.pending ?? 0) + (stats?.in_progress ?? 0)} Active Task{(stats?.pending ?? 0) + (stats?.in_progress ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Due Task */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Next Due Task</p>
                <h2 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                  {derived.nextDueTask?.title || "Nothing scheduled"}
                </h2>
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5 text-sm text-slate-600">
                  <CalendarDays className="h-4 w-4 text-[#E41F6A]" />
                  <span className="font-semibold text-xs">{formatDate(derived.nextDueTask?.due_date)}</span>
                </div>
              </div>

            </div>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}