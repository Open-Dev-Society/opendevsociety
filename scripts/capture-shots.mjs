// Captures the real product screenshots the site shows (brief §16) into public/shots/.
// Run: PLAYWRIGHT_BROWSERS_PATH=<dir with chromium-headless-shell> node scripts/capture-shots.mjs
// playwright-core isn't a project dependency; point PLAYWRIGHT_MODULE at an install if it isn't resolvable.
import { mkdir } from "node:fs/promises";

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ?? "playwright-core");

const shots = [
  { file: "openstock-desktop.jpg", url: "https://openstock-ods.vercel.app", width: 1440, height: 900, scale: 2 },
  { file: "openstock-mobile.jpg", url: "https://openstock-ods.vercel.app", width: 390, height: 844, scale: 3 },
  { file: "kine-ui.jpg", url: "https://kine-ui.vercel.app", width: 1440, height: 900, scale: 2 },
  { file: "openreadme.jpg", url: "https://openreadme.vercel.app", width: 1440, height: 900, scale: 2 },
];

await mkdir("public/shots", { recursive: true });
const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.scale });
  const res = await page.goto(s.url, { waitUntil: "networkidle", timeout: 60_000 }).catch((e) => console.error(s.url, e.message));
  await page.waitForTimeout(1500);
  // Decline cookie banners if one shows up.
  for (const label of ["Decline", "Reject all", "Reject", "Only necessary"]) {
    const btn = page.getByRole("button", { name: label });
    if (await btn.count()) await btn.first().click().catch(() => {});
  }
  await page.screenshot({ path: `public/shots/${s.file}`, type: "jpeg", quality: 86 });
  console.log(s.file, res?.status());
  await page.close();
}
await browser.close();
