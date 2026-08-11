"use client";

import { useState } from "react";
import { Check, X, Sparkles, Zap, Shield, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PricingPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    // Simulate a payment gateway delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ plan_type: 'premium' })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Welcome to Premium! Your account has been upgraded.");
      setIsCheckoutOpen(false);
      
      // Reload the page to reflect changes in sidebar and layout
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error: any) {
      toast.error(error.message || "Failed to upgrade. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Upgrade Your Experience
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Choose the plan that best fits your kitchen. Go Premium to unlock the full power of Eceries AI and never waste food again.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Free Tier */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col">
          <div className="space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-slate-800">Basic Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 font-medium">/forever</span>
            </div>
            <p className="text-slate-500">Essential tools to track your inventory.</p>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-600"><Check className="w-4 h-4" /></div>
                <span className="text-slate-700">Track up to 50 ingredients</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-600"><Check className="w-4 h-4" /></div>
                <span className="text-slate-700">Basic Expiry Alerts</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-600"><Check className="w-4 h-4" /></div>
                <span className="text-slate-700">Simple Shopping List</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="p-1 rounded-full bg-slate-100 text-slate-400"><X className="w-4 h-4" /></div>
                <span className="text-slate-500 line-through">AI Smart Recipes</span>
              </div>
              <div className="flex items-center gap-3 opacity-50">
                <div className="p-1 rounded-full bg-slate-100 text-slate-400"><X className="w-4 h-4" /></div>
                <span className="text-slate-500 line-through">Priority Support</span>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-8 h-12 rounded-xl border-slate-200" disabled>
            Current Plan
          </Button>
        </div>

        {/* Premium Tier */}
        <div className="bg-gradient-to-b from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 text-white flex flex-col relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Zap className="w-32 h-32" />
          </div>
          <div className="space-y-4 flex-1 relative z-10">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
              Recommended
            </div>
            <h3 className="text-2xl font-bold">Premium Plan</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold">$4.99</span>
              <span className="text-emerald-100 font-medium">/month</span>
            </div>
            <p className="text-emerald-100">Unlock the full potential of your kitchen.</p>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                <span>Unlimited ingredient tracking</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                <span>Advanced Push Notifications</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                <span>Collaborative Shopping Lists</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                <span className="font-bold">Unlimited AI Smart Recipes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-white/20 text-white"><Check className="w-4 h-4" /></div>
                <span>24/7 Priority Support</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full mt-8 h-12 rounded-xl bg-white text-emerald-700 hover:bg-emerald-50 font-bold shadow-lg relative z-10 transition-transform hover:scale-[1.02]"
          >
            Upgrade Now
          </Button>
        </div>

      </div>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              Secure Checkout
            </DialogTitle>
            <DialogDescription>
              You are upgrading to the Premium Plan ($4.99/month).
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 my-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Plan</span>
              <span className="font-semibold text-slate-800">Premium (Monthly)</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-800">$4.99</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <span className="font-bold text-slate-800">Total Due Today</span>
              <span className="font-bold text-emerald-600 text-lg">$4.99</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3">
            <Button 
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold" 
              onClick={handleUpgrade}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Simulate Payment & Upgrade
                </>
              )}
            </Button>
            <p className="text-xs text-center text-slate-400">
              *This is a simulated checkout. No real money will be charged.
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
