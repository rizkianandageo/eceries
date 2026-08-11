"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useInventoryStore } from "@/store/useInventoryStore";
import { calculateFreshness } from "@/lib/freshness";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AddItemForm } from "@/components/add-item-form";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function HomeContent() {
  const items = useInventoryStore((state) => state.items);
  const isLoaded = useInventoryStore((state) => state.isLoaded);
  
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const searchParams = useSearchParams();
  const prefillName = searchParams?.get("prefillName");
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "User";
        setUserName(name);
      }
    };
    fetchUser();
  }, []);

  // Auto-open sheet if prefillName is provided
  useEffect(() => {
    if (prefillName) {
      setIsAddSheetOpen(true);
    }
  }, [prefillName]);
  
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

  const totalItems = items.length;
  const freshItems = itemsWithFreshness.filter(item => item.freshness.status === 'fresh').length;
  const expiringItems = itemsWithFreshness.filter(
    item => item.freshness.status === 'warning' || item.freshness.status === 'critical' || item.freshness.status === 'expired'
  );

  // Sort expiring items by daysLeft (ascending)
  expiringItems.sort((a, b) => a.freshness.daysLeft - b.freshness.daysLeft);
  
  // Show only top 5 expiring
  const topExpiring = expiringItems.slice(0, 5);

  return (
    <div className="space-y-6 relative z-10 p-2 sm:p-6 text-slate-800 min-h-screen">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-400">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-600 font-medium text-lg">
            Here is your ECERIES inventory summary.
          </p>
        </div>

        <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
          <SheetTrigger 
            render={
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-5 w-5" /> Add Item
              </Button>
            }
          />
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>Add New Item</SheetTitle>
              <SheetDescription>
                Enter item details to track its freshness.
              </SheetDescription>
            </SheetHeader>
            <AddItemForm onSuccess={() => setIsAddSheetOpen(false)} prefillName={prefillName || undefined} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Stat Cards */}
        <Card className="bg-white/40 backdrop-blur-2xl border-white/60 shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-800">{totalItems}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Across all storage locations
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/40 backdrop-blur-2xl border-green-500/20 shadow-xl shadow-green-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-green-600 uppercase tracking-wider">Fresh (Safe)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-green-600 drop-shadow-sm">{freshItems}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Items in optimal condition
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white/40 backdrop-blur-2xl border-amber-500/20 shadow-xl shadow-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-amber-600 drop-shadow-sm">{expiringItems.length}</div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Expiring soon
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 bg-white/40 backdrop-blur-2xl border-white/60 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-white/30 bg-white/20 pb-4">
          <CardTitle className="text-xl text-slate-800">Consumption Priority (Expiring Soon)</CardTitle>
          <CardDescription className="text-slate-600 font-medium">Items you should cook immediately.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {topExpiring.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-medium">
              <p>Great! No items are expiring soon.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {topExpiring.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-white/30 hover:bg-white/50 transition-colors duration-300 last:border-0 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${
                      item.freshness.status === 'expired' ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' :
                      item.freshness.status === 'critical' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 
                      'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    }`} />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-lg text-slate-800">{item.name}</span>
                      <span className="text-sm text-slate-500 font-semibold">{item.category} • {item.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge 
                      variant="outline" 
                      className={`${item.freshness.colorClass} px-3 py-1 font-bold shadow-sm whitespace-nowrap`}
                    >
                      {item.freshness.daysLeft < 0 ? `Expired for ${Math.abs(item.freshness.daysLeft)} days` :
                       item.freshness.daysLeft === 0 ? "EXPIRES TODAY" : 
                       `${item.freshness.daysLeft} DAYS LEFT`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Dashboard...</div>}>
      <HomeContent />
    </Suspense>
  );
}
