"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldAlert, RefreshCw, CheckCircle2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  email: string;
  role: string;
  plan_type: string;
  created_at: string;
}

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    
    if (error) {
      toast.error("Failed to fetch profiles: " + error.message);
    } else if (data) {
      setProfiles(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const togglePlan = async (profileId: string, currentPlan: string) => {
    const newPlan = currentPlan === 'free' ? 'premium' : 'free';
    const { error } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', profileId);

    if (error) {
      toast.error("Failed to update plan: " + error.message);
    } else {
      toast.success(`Plan updated to ${newPlan}`);
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, plan_type: newPlan } : p));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200/50 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 rounded-xl">
              <ShieldAlert className="w-7 h-7 text-rose-600" />
            </div>
            Super Admin Panel
          </h1>
          <p className="text-slate-500 mt-2 text-[15px] max-w-2xl">
            Manage users and their subscription plans. Only accessible by super admins.
          </p>
        </div>
        
        <Button 
          onClick={fetchProfiles} 
          variant="outline"
          className="h-12 px-6 rounded-xl border-slate-200"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="hidden md:table-header-group">
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 font-semibold text-sm text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles.map((profile) => (
                <tr key={profile.id} className="flex flex-col md:table-row hover:bg-slate-50/50 transition-colors group border-b border-slate-100 md:border-none py-4 md:py-0">
                  <td className="px-6 py-2 md:py-4 block md:table-cell">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <UserIcon className="w-5 h-5 text-slate-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">{profile.email}</span>
                        <span className="text-xs text-slate-400 font-mono">{profile.id.split('-')[0]}...</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-2 md:py-4 flex justify-between items-center md:table-cell">
                    <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Role</span>
                    {profile.role === 'super_admin' ? (
                      <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0">Super Admin</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0">User</Badge>
                    )}
                  </td>
                  <td className="px-6 py-2 md:py-4 flex justify-between items-center md:table-cell">
                    <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Plan</span>
                    {profile.plan_type === 'premium' ? (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0 gap-1.5 px-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-500 border-slate-200">Free Plan</Badge>
                    )}
                  </td>
                  <td className="px-6 py-2 md:py-4 flex justify-between items-center md:table-cell text-sm text-slate-500">
                    <span className="md:hidden text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</span>
                    {format(new Date(profile.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 md:text-right block md:table-cell mt-2 md:mt-0">
                    <Button 
                      variant={profile.plan_type === 'free' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => togglePlan(profile.id, profile.plan_type)}
                      className={profile.plan_type === 'free' 
                        ? 'w-full md:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm' 
                        : 'w-full md:w-auto border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700'}
                    >
                      {profile.plan_type === 'free' ? 'Upgrade to Premium' : 'Downgrade to Free'}
                    </Button>
                  </td>
                </tr>
              ))}
              
              {profiles.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
