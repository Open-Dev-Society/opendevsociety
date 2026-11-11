import { NextResponse, type NextRequest } from "next/server";
import { catalog } from "@/data/catalog";
import { hasCertSession } from "@/lib/cert-token";

// Lowercased project name → canonical name, so /projects/openstock 308s to /projects/OpenStock before any render.
const canonical = new Map(Object.keys(catalog).map((name) => [name.toLowerCase(), name]));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/projects/")) {
    const name = decodeURIComponent(pathname.slice("/projects/".length));
    const match = canonical.get(name.toLowerCase());
    if (match && match !== name) {
      const url = req.nextUrl.clone();
      url.pathname = `/projects/${match}`;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  // Certificate tool: gated by the signed cert_auth cookie.
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
  matcher: ["/certificate", "/certificate/manage", "/projects/:name"],
};
