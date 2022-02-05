import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: any) {
  // Token will exist if user is authenticated
  const token = await getToken({ req, secret: process.env.JWT_SECRET ?? '' })

  // Allow the requests if the following is true...
    // 1. if the token exists
    // 2. Or if it is a token request

  const { pathname } = req.nextUrl

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // redirect them to login if they don't have a token and are requesting a protected route
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
}