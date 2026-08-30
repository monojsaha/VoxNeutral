import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Firebase Auth is client-side for MVP.
// This middleware is a simple pass-through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons/).*)",
  ],
};
