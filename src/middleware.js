// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the pathname starts with /epaper/
  if (pathname.startsWith('/epaper/')) {
    // Extract the slug (everything after /epaper/)
    const slug = pathname.replace('/epaper/', '');
    
    // Check if slug matches the conditions
    if (slug.endsWith('-all-editions-epaper.html') || slug.startsWith('edition-today-')|| slug.startsWith('edition-')) {
      // Rewrite to /listing/:slug
      return NextResponse.rewrite(new URL(`/listing/${slug}`, request.url));
    }
  }

  // Continue to the next handler if no match
  return NextResponse.next();
}

export const config = {
  matcher: ['/epaper/:path*'], // Apply to /epaper/* paths
};