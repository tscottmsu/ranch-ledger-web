import { NextResponse, type NextRequest } from "next/server";

import { exchangeCodeForSession } from "@/features/authentication/services/auth-service";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const requestedNext = request.nextUrl.searchParams.get("next");
  const isSafeRelativePath = requestedNext
    ? /^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(requestedNext)
    : false;
  const next = isSafeRelativePath ? requestedNext! : "/dashboard";

  if (code) {
    const { error } = await exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(new URL("/login?error=confirmation", request.url));
}
