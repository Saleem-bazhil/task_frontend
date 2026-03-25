import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="min-h-screen bg-[#f8fafc] selection:bg-pink-100 selection:text-pink-900">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[1600px] space-y-10 p-6 md:p-10 lg:p-12"
      >
        {/* Header Section - Modern Glassmorphic Design */}
        <section className="group relative overflow-hidden rounded-[2.5rem] border border-white bg-white/60 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          {/* Animated Background Accents */}
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-pink-500/10 blur-[80px] transition-all duration-700 group-hover:bg-pink-500/15" />
          <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-6 bg-pink-600/40 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-600/80">Overview</p>
            </div>
            
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Welcome back, <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-pink-600 bg-clip-text text-transparent">{user?.username}</span>
            </h2>
            
            <p className="mt-6 max-w-2xl text-[16px] font-medium leading-relaxed text-slate-500/90 md:text-lg">
              {isAdmin
                ? "Track team delivery, review assignment load, and spot overdue work before it slips."
                : "Review your current workload, recent changes, and upcoming deadlines from one place."}
            </p>
          </div>
        </section>

        {/* Error Alert - Clean & Subtle */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-rose-50/50 px-6 py-4 backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                <p className="text-sm font-bold text-rose-700">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Content Loading State */}
        {isLoading ? (
          <div className="flex min-h-[450px] flex-col items-center justify-center rounded-[2.5rem] border border-slate-100 bg-white shadow-sm relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent animate-[shimmer_2s_infinite]" />
             <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute h-full w-full animate-ping rounded-full bg-pink-500/10" />
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-pink-500" />
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Data</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Cards with Staggered Entrance Feel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <DashboardCards stats={dashboard?.stats} />
            </motion.div>

            {/* Main Layout Grid - Balanced Bento Style */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-10 xl:grid-cols-[1.8fr,1fr]"
            >
              <div className="rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-sm border border-white shadow-sm transition-all duration-300 hover:shadow-md">
                <RecentTasks tasks={dashboard?.recent_tasks} isAdmin={isAdmin} />
              </div>
              
              <div className="rounded-[2.5rem] overflow-hidden bg-white/40 backdrop-blur-sm border border-white shadow-sm transition-all duration-300 hover:shadow-md">
                <ActivityTimeline activities={dashboard?.activities} />
              </div>
            </motion.div>
            
            {/* Floating Widget - Non-intrusive */}
            <div className="fixed bottom-10 right-10 z-50">
               <QuickChatWidget />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}