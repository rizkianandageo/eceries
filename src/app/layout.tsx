import { Fira_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { AppInit } from "@/components/app-init";
import { LayoutWrapper } from "@/components/layout-wrapper";
import "./globals.css";

const firaSans = Fira_Sans({
  variable: "--font-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "ECERIES",
  description: "Monitor kesegaran bahan baku dan groceries Anda",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ECERIES",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${firaSans.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-green-50 text-slate-900 relative selection:bg-green-500/30">
        <Toaster position="top-center" richColors />
        {/* Faint Background Image */}
        <div 
          className="fixed inset-0 z-[-20] bg-cover bg-center bg-no-repeat opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: "url('/bg-groceries.png')" }} 
        />
        {/* Global ambient background glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-green-400/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-lime-400/30 blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-emerald-400/30 blur-[100px]" />
        </div>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <AppInit />
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
