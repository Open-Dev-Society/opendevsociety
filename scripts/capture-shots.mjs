// Captures the real product screenshots the site shows (brief §16) into public/shots/: every org repo whose GitHub
// homepage answers 200, at 1440×900, JPEG 80. Dead homepages are skipped (the site draws a fallback for them).
// Run: PLAYWRIGHT_BROWSERS_PATH=<dir with chromium-headless-shell> node scripts/capture-shots.mjs
// playwright-core isn't a project dependency; point PLAYWRIGHT_MODULE at an install if it isn't resolvable.
// After a run, register new files as `shot` in src/data/catalog.ts.
import { mkdir } from "node:fs/promises";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core");

const SKIP = new Set(["opendevsociety"]); // the site itself
const FILE = { OpenStock: "openstock-desktop" }; // names other pages already link to

const headers = process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
const repos = await (await fetch("https://api.github.com/orgs/Open-Dev-Society/repos?per_page=100", { headers })).json();
const shots = [
  ...repos
    .filter((r) => r.homepage && !SKIP.has(r.name))
    .map((r) => ({ file: `${FILE[r.name] ?? r.name}.jpg`, url: r.homepage, width: 1440, height: 900, scale: 1 })),
  { file: "openstock-mobile.jpg", url: "https://openstock-ods.vercel.app", width: 390, height: 844, scale: 3 },
];

await mkdir("public/shots", { recursive: true });
const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale });
  const res = await page.goto(s.url, { waitUntil: "networkidle", timeout: 60_000 }).catch((e) => console.error(s.url, e.message));
  if (!res?.ok()) {
    console.log("skip", s.url, res?.status());
    await page.close();
    continue;
  }
  await page.waitForTimeout(1500);
  // Decline cookie banners if one shows up.
  for (const label of ["Decline", "Reject all", "Reject", "Only necessary"]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) await btn.first().click().catch(() => {});
  }
  await page.screenshot({ path: `public/shots/${s.file}`, type: "jpeg", quality: 80 });
  console.log(s.file, res.status());
  await page.close();
}
await browser.close();
