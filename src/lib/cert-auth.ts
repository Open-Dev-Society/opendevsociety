import "server-only";
import type { NextRequest } from "next/server";

export function isAuthed(req: NextRequest): boolean {
  const expected = process.env.CERT_PASSWORD;
  if (!expected) return false;
  const provided = req.cookies.get("cert_auth")?.value;
  return typeof provided === "string" && provided === expected;
}
