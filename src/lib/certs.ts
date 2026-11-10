import "server-only";

const OWNER = process.env.CERT_REPO_OWNER || "Open-Dev-Society";
const REPO = process.env.CERT_REPO_NAME || "opendevsociety";
const BRANCH = process.env.CERT_REPO_BRANCH || "master";
const DATA_PATH = process.env.CERT_DATA_PATH || "data/certificates.json";

const API_BASE = "https://api.github.com";

export type CertRole = "member" | "contributor" | "maintainer" | "mentor";
export type CertStatus = "active" | "revoked";

export interface Cert {
  id: string;
  name: string;
  role: CertRole;
  description: string;
  issuedOn: string;
  issuedBy: string;
  issuerHandle: string;
  status: CertStatus;
  revokedOn?: string;
  revokedReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface CertStore {
  certificates: Cert[];
}

interface GhFileResponse {
  sha: string;
  content: string;
  encoding: string;
}

function ghHeaders(): Record<string, string> {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not configured on the server.");
  }
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Open-Dev-Society-Site",
  };
}

async function loadFile(): Promise<{ store: CertStore; sha: string | null }> {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${DATA_PATH}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" });
  if (res.status === 404) {
    return { store: { certificates: [] }, sha: null };
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to read ${DATA_PATH} from ${OWNER}/${REPO}: ${res.status} ${text}`
    );
  }
  const file = (await res.json()) as GhFileResponse;
  const raw = Buffer.from(file.content, "base64").toString("utf-8");
  let parsed: CertStore;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = { certificates: [] };
  }
  if (!Array.isArray(parsed.certificates)) parsed.certificates = [];
  return { store: parsed, sha: file.sha };
}

async function saveFile(
  store: CertStore,
  prevSha: string | null,
  message: string
): Promise<void> {
  const content = Buffer.from(
    JSON.stringify(store, null, 2),
    "utf-8"
  ).toString("base64");
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${DATA_PATH}`;
  const body: Record<string, unknown> = { message, content, branch: BRANCH };
  if (prevSha) body.sha = prevSha;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...ghHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to write ${DATA_PATH} to ${OWNER}/${REPO}: ${res.status} ${text}`
    );
  }
}

function generateId(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ODS-${year}-${rand}`;
}

export async function listCerts(): Promise<Cert[]> {
  const { store } = await loadFile();
  return [...store.certificates].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function getCert(id: string): Promise<Cert | null> {
  const { store } = await loadFile();
  return store.certificates.find((c) => c.id === id) ?? null;
}

export type CertInput = {
  id?: string;
  name: string;
  role: CertRole;
  description: string;
  issuedOn: string;
  issuedBy: string;
  issuerHandle: string;
};

export async function issueCert(input: CertInput): Promise<Cert> {
  const { store, sha } = await loadFile();

  let id = input.id?.trim() || generateId();
  let attempts = 0;
  while (store.certificates.some((c) => c.id === id) && attempts < 8) {
    id = generateId();
    attempts++;
  }
  if (store.certificates.some((c) => c.id === id)) {
    throw new Error("Could not allocate a unique certificate ID.");
  }

  const now = new Date().toISOString();
  const cert: Cert = {
    id,
    name: input.name,
    role: input.role,
    description: input.description,
    issuedOn: input.issuedOn,
    issuedBy: input.issuedBy,
    issuerHandle: input.issuerHandle,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  store.certificates.push(cert);
  await saveFile(store, sha, `cert: issue ${id} to ${cert.name}`);
  return cert;
}

export async function setCertStatus(
  id: string,
  status: CertStatus,
  reason?: string
): Promise<Cert> {
  const { store, sha } = await loadFile();
  const idx = store.certificates.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Certificate not found.");

  const cert = store.certificates[idx];
  const now = new Date().toISOString();
  cert.status = status;
  cert.updatedAt = now;

  if (status === "revoked") {
    cert.revokedOn = now;
    if (reason) cert.revokedReason = reason;
  } else {
    delete cert.revokedOn;
    delete cert.revokedReason;
  }

  const verb = status === "revoked" ? "revoke" : "restore";
  await saveFile(store, sha, `cert: ${verb} ${id}`);
  return cert;
}
