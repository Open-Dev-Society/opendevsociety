import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const expected = process.env.CERT_PASSWORD;
  const provided = req.cookies.get("cert_auth")?.value;

  if (expected && provided && provided === expected) {
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
