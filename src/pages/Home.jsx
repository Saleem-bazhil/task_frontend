import { useEffect, useState } from "react";
import ActivityTimeline from "../components/HomeComponents/ActivityTimeline";
import DashboardCards from "../components/HomeComponents/DashboardCards";
import RecentTasks from "../components/HomeComponents/RecentTasks";
import QuickChatWidget from "../components/chat/QuickChatWidget";
import { useAuth } from "../context/useAuth";
import { fetchDashboard } from "../services/tasks";

export default function Home() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const response = await fetchDashboard();
        if (!cancelled) {
          setDashboard(response);
          setError("");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load the dashboard right now.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = dashboard?.viewer_role === "admin";

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-6 md:p-8 lg:p-10 animate-fade-in">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(228,31,106,0.14),_transparent_32%),linear-gradient(135deg,_#ffffff,_#f8fafc)] p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.32em] text-pink-700">Overview</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">
          Welcome back, {user?.username}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          {isAdmin
            ? "Track team delivery, review assignment load, and spot overdue work before it slips."
            : "Review your current workload, recent changes, and upcoming deadlines from one place."}
        </p>
      </section>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
          Loading dashboard...
        </div>
      ) : (
        <>
          <DashboardCards stats={dashboard?.stats} />

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
            <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
            <ActivityTimeline activities={dashboard?.activities} />
          </div>
          <QuickChatWidget />
        </>
      )}
    </div>
  );
}


