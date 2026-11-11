// The colonies: the hero's Gray–Scott field (lab-hero/field.ts), confined to one organic disc per project and shown
// through the same 1-bit Bayer dither. Each colony pulses with its commits; the one in focus "develops" into its
// screenshot: dithered at 16 → 8 → 4 → 2 px cells, then a 1-bit dissolve into the crisp image.
import { readColors, REGIMES, watchTheme } from "../../lab-hero/field";

export const MAX = 24;
const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
/** Develop steps, CSS px per dither cell; then crisp. */
const DEV = [16, 8, 4, 2];
const STEP_MS = 110;
export const SHOT_W = 1280, SHOT_H = 800;

/** One colony as the engine sees it: the disc in CSS px (field box, y down), and its rhythm. */
export type Disc = { x: number; y: number; r: number; pulse: number; seed: number; regime: number };
export type Rect = { x: number; y: number; w: number; h: number };

const VS = `#version 300 es
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

// Shared by both passes: how much of colony i covers CSS point c (1 inside, soft at its wobbly edge).
const ZONE = `
uniform vec4 u_col[${MAX}]; // x, y, r (CSS px), seed
uniform vec4 u_par[${MAX}]; // pulse Hz (0 = still), regime (0 spots .. 1 coral)
uniform int u_n;
float cover(int i, vec2 c, out float d, out float rr) {
  vec4 k = u_col[i];
  vec2 v = c - k.xy;
  float a = atan(v.y, v.x);
  d = length(v);
  rr = k.z * (1.0 + 0.07 * sin(3.0 * a + k.w) + 0.045 * sin(5.0 * a + 2.3 * k.w) + 0.025 * sin(9.0 * a - k.w));
  return 1.0 - smoothstep(rr * 0.82, rr, d);
}`;

const SIM = `#version 300 es
precision highp float;
uniform sampler2D u_state;
uniform float u_k; // sim px per CSS px
${ZONE}
out vec4 o;
vec4 T(ivec2 p, ivec2 s) { return texelFetch(u_state, clamp(p, ivec2(0), s - 1), 0); }
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy), s = textureSize(u_state, 0);
  vec4 c = T(p, s);
  vec4 lap = -c
    + 0.2 * (T(p + ivec2(1, 0), s) + T(p - ivec2(1, 0), s) + T(p + ivec2(0, 1), s) + T(p - ivec2(0, 1), s))
    + 0.05 * (T(p + ivec2(1, 1), s) + T(p - ivec2(1, 1), s) + T(p + ivec2(1, -1), s) + T(p - ivec2(1, -1), s));
  vec2 css = vec2(gl_FragCoord.x, float(s.y) - gl_FragCoord.y) / u_k;
  float m = 0.0, d, rr;
  vec2 fk = vec2(${REGIMES.spots});
  for (int i = 0; i < u_n; i++) {
    float z = cover(i, css, d, rr);
    if (z > m) { m = z; fk = mix(vec2(${REGIMES.spots}), vec2(${REGIMES.coral}), u_par[i].y); }
  }
  float u = c.r, v = c.g, uvv = u * v * v;
  vec2 n = vec2(u + lap.r - uvv + fk.x * (1.0 - u), v + 0.5 * lap.g + uvv - (fk.x + fk.y) * v);
  n.g *= mix(0.9, 1.0, m); // outside every colony the reaction starves
  o = vec4(clamp(n, 0.0, 1.0), 0.0, 1.0);
}`;

const SHOW = `#version 300 es
precision highp float;
uniform sampler2D u_sim, u_shot;
uniform vec2 u_css;
uniform float u_dpr, u_cell, u_time;
uniform int u_hot;
uniform vec4 u_rev;   // reveal rect, CSS px (x, y, w, h)
uniform float u_amt, u_dev, u_crisp, u_neg; // mask opening 0..1, develop cell (device px), crisp 0..1, negative
uniform vec3 u_paper, u_teal;
${ZONE}
out vec4 o;
const int B[64] = int[64](${BAYER});
float bayer(ivec2 c) { c &= 7; return (float(B[c.y * 8 + c.x]) + 0.5) / 64.0; }
vec4 sim(vec2 uv) {
  ivec2 s = textureSize(u_sim, 0);
  vec2 q = uv * vec2(s) - 0.5, f = fract(q);
  ivec2 i = ivec2(floor(q)), m = s - 1;
  vec4 a = texelFetch(u_sim, clamp(i, ivec2(0), m), 0), b = texelFetch(u_sim, clamp(i + ivec2(1, 0), ivec2(0), m), 0);
  vec4 c = texelFetch(u_sim, clamp(i + ivec2(0, 1), ivec2(0), m), 0), d = texelFetch(u_sim, clamp(i + ivec2(1, 1), ivec2(0), m), 0);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
void main() {
  vec2 fc = vec2(gl_FragCoord.x, u_css.y * u_dpr - gl_FragCoord.y); // device px, y down
  ivec2 cell = ivec2(floor(fc / u_cell));
  vec2 css = (vec2(cell) + 0.5) * u_cell / u_dpr;
  float t = bayer(cell);
  // Which colony this cell belongs to, and how strongly it shows right now.
  float m = 0.0, ring = 0.0, dim = 1.0, still = 1.0, d, rr;
  for (int i = 0; i < u_n; i++) {
    float z = cover(i, css, d, rr);
    if (z <= m) continue;
    m = z;
    float hz = u_par[i].x;
    // A pulse is a ring of denser growth travelling from the centre out: faster for more recent commits.
    ring = hz > 0.0 ? exp(-pow((d / rr - fract(u_time * hz + u_col[i].w)) * 5.0, 2.0)) : 0.0;
    still = hz > 0.0 ? 0.0 : 1.0;
    dim = u_hot >= 0 && i != u_hot ? mix(1.0, 0.4, u_amt) : 1.0;
  }
  vec2 uv = vec2(css.x, u_css.y - css.y) / u_css;
  float growth = smoothstep(0.1, 0.42, sim(uv).g) * mix(0.74 + 0.4 * ring, 0.8, still);
  // A faint stipple holds each colony together as one body; the pulse ring shows in it too.
  float body = 0.07 + 0.2 * ring;
  vec3 col = max(growth, body) * m * dim > t ? u_teal : u_paper;
  // The reveal: a soft-cornered window that opens from its centre, its edge a dither dissolve.
  if (u_amt > 0.0) {
    vec2 l = (css - u_rev.xy) / u_rev.zw, e = abs(l * 2.0 - 1.0);
    float q = pow(pow(e.x, 5.0) + pow(e.y, 5.0), 0.2);
    if (smoothstep(u_amt, u_amt - 0.12, q) > t) {
      vec2 dc = (floor(fc / u_dev) + 0.5) * u_dev / u_dpr; // develop cell centre, CSS px
      vec2 dl = clamp((dc - u_rev.xy) / u_rev.zw, 0.0, 1.0);
      vec3 px = texture(u_shot, dl).rgb;
      float lum = smoothstep(0.06, 0.8, dot(px, vec3(0.2126, 0.7152, 0.0722)));
      if (u_neg > 0.5) lum = 1.0 - lum;
      vec3 dith = lum > bayer(ivec2(floor(fc / u_dev))) ? u_paper : u_teal;
      col = u_crisp > t ? texture(u_shot, l).rgb : dith;
    }
  }
  o = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, fs: string) {
  const p = gl.createProgram()!;
  for (const [type, src] of [[gl.VERTEX_SHADER, VS], [gl.FRAGMENT_SHADER, fs]] as const) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  const cache = new Map<string, WebGLUniformLocation | null>();
  const u = (n: string) => (cache.has(n) ? cache.get(n)! : (cache.set(n, gl.getUniformLocation(p, n)), cache.get(n)!));
  return { p, u };
}

function texture(gl: WebGL2RenderingContext, filter: number) {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

/** A small deterministic PRNG, so each colony's first specks land the same way every load. */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export type Engine = {
  /** Bring colony `i` into focus inside `rect` (CSS px in the field box), or none with -1. */
  focus(i: number, rect: Rect | null, shot: CanvasImageSource | null, negative: boolean): void;
  stop(): void;
};

/** Starts the colonies on `canvas` (covering `box`); null when the browser can't (no WebGL2 or float targets). */
export function startColonies(box: HTMLElement, canvas: HTMLCanvasElement, discs: () => Disc[], mobile: boolean): Engine | null {
  const probe = document.createElement("canvas").getContext("webgl2");
  const ok = !!probe?.getExtension("EXT_color_buffer_float");
  probe?.getExtension("WEBGL_lose_context")?.loseContext();
  if (!ok) return null;
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  const sim = compile(gl, SIM), show = compile(gl, SHOW);
  let colors = readColors(box);
  const K = mobile ? 1 / 4 : 1 / 3; // sim cells per CSS px
  const STEPS = mobile ? 10 : 16;
  const WARM = 700;

  const state = [texture(gl, gl.NEAREST), texture(gl, gl.NEAREST)];
  const fbo = state.map((t) => {
    const f = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    return f;
  });
  const shotTex = texture(gl, gl.LINEAR);

  let w = 0, h = 0, sw = 0, sh = 0, dpr = 1, cur = 0;
  let list: Disc[] = [];
  const col = new Float32Array(MAX * 4), par = new Float32Array(MAX * 4);

  // Focus: what's in the reveal, and how far it has developed.
  let hot = -1, rect: Rect = { x: 0, y: 0, w: 1, h: 1 }, neg = 0;
  let amt = 0, amtTo = 0, dev = 0, crisp = 0, since = 0;

  function setup() {
    const r = box.getBoundingClientRect();
    if (Math.round(r.width) === w && Math.round(r.height) === h) return false;
    w = Math.round(r.width);
    h = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    dpr = canvas.width / w;
    sw = Math.max(8, Math.round(w * K));
    sh = Math.max(8, Math.round(h * K));
    colors = readColors(box);
    list = discs().slice(0, MAX);
    col.fill(0);
    par.fill(0);
    list.forEach((d, i) => {
      col.set([d.x, d.y, d.r, d.seed], i * 4);
      par.set([d.pulse, d.regime, 0, 0], i * 4);
    });

    // The culture: U = 1 everywhere, V dropped in 5×5 specks inside each disc, the same specks every load.
    const init = new Float32Array(sw * sh * 4);
    for (let i = 0; i < sw * sh; i++) init[i * 4] = 1;
    list.forEach((d, n) => {
      const rand = rng(n * 7919 + 13);
      const count = Math.max(3, Math.round((d.r * K) ** 2 * 0.02));
      for (let k = 0; k < count; k++) {
        const a = rand() * Math.PI * 2, rr = Math.sqrt(rand()) * d.r * 0.7;
        const x = Math.round((d.x + Math.cos(a) * rr) * K), y = Math.round((d.y + Math.sin(a) * rr) * K);
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++) {
            const px = x + dx, py = sh - 1 - (y + dy);
            if (px < 0 || py < 0 || px >= sw || py >= sh) continue;
            init[(py * sw + px) * 4] = 0.5;
            init[(py * sw + px) * 4 + 1] = 1;
          }
      }
    });
    for (const t of state) {
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA32F, sw, sh, 0, gl!.RGBA, gl!.FLOAT, init);
    }
    cur = 0;
    return true;
  }

  const zone = (prog: ReturnType<typeof compile>) => {
    gl!.uniform4fv(prog.u("u_col"), col);
    gl!.uniform4fv(prog.u("u_par"), par);
    gl!.uniform1i(prog.u("u_n"), list.length);
  };

  function step(k: number) {
    gl!.useProgram(sim.p);
    gl!.viewport(0, 0, sw, sh);
    gl!.uniform1i(sim.u("u_state"), 0);
    gl!.uniform1f(sim.u("u_k"), K);
    zone(sim);
    gl!.activeTexture(gl!.TEXTURE0);
    for (let i = 0; i < k; i++) {
      gl!.bindTexture(gl!.TEXTURE_2D, state[cur]);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo[1 - cur]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      cur = 1 - cur;
    }
  }

  function render(time: number) {
    gl!.useProgram(show.p);
    const U = show.u;
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, state[cur]);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, shotTex);
    gl!.uniform1i(U("u_sim"), 0);
    gl!.uniform1i(U("u_shot"), 1);
    gl!.activeTexture(gl!.TEXTURE0);
    zone(show);
    gl!.uniform2f(U("u_css"), w, h);
    gl!.uniform1f(U("u_dpr"), dpr);
    gl!.uniform1f(U("u_cell"), Math.max(2, Math.round(2 * dpr)));
    gl!.uniform1f(U("u_time"), time / 1000);
    gl!.uniform1i(U("u_hot"), hot);
    gl!.uniform4f(U("u_rev"), rect.x, rect.y, rect.w, rect.h);
    gl!.uniform1f(U("u_amt"), amt);
    gl!.uniform1f(U("u_dev"), Math.max(1, Math.round(dev * dpr)));
    gl!.uniform1f(U("u_crisp"), crisp);
    gl!.uniform1f(U("u_neg"), neg);
    gl!.uniform3f(U("u_paper"), ...colors.paper);
    gl!.uniform3f(U("u_teal"), ...colors.teal);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    box.dataset.live = "";
  }

  // The darkroom clock: the window opens (or closes) over ~240ms; the develop steps run on a fixed beat after it starts.
  function advance(now: number, still: boolean) {
    if (still) {
      amt = amtTo;
      dev = DEV[DEV.length - 1];
      crisp = amtTo;
      return false;
    }
    const k = Math.min(1, (now - since) / 240);
    amt = amtTo ? Math.max(amt, k) : Math.min(amt, 1 - k);
    const s = Math.floor((now - since) / STEP_MS);
    dev = DEV[Math.min(s, DEV.length - 1)];
    crisp = amtTo ? Math.min(1, Math.max(0, (now - since - DEV.length * STEP_MS) / 240)) : Math.min(crisp, 1 - k);
    if (!amtTo && amt === 0) hot = -1;
    return amt !== amtTo || (amtTo > 0 && crisp < 1);
  }

  // Loop: runs only while on screen and the tab is visible. Reduced motion: a grown still, redrawn only on change.
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0, onScreen = false;
  const loop = (now: number) => {
    raf = 0;
    const still = motion.matches;
    if (setup()) step(still ? 5000 : WARM);
    if (!still) step(STEPS);
    const busy = advance(now, still);
    render(still ? 0 : now);
    if (!still || busy) kick();
  };
  const kick = () => {
    if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    kick();
  });
  io.observe(box);
  const ro = new ResizeObserver(() => kick());
  ro.observe(box);
  document.addEventListener("visibilitychange", kick);
  motion.addEventListener("change", kick);
  const unwatch = watchTheme(() => {
    colors = readColors(box);
    kick();
  });

  return {
    focus(i, r, shot, negative) {
      if (i >= 0 && r && shot) {
        if (i !== hot) {
          gl.bindTexture(gl.TEXTURE_2D, shotTex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, shot as TexImageSource);
          amt = crisp = 0;
        }
        hot = i;
        rect = r;
        neg = negative ? 1 : 0;
        amtTo = 1;
      } else amtTo = 0;
      since = performance.now();
      kick();
    },
    stop() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      motion.removeEventListener("change", kick);
      unwatch();
      delete box.dataset.live;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/** No WebGL2: each colony as a still disc of ordered dither, drawn once (and on theme change). */
export function staticColonies(box: HTMLElement, canvas: HTMLCanvasElement, discs: Disc[]) {
  const r = box.getBoundingClientRect(), W = Math.round(r.width / 2), H = Math.round(r.height / 2);
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const teal = readColors(box).teal.map((c) => c * 255);
  for (const d of discs) {
    const rand = rng(Math.round(d.seed * 1000));
    const noise = Array.from({ length: 64 }, () => rand());
    for (let y = Math.max(0, Math.floor((d.y - d.r) / 2)); y < Math.min(H, (d.y + d.r) / 2); y++)
      for (let x = Math.max(0, Math.floor((d.x - d.r) / 2)); x < Math.min(W, (d.x + d.r) / 2); x++) {
        const k = Math.hypot(x * 2 - d.x, y * 2 - d.y) / d.r;
        const v = (k < 1 ? 0.45 * (1 - k * k) : 0) * (0.6 + 0.8 * noise[((x >> 2) + (y >> 2) * 7) & 63]);
        if (v > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) img.data.set([...teal, 255], (y * W + x) * 4);
      }
  }
  ctx.putImageData(img, 0, 0);
}
