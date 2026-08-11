import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Apple } from "lucide-react"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/15 backdrop-blur-sm supports-[backdrop-filter]:bg-white/10">
      <div className="container flex h-14 items-center px-4 mx-auto max-w-7xl">
        <div className="flex items-center gap-2 mr-4">
          <Link href="/" className="flex items-center gap-2">
            <Apple className="h-6 w-6 text-primary" />
            <span className="font-bold hidden sm:inline-block">ECERIES</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground">Dashboard</Link>
            <Link href="/inventory" className="transition-colors hover:text-foreground/80 text-foreground/60">Inventory</Link>
            <Link href="/shopping-list" className="transition-colors hover:text-foreground/80 text-foreground/60">Shopping List</Link>
          </nav>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
