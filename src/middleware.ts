import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  // Token will exist if user is authenticated
  const token = await getToken({ req, secret: process.env.JWT_SECRET ?? '' })
  
  const { pathname } = req.nextUrl
  
  // Allow the requests if:
  // 1. It's a request for next-auth session & provider fetching
  // 2. Or if the token exists (user is authenticated)
  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }
  
  // Redirect to login if they don't have a token and are requesting a protected route
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
