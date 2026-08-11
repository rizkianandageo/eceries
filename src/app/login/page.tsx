import { LoginForm } from "@/components/login-form";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100 flex flex-col items-center">
          
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight text-center mb-2">
            Welcome to Fresh Track
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Sign in to manage your inventory and generate AI recipes.
          </p>

          <LoginForm />
          
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
