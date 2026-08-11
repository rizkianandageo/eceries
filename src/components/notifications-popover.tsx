"use client";

import { useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useInventoryStore } from "@/store/useInventoryStore";
import { calculateFreshness } from "@/lib/freshness";
import { AlertTriangle, Clock, Frown, Sparkles, XCircle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export function NotificationsPopover() {
  const { items } = useInventoryStore();
  
  const notifications = useMemo(() => {
    const notifs = [];
    
    for (const item of items) {
      const freshness = calculateFreshness(item.expiryDate);
      if (freshness.status === 'warning') {
        notifs.push({
          id: item.id,
          title: "Item Expiring Soon",
          message: `${item.name} is expiring in ${freshness.daysLeft} days. Try making a recipe with it!`,
          type: "warning",
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200"
        });
      } else if (freshness.status === 'critical') {
        notifs.push({
          id: item.id,
          title: "Urgent: Expiring!",
          message: `${item.name} expires ${freshness.daysLeft === 0 ? 'today' : `in ${freshness.daysLeft} day(s)`}. Consume immediately!`,
          type: "critical",
          icon: <AlertTriangle className="w-5 h-5 text-rose-500" />,
          bgColor: "bg-rose-50",
          borderColor: "border-rose-200"
        });
      } else if (freshness.status === 'expired') {
        notifs.push({
          id: item.id,
          title: "Item Expired",
          message: `${item.name} has already expired. Please check before consuming.`,
          type: "expired",
          icon: <XCircle className="w-5 h-5 text-slate-500" />,
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200"
        });
      }
    }
    
    // Sort by most urgent (expired, critical, warning)
    return notifs.sort((a, b) => {
      const order = { expired: 1, critical: 2, warning: 3 };
      return order[a.type as keyof typeof order] - order[b.type as keyof typeof order];
    });
  }, [items]);

  return (
    <Popover>
      <PopoverTrigger render={
        <button className="relative h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm border border-emerald-50 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all group outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-300">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      } />
      <PopoverContent align="end" className="w-80 p-0 sm:w-96 rounded-2xl border-slate-200 shadow-xl overflow-hidden mt-2 bg-white/95 backdrop-blur-xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            Notifications
            {notifications.length > 0 && (
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">
                {notifications.length}
              </span>
            )}
          </h3>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Sparkles className="w-12 h-12 text-emerald-200 mb-3" />
              <p className="font-medium text-slate-600">All good!</p>
              <p className="text-sm text-slate-400 mt-1">None of your ingredients are expiring soon.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-xl border flex gap-3 items-start ${notif.bgColor} ${notif.borderColor}`}>
                  <div className="mt-0.5 shrink-0">
                    {notif.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 leading-tight mb-1">{notif.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))}
              
              <Link href="/recipes" className="w-full">
                <button className="w-full mt-2 py-2 bg-slate-50 hover:bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-dashed border-emerald-200 transition-colors">
                  Find Recipes to Use Them
                </button>
              </Link>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
