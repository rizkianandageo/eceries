import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker - must be public for PWA)
     * - manifest.json (PWA manifest - must be public)
     * - api/service-worker (service worker API route)
     */
    '/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|api/service-worker|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
}
