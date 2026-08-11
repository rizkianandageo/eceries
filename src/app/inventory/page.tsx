"use client";

import { useState, useEffect } from "react";
import { useInventoryStore } from "@/store/useInventoryStore";
import { calculateFreshness } from "@/lib/freshness";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { enUS } from "date-fns/locale";
import { ShoppingCart } from "lucide-react";

export default function InventoryPage() {
  const { items, removeItem, addShoppingItem } = useInventoryStore();
  const isLoaded = useInventoryStore((state) => state.isLoaded);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const itemsWithFreshness = items.map(item => ({
    ...item,
    freshness: calculateFreshness(item.expiryDate)
  }));

  // Sort by days left (ascending)
  itemsWithFreshness.sort((a, b) => a.freshness.daysLeft - b.freshness.daysLeft);

  return (
    <div className="space-y-6 p-2 sm:p-6 text-slate-800">
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
          Inventory List
        </h1>
        <p className="text-slate-600 font-medium">
          All food items in your fridge and pantry.
        </p>
      </div>

      {itemsWithFreshness.length === 0 ? (
        <Card className="bg-white/40 backdrop-blur-md border-white/60">
          <CardContent className="p-12 text-center text-slate-500 font-medium flex flex-col items-center justify-center">
            <div className="text-5xl mb-4">🛒</div>
            <p>No items added yet.</p>
            <p className="text-sm mt-2">Go to the Dashboard to add new items.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:h-[calc(100vh-220px)] md:min-h-[500px]">
          {(["Pantry", "Chiller", "Freezer"] as const).map((loc) => {
            const locItems = itemsWithFreshness.filter(item => item.location === loc);
            if (locItems.length === 0) return null;
            
            return (
              <div key={loc} className="flex flex-col h-full bg-slate-100/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm overflow-hidden">
                <div className="flex-none p-5 bg-white/40 border-b border-white/50 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold flex items-center gap-2 text-emerald-900">
                    <span className="text-2xl">{loc === "Chiller" ? "❄️" : loc === "Freezer" ? "🧊" : "🧺"}</span>
                    {loc}
                  </h2>
                  <div className="px-3 py-1 bg-emerald-100/80 text-emerald-800 font-bold text-sm rounded-full shadow-inner border border-emerald-200/50">
                    {locItems.length} {locItems.length === 1 ? 'Item' : 'Items'}
                  </div>
                </div>
                
                <div className="flex-1 flex overflow-x-auto md:overflow-y-auto md:overflow-x-hidden flex-row md:flex-col p-4 gap-4 md:gap-0 md:space-y-4 scrollbar-thin scrollbar-thumb-emerald-200/50 scrollbar-track-transparent">
                  {locItems.map((item) => (
                    <Card 
                      key={item.id} 
                      className={`bg-white/70 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden group shrink-0 w-[280px] md:w-auto border relative
                        ${item.freshness.status === 'fresh' ? 'border-emerald-200/50 hover:shadow-emerald-500/10 hover:border-emerald-300' : 
                          item.freshness.status === 'warning' ? 'border-yellow-200/50 hover:shadow-yellow-500/10 hover:border-yellow-300' : 
                          item.freshness.status === 'critical' ? 'border-orange-200/50 hover:shadow-orange-500/10 hover:border-orange-300' : 
                          'border-red-200/50 hover:shadow-red-500/10 hover:border-red-300'}`}
                    >
                      {/* Subtle background glow effect */}
                      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none
                        ${item.freshness.status === 'fresh' ? 'bg-emerald-500' : 
                          item.freshness.status === 'warning' ? 'bg-yellow-500' : 
                          item.freshness.status === 'critical' ? 'bg-orange-500' : 'bg-red-500'}`} 
                      />
                      
                      <CardContent className="p-4 relative z-10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              {/* Glowing LED Status Dot */}
                              <span className="relative flex h-2.5 w-2.5 shrink-0">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60
                                  ${item.freshness.status === 'fresh' ? 'bg-emerald-400' : 
                                    item.freshness.status === 'warning' ? 'bg-yellow-400' : 
                                    item.freshness.status === 'critical' ? 'bg-orange-400' : 'bg-red-400'}`}>
                                </span>
                                <span className={`relative inline-flex rounded-full h-2.5 w-2.5
                                  ${item.freshness.status === 'fresh' ? 'bg-emerald-500' : 
                                    item.freshness.status === 'warning' ? 'bg-yellow-500' : 
                                    item.freshness.status === 'critical' ? 'bg-orange-500' : 'bg-red-500'}`}>
                                </span>
                            </span>
                            <div>
                              <h3 className="font-bold text-lg text-slate-800 mb-1.5 leading-tight">{item.name}</h3>
                              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100 text-[10px] uppercase tracking-widest font-semibold">{item.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1">
                            <button 
                              onClick={() => {
                                addShoppingItem(item.name, item.category);
                                alert(`Added ${item.name} to Shopping List!`);
                              }}
                              className="text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors p-2 rounded-full shrink-0"
                              title="Add to Shopping List"
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors p-2 rounded-full shrink-0"
                              title="Delete item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2.5 ml-4">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 font-medium">Expiry:</span>
                            <span className="font-semibold text-slate-700 bg-white/60 shadow-sm border border-slate-100 px-2 py-1 rounded-md backdrop-blur-sm">{format(parseISO(item.expiryDate), 'MMM d, yyyy', { locale: enUS })}</span>
                          </div>
                          
                          <div className="w-full bg-slate-200/60 rounded-full h-1.5 overflow-hidden backdrop-blur-sm">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${item.freshness.status === 'fresh' ? 'bg-emerald-500' : item.freshness.status === 'warning' ? 'bg-yellow-500' : item.freshness.status === 'critical' ? 'bg-orange-500' : 'bg-red-500'}`} 
                              style={{ width: `${Math.max(5, Math.min(100, (item.freshness.daysLeft / 14) * 100))}%` }}
                            ></div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/40">
                            <Badge className={`${item.freshness.colorClass} shadow-sm border-none text-[10px] font-bold px-2 py-0.5`}>
                              {item.freshness.statusText}
                            </Badge>
                            <span className={`text-xs font-bold ${item.freshness.daysLeft < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                              {item.freshness.daysLeft < 0 ? 'Expired' : `${item.freshness.daysLeft} days`}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
