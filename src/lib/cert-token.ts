// The cert_auth cookie holds HMAC-SHA256(CERT_PASSWORD, label), never the password itself.
// Web Crypto, so it runs in both middleware and route handlers.
// ponytail: one static token per password; rotate the password to end every session.
export async function certToken(password: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("ods-cert-session-v1"));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function hasCertSession(cookie: string | undefined): Promise<boolean> {
  const password = process.env.CERT_PASSWORD;
  if (!password || !cookie) return false;
  const expected = await certToken(password);
  // Constant-time compare; both are fixed-length hex.
  if (cookie.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= cookie.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}
