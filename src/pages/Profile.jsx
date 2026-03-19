import { CalendarDays, CheckCircle2, Clock3, ListTodo, Mail, ShieldCheck, Sparkles, User2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "../context/useAuth";
import { fetchProfileOverview } from "../services/tasks";

function formatRole(role) {
  if (!role) {
    return "Employee";
  }

  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Not set";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(user) {
  const first = user?.first_name?.trim()?.[0];
  const last = user?.last_name?.trim()?.[0];
  const username = user?.username?.trim()?.[0];
  return [first, last].filter(Boolean).join("").toUpperCase() || username?.toUpperCase() || "U";
}

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
        if (!cancelled) {
          setError("Unable to load your profile details right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
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

    return {
      completionRate,
      nextDueTask,
      highPriorityOpen,
      recentTasks,
    };
  }, [stats, tasks]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8 lg:p-10 animate-fade-in">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_34%),linear-gradient(135deg,_#0f172a,_#1e293b_55%,_#0ea5e9_140%)] px-8 py-10 text-white">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-white/20 bg-white/10 text-3xl font-semibold shadow-lg backdrop-blur">
                {getInitials(user)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-sky-100">Profile</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">{fullName}</h1>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-100">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    {formatRole(user?.role)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                    <Mail className="h-4 w-4" />
                    {user?.email || "No email on file"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sky-100">Completion</p>
                <p className="mt-2 text-3xl font-semibold">{derived.completionRate}%</p>
                <p className="mt-1 text-sm text-slate-200">Tasks completed across your visible workload.</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sky-100">Focus</p>
                <p className="mt-2 text-3xl font-semibold">{derived.highPriorityOpen}</p>
                <p className="mt-1 text-sm text-slate-200">High-priority open task{derived.highPriorityOpen === 1 ? "" : "s"}.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 p-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Total tasks</p>
                  <ListTodo className="h-5 w-5 text-sky-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.total ?? 0}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">In progress</p>
                  <Clock3 className="h-5 w-5 text-amber-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.in_progress ?? 0}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Completed</p>
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.completed ?? 0}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Due soon</p>
                  <CalendarDays className="h-5 w-5 text-rose-600" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.due_soon ?? 0}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                  <User2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Account details</h2>
                  <p className="text-sm text-slate-500">Live information from your current authenticated session.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Username</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{user?.username || "Not available"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Role</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{formatRole(user?.role)}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Email</p>
                  <p className="mt-2 text-base font-medium text-slate-900">{user?.email || "Not available"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Open items</p>
                  <p className="mt-2 text-base font-medium text-slate-900">
                    {(stats?.pending ?? 0) + (stats?.in_progress ?? 0)} active task{stats && (stats.pending + stats.in_progress) === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Recent task activity</h2>
                  <p className="text-sm text-slate-500">Your most recently updated work items.</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {derived.recentTasks.length > 0 ? (
                  derived.recentTasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{task.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{task.description || "No description provided."}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                          <span className="rounded-full bg-white px-3 py-1">{task.status.replace("_", " ")}</span>
                          <span className="rounded-full bg-white px-3 py-1">{task.priority} priority</span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-400">Updated {formatDate(task.updated_at)}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                    No task activity yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Next due task</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-900">
                {derived.nextDueTask?.title || "Nothing scheduled"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {derived.nextDueTask
                  ? derived.nextDueTask.description || "This task has no description yet."
                  : "You do not have any incomplete tasks with a due date."}
              </p>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Due date</p>
                <p className="mt-1">{formatDate(derived.nextDueTask?.due_date)}</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workload snapshot</p>
              <div className="mt-5 space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Pending</span>
                    <span>{stats?.pending ?? 0}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-sky-500"
                      style={{ width: `${Math.max(((stats?.pending ?? 0) / Math.max(stats?.total ?? 1, 1)) * 100, 8)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>In progress</span>
                    <span>{stats?.in_progress ?? 0}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-amber-500"
                      style={{ width: `${Math.max(((stats?.in_progress ?? 0) / Math.max(stats?.total ?? 1, 1)) * 100, 8)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Completed</span>
                    <span>{stats?.completed ?? 0}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.max(((stats?.completed ?? 0) / Math.max(stats?.total ?? 1, 1)) * 100, 8)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
              <h2 className="mt-3 text-xl font-semibold">Profile page is now connected</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                This view now reads your authenticated account details and task data from the backend instead of showing demo content.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm">
          Loading profile data...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
