import { NextResponse, type NextRequest } from "next/server";
import { getCert, setCertStatus } from "@/lib/certs";
import { isAuthed } from "@/lib/cert-auth";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const cert = await getCert(id);
    if (!cert) {
      return NextResponse.json(
        { ok: false, error: "Certificate not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ ok: true, cert });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Lookup failed.",
      },
      { status: 502 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthed(req)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON body." },
      { status: 400 }
    );
  }

  const status = body?.status;
  if (status !== "active" && status !== "revoked") {
    return NextResponse.json(
      { ok: false, error: "status must be 'active' or 'revoked'." },
      { status: 400 }
    );
  }

  try {
    const cert = await setCertStatus(
      id,
      status,
      typeof body.reason === "string" ? body.reason.trim() : undefined
    );
    return NextResponse.json({ ok: true, cert });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Update failed.";
    const code = msg.includes("not found") ? 404 : 502;
    return NextResponse.json({ ok: false, error: msg }, { status: code });
  }
}
