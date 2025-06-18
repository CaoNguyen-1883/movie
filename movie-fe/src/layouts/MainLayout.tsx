import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import React from "react";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div 
      className={cn(
        "grid min-h-screen w-full transition-[grid-template-columns]",
        isSidebarOpen 
          ? "md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]" 
          : "md:grid-cols-[70px_1fr]"
      )}
    >
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 