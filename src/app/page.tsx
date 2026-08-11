import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full px-6 py-6 flex items-center justify-between relative z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/eceries-logo.png" alt="Eceries Logo" className="w-10 h-10 rounded-2xl shadow-sm" />
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">ECERIES</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold text-slate-600 hover:text-emerald-700">
              Sign In
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6 font-semibold shadow-md shadow-emerald-200">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 relative z-10 max-w-5xl mx-auto mt-6 sm:mt-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          Eceries 1.0 is Here!
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Never let your groceries <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">go to waste again.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mb-8 leading-relaxed">
          The smartest way to track your fridge inventory, get AI-powered recipe recommendations, and keep your ingredients fresh.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full justify-center">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8 h-14 text-lg font-semibold shadow-xl shadow-emerald-200/50 flex items-center gap-2">
              Start Tracking Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-left w-full">
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Freshness Tracker</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Automatically calculates shelf life so you know what to eat first.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-teal-100 rounded-2xl flex items-center justify-center mb-4">
              <Brain className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">AI Smart Recipes</h3>
            <p className="text-sm text-slate-500 leading-relaxed">AI generates delicious recipes strictly based on what is in your fridge.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 hover:scale-105 transition-transform duration-300">
            <div className="w-10 h-10 bg-rose-100 rounded-2xl flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Secure & Private</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Your data is strictly yours. Fast and secure authentication.</p>
          </div>
        </div>
      </main>

      <footer className="w-full text-center pb-6 pt-10 mt-auto text-slate-400 text-sm relative z-10">
        © {new Date().getFullYear()} E-Groceries Fresh Track. All rights reserved.
      </footer>
    </div>
  );
}
