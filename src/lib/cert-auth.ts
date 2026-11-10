import "server-only";
import type { NextRequest } from "next/server";
import { hasCertSession } from "./cert-token";

export function isAuthed(req: NextRequest): Promise<boolean> {
  return hasCertSession(req.cookies.get("cert_auth")?.value);
}
