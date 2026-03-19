import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../../pages/Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-900">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((current) => !current)} />

      <div className="relative flex h-full w-full flex-1 flex-col transition-all duration-300 md:pl-64">
        <Header toggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main className="smooth-scroll flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
