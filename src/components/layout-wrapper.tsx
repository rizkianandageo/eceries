"use client"

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NotificationsPopover } from "@/components/notifications-popover";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Routes that should NOT have the sidebar and topnav
  const isPublicRoute = pathname === "/" || pathname === "/login";

  if (isPublicRoute) {
    return <main className="flex-1 w-full flex flex-col relative z-0">{children}</main>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full flex flex-col relative z-0">
        <div className="sticky top-0 z-50 px-4 sm:px-6 py-3 flex items-center justify-between min-h-[4rem] border-b border-emerald-100/50 bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(16,185,129,0.05)]">
          {/* Left Side: Sidebar Trigger */}
          <div className="flex-1 flex items-center">
            <SidebarTrigger className="h-10 w-10 bg-white shadow-sm border border-emerald-50 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 transition-all rounded-xl relative z-10" />
          </div>

          {/* Center: Logo & Title */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 pointer-events-none">
            <div className="relative pointer-events-auto group">
              <img src="/eceries-logo.png" alt="Logo" className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl object-cover bg-white shadow-md border border-emerald-100 group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-emerald-400 opacity-20 blur-md rounded-full group-hover:opacity-40 transition-opacity" />
            </div>
            <span className="font-extrabold text-lg sm:text-xl hidden sm:inline-block tracking-tight bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent drop-shadow-sm pointer-events-auto cursor-default">
              E-Groceries Fresh Track
            </span>
          </div>

          {/* Right Side: Actions (e.g., Notifications) */}
          <div className="flex-1 flex justify-end items-center pointer-events-auto">
            <NotificationsPopover />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
