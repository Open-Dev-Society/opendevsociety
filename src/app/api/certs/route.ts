import { NextResponse, type NextRequest } from "next/server";
import { issueCert, listCerts, type CertRole } from "@/lib/certs";
import { isAuthed } from "@/lib/cert-auth";

export const runtime = "nodejs";

const VALID_ROLES: CertRole[] = ["member", "contributor", "maintainer", "mentor"];

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const certs = await listCerts();
    return NextResponse.json({ ok: true, certs });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to load certificates.",
      },
      { status: 502 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON body." },
      { status: 400 }
    );
  }

  const required = [
    "name",
    "role",
    "description",
    "issuedOn",
    "issuedBy",
    "issuerHandle",
  ] as const;
  for (const k of required) {
    if (typeof body[k] !== "string" || !(body[k] as string).trim()) {
      return NextResponse.json(
        { ok: false, error: `Missing or invalid field: ${k}` },
        { status: 400 }
      );
    }
  }

  if (!VALID_ROLES.includes(body.role as CertRole)) {
    return NextResponse.json(
      { ok: false, error: `Invalid role. Allowed: ${VALID_ROLES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const cert = await issueCert({
      id: typeof body.id === "string" ? body.id.trim() : undefined,
      name: (body.name as string).trim(),
      role: body.role as CertRole,
      description: (body.description as string).trim(),
      issuedOn: (body.issuedOn as string).trim(),
      issuedBy: (body.issuedBy as string).trim(),
      issuerHandle: (body.issuerHandle as string).trim(),
    });
    return NextResponse.json({ ok: true, cert });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Failed to issue certificate.",
      },
      { status: 502 }
    );
  }
}
