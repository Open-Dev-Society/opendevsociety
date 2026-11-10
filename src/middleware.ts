import { NextResponse, type NextRequest } from "next/server";
import { hasCertSession } from "@/lib/cert-token";

export async function middleware(req: NextRequest) {
  if (await hasCertSession(req.cookies.get("cert_auth")?.value)) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/certificate/login";
  url.search = "";
  const from = req.nextUrl.pathname + req.nextUrl.search;
  if (from && from !== "/certificate/login") {
    url.searchParams.set("from", from);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/certificate", "/certificate/manage"],
};
