import { NextResponse, type NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const expected = process.env.CERT_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Server access key is not configured." },
      { status: 500 }
    );
  }

  let password: unknown;
  try {
    const body = await req.json();
    password = body?.password;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password !== expected) {
    return NextResponse.json(
      { ok: false, error: "Invalid access key." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("cert_auth", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("cert_auth");
  return res;
}
