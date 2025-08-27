// middleware.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(req: Request) {
  const session = await auth();
  if (!session?.user) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", new URL(req.url).pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
