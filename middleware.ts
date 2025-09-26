import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {getToken} from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })
  const url = request.nextUrl
  

  if (token &&
    (url.pathname.startsWith('/auth') )){
    return NextResponse.redirect(new URL('/type', request.url))
  }

  if (!token && (url.pathname.startsWith('/type') || url.pathname.startsWith('/multiplayer') ||url.pathname.startsWith('/profile') )) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/auth',
    '/type',
    '/leaderboard',
    '/multiplayer',
    '/profile'
  ],
}