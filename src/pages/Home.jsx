import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Plus } from "lucide-react";
import ActivityTimeline from "../components/HomeComponents/ActivityTimeline";
import DashboardCards from "../components/HomeComponents/DashboardCards";
import RecentTasks from "../components/HomeComponents/RecentTasks";
import QuickChatWidget from "../components/chat/QuickChatWidget";
import TaskCreationModal from "../components/HomeComponents/TaskCreationModal";
import { useAuth } from "../context/useAuth";
import { fetchDashboard } from "../services/tasks";

export default function Home() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

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
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-pink-200 selection:text-pink-900">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        /* RESPONSIVE: Tightened spacing on mobile, standard on desktop */
        className="mx-auto max-w-7xl space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8"
      >
        {/* MATCHING MOBILE: The "Personal Hub" Pink Banner */}
        {/* RESPONSIVE: Reduced massive desktop padding, scaled border radius for mobile */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-pink-600 p-6 sm:rounded-[2rem] sm:p-8 lg:p-10 shadow-md shadow-pink-600/10">
          {/* Background decorations */}
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-10 right-0 opacity-10 pointer-events-none">
            <Sparkles className="h-40 w-40 text-white sm:h-48 sm:w-48" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="text-white flex-1">
              {/* Badge */}
              <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 sm:px-4 sm:py-1.5 backdrop-blur-md">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white">
                  Personal Hub
                </span>
              </div>

              {/* RESPONSIVE: Scaled down text so it isn't so huge on desktop */}
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Welcome back, {user?.username || "Guest"}
              </h2>

              <p className="mt-2 sm:mt-3 max-w-xl text-sm sm:text-base text-pink-50/90">
                Stay on top of your work, deadlines, and recent updates without
                leaving the dashboard.
              </p>

              {/* Stats - RESPONSIVE: Flex wrap prevents breaking on tiny phone screens */}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-6 sm:gap-10">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-200">
                    Total Tasks
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-2xl sm:text-3xl font-bold">
                    {dashboard?.stats?.total || 0}
                  </p>
                </div>
                <div className="h-8 sm:h-10 w-px bg-pink-400/50" />
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-200">
                    Due Soon
                  </p>
                  <p className="mt-0.5 sm:mt-1 text-2xl sm:text-3xl font-bold">
                    {dashboard?.stats?.due_soon || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Top right icon with button */}
            <div className="flex flex-col gap-3 items-end">
              <button
                onClick={() => setIsCreationModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-white text-pink-600 hover:bg-pink-50 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Task
              </button>
              <div className="hidden h-14 w-14 sm:flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md lg:h-16 lg:w-16">
                <Sparkles className="h-6 w-6 lg:h-8 lg:w-8" />
              </div>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
                <div className="h-2 w-2 shrink-0 rounded-full bg-rose-500 animate-pulse" />
                <p className="text-sm font-semibold text-rose-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Content Loading State */}
        {isLoading ? (
          <div className="flex min-h-[250px] sm:min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent animate-[shimmer_2s_infinite]" />
            <div className="relative flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-pink-600/20" />
              <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-slate-100 border-t-pink-600" />
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            {/* Task Spaces Header - Scaled for mobile */}
            <div className="pt-2 sm:pt-4 px-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Task Spaces
              </h3>
            </div>

            {/* Dashboard Cards Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DashboardCards stats={dashboard?.stats} />
            </motion.div>

            {/* Main Layout Grid - Tasks & Activity */}
            {/* RESPONSIVE: Stack on mobile, side-by-side on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-[2fr,1fr]"
            >
              {/* <div className="h-full">
                <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
              </div>
               */}
              <div className="h-full">
                <ActivityTimeline activities={dashboard?.activities} />
              </div>
            </motion.div>

            {/* Floating Quick Chat Widget */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
              <QuickChatWidget />
            </div>
          </div>
        )}

        {/* Task Creation Modal */}
        <TaskCreationModal
          isOpen={isCreationModalOpen}
          onClose={() => setIsCreationModalOpen(false)}
          onTaskCreated={async () => {
            try {
              const response = await fetchDashboard();
              setDashboard(response);
            } catch { /* toast already shown in context */ }
          }}
        />
      </motion.div>
    </div>
  );
}
