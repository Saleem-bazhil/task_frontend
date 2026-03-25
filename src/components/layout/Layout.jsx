import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../pages/Header";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-[#fafafa] font-sans text-slate-800">
      {/* Premium Ambient Background Glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-100/60 blur-[100px]" />
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((current) => !current)} />

      <div className="relative flex h-full w-full flex-1 flex-col transition-all duration-300 md:pl-64 z-10">
        <Header />
        {/* Added pb-24 on mobile for floating BottomNav clearance */}
        <main className="smooth-scroll flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-6 md:pt-4 px-2 md:px-4">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
