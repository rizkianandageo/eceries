"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Box, ChefHat, Settings, User, ShoppingCart, Sparkles, LogOut, ShieldAlert } from "lucide-react"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Base menu items
const baseItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Box,
  },
  {
    title: "Shopping List",
    url: "/shopping-list",
    icon: ShoppingCart,
  },
  {
    title: "Smart Recipes",
    url: "/recipes",
    icon: ChefHat,
  },
]

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        console.log('[AppSidebar] profile data:', data, 'error:', error);
        if (data) setProfile(data);
      }
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setProfile(null);
        setUser(null);
      } else if (session) {
        fetchUser();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const menuItems = [...baseItems];
  if (profile?.role === 'super_admin') {
    menuItems.push({
      title: "Admin Panel",
      url: "/admin",
      icon: ShieldAlert,
    });
  }

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return "U";
  };

  const displayName = user?.user_metadata?.full_name || profile?.email || "Loading...";
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  return (
    <Sidebar className="border-r border-emerald-100 bg-white/70 backdrop-blur-xl shadow-[4px_0_24px_rgba(16,185,129,0.05)]">
      <SidebarHeader className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img src="/eceries-logo.png" alt="Eceries Logo" className="h-10 w-10 rounded-2xl object-cover bg-white shadow-sm border border-emerald-100 group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute -inset-1 bg-emerald-400 opacity-20 blur-sm rounded-full group-hover:opacity-40 transition-opacity" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-br from-emerald-600 to-teal-800 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-600 transition-colors">
            ECERIES
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4 mt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-800/50 font-bold uppercase tracking-widest text-[10px] mb-4 px-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      render={<Link href={item.url} />}
                      className={`w-full justify-start gap-3 px-4 py-6 rounded-2xl transition-all duration-300 border ${
                        isActive 
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 border-transparent hover:text-white" 
                          : "text-slate-500 border-transparent hover:bg-white hover:text-emerald-700 hover:shadow-sm hover:border-emerald-100/50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-emerald-500/70"}`} />
                      <span className="font-semibold text-[15px]">{item.title}</span>
                      {isActive && <Sparkles className="w-4 h-4 ml-auto text-emerald-100 animate-pulse" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mb-4 flex flex-col gap-3">
        {user ? (
          <>
            {profile?.plan_type !== 'premium' && (
              <Link href="/pricing" className="w-full">
                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-orange-200 hover:from-amber-500 hover:to-orange-600 transition-all hover:scale-[1.02] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  Upgrade to Premium
                </div>
              </Link>
            )}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-50 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-10 w-10 border-2 border-emerald-100 ring-2 ring-white shadow-sm shrink-0">
                  <AvatarImage src={avatarUrl} alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold text-xs">
                    {getInitials(user?.user_metadata?.full_name, profile?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold text-slate-700 leading-none group-hover:text-emerald-700 transition-colors truncate">
                    {displayName}
                  </span>
                  <span className="text-xs text-emerald-600/70 font-medium mt-1 uppercase tracking-wider">
                    {profile?.plan_type || 'FREE'} PLAN
                  </span>
                </div>
              </div>
              <button onClick={handleSignOut} className="p-2 shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <Link href="/login" className="w-full">
            <div className="flex items-center justify-center p-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600 transition-colors font-bold text-sm">
              Sign In
            </div>
          </Link>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
