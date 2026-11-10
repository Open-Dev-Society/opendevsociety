// The Turing field: Gray–Scott reaction–diffusion on the GPU, shown through a 1-bit Bayer 8×8 dither.
// The H1's glyphs are the culture: they are seeded first, the reaction fills them, then spreads into the field.
// A loupe under the pointer re-dithers what it sees on the CPU with real error diffusion.

export const ALGOS = ["Floyd–Steinberg", "Atkinson", "Jarvis–Judice–Ninke"] as const;
// [dx, dy, weight] per kernel, weights already divided by their sum.
const KERNELS: [number, number, number][][] = [
  [[1, 0, 7], [-1, 1, 3], [0, 1, 5], [1, 1, 1]].map(([x, y, w]) => [x, y, w / 16]),
  [[1, 0, 1], [2, 0, 1], [-1, 1, 1], [0, 1, 1], [1, 1, 1], [0, 2, 1]].map(([x, y, w]) => [x, y, w / 8]),
  [[1, 0, 7], [2, 0, 5], [-2, 1, 3], [-1, 1, 5], [0, 1, 7], [1, 1, 5], [2, 1, 3], [-2, 2, 1], [-1, 2, 3], [0, 2, 5], [1, 2, 3], [2, 2, 1]].map(
    ([x, y, w]) => [x, y, w / 48],
  ),
];

// Spots (mitosis) on the left drift into coral on the right; letters always coral, so they fill.
export const REGIMES = { spots: [0.0367, 0.0649], coral: [0.0545, 0.062] } as const;

const BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];

export type FieldOpts = { reduced: boolean; mobile: boolean; onLens: (x: number, y: number, r: number, algo: number) => void };

const VS = `#version 300 es
void main() { vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2)); gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0); }`;

const SIM = `#version 300 es
precision highp float;
uniform sampler2D u_state, u_zone;
uniform vec3 u_seed; // sim cell x, y, radius (0 = none)
uniform float u_seedT;
out vec4 o;
vec4 T(ivec2 p, ivec2 s) { return texelFetch(u_state, clamp(p, ivec2(0), s - 1), 0); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + u_seedT) * 43758.5453); }
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy), s = textureSize(u_state, 0);
  vec4 c = T(p, s);
  vec4 lap = -c
    + 0.2 * (T(p + ivec2(1, 0), s) + T(p - ivec2(1, 0), s) + T(p + ivec2(0, 1), s) + T(p - ivec2(0, 1), s))
    + 0.05 * (T(p + ivec2(1, 1), s) + T(p - ivec2(1, 1), s) + T(p + ivec2(1, -1), s) + T(p - ivec2(1, -1), s));
  vec4 z = texture(u_zone, (vec2(p) + 0.5) / vec2(s));
  vec2 uv = (vec2(p) + 0.5) / vec2(s);
  vec2 fk = mix(mix(vec2(${REGIMES.spots}), vec2(${REGIMES.coral}), smoothstep(0.2, 0.85, uv.x)), vec2(${REGIMES.coral}), z.r);
  float u = c.r, v = c.g, uvv = u * v * v;
  // r: U, g: V, b: W = "the reaction has been here" (gates the ink of the letters).
  vec3 n = vec3(u + lap.r - uvv + fk.x * (1.0 - u), v + 0.5 * lap.g + uvv - (fk.x + fk.y) * v, c.b + 0.2 * lap.b + 0.02 * v);
  if (u_seed.z > 0.0 && distance(vec2(p), u_seed.xy) < u_seed.z * (0.7 + 0.3 * hash(floor(vec2(p) / 3.0)))) n.rg = vec2(0.5, 0.25 + 0.25 * hash(vec2(p)));
  o = vec4(clamp(n, 0.0, 1.0), 1.0);
}`;

const SHOW = `#version 300 es
precision highp float;
uniform sampler2D u_sim, u_zone, u_glyph, u_lens;
uniform vec2 u_css;    // canvas size, CSS px
uniform float u_dpr, u_cell; // device px per CSS px, dither cell in device px
uniform vec3 u_lensP;  // centre (CSS px, y up), radius
uniform float u_lensN, u_mag;
uniform int u_pass;    // 0: screen, 1: lens tone tile
uniform vec3 u_paper, u_ink, u_teal, u_rose;
out vec4 o;
const int B[64] = int[64](${BAYER});
float bayer(ivec2 c) { c &= 7; return (float(B[c.y * 8 + c.x]) + 0.5) / 64.0; }
// Float textures aren't filterable everywhere, so bilinear by hand.
vec4 sim(vec2 uv) {
  ivec2 s = textureSize(u_sim, 0);
  vec2 q = uv * vec2(s) - 0.5, f = fract(q);
  ivec2 i = ivec2(floor(q)), m = s - 1;
  vec4 a = texelFetch(u_sim, clamp(i, ivec2(0), m), 0), b = texelFetch(u_sim, clamp(i + ivec2(1, 0), ivec2(0), m), 0);
  vec4 c = texelFetch(u_sim, clamp(i + ivec2(0, 1), ivec2(0), m), 0), d = texelFetch(u_sim, clamp(i + ivec2(1, 1), ivec2(0), m), 0);
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
// Pattern tone in the field: full inside the letters, hushed in the halo around them so the type reads.
float tone(vec2 uv, vec4 s) {
  vec4 z = texture(u_zone, uv);
  float gain = max(mix(1.0, 0.1, smoothstep(0.05, 0.55, z.g)), z.r);
  return smoothstep(0.1, 0.42, s.g) * gain;
}
void main() {
  if (u_pass == 1) {
    vec2 src = u_lensP.xy + ((gl_FragCoord.xy / u_lensN) * 2.0 - 1.0) * u_lensP.z / u_mag;
    vec2 uv = src / u_css;
    vec4 s = sim(uv);
    float g = texture(u_glyph, uv).r * smoothstep(0.2, 0.9, s.b);
    o = vec4(max(tone(uv, s), g), step(0.5, g), 0.0, 1.0);
    return;
  }
  vec2 fc = gl_FragCoord.xy, p = fc / u_dpr;
  float d = length(p - u_lensP.xy), R = u_lensP.z;
  if (R > 0.0 && d < R + 9.0) {
    vec2 q = p - u_lensP.xy;
    if (d < R) {
      vec2 v = texelFetch(u_lens, ivec2((q / R * 0.5 + 0.5) * u_lensN), 0).rg;
      o = vec4(v.r > 0.5 ? (v.g > 0.5 ? u_ink : u_teal) : u_paper, 1.0);
      return;
    }
    // The reticle: a 1.5px ring and four ticks, the one rose thing on the page.
    float ring = 1.0 - smoothstep(0.75, 0.75 + 1.0 / u_dpr, abs(d - R - 0.75));
    float tick = step(d, R + 8.0) * (1.0 - smoothstep(0.5, 1.25, min(abs(q.x), abs(q.y))));
    float a = max(ring, tick);
    if (a > 0.0) { o = vec4(mix(u_paper, u_rose, a), 1.0); return; }
  }
  ivec2 cell = ivec2(floor(fc / u_cell));
  vec2 uv = (vec2(cell) + 0.5) * u_cell / u_dpr / u_css;
  vec4 s = sim(uv);
  float t = bayer(cell);
  vec3 col = tone(uv, s) > t ? u_teal : u_paper;
  float cov = texelFetch(u_glyph, ivec2(fc), 0).r;
  col = mix(col, u_ink, cov * step(t, s.b * 1.06 - 0.03));
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
  const u = (n: string) => gl.getUniformLocation(p, n);
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

/** CSS colour (oklch, hex, anything) → linear-free sRGB 0..1, via a 1px 2D canvas. */
export function readColors(el: Element) {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
  const cs = getComputedStyle(el);
  const rgb = (name: string) => {
    ctx.fillStyle = "#000";
    ctx.fillStyle = cs.getPropertyValue(name).trim();
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255] as const;
  };
  return { paper: rgb("--bg"), ink: rgb("--fg"), teal: rgb("--accent-brand"), rose: rgb("--mark") };
}

/** Draws the H1's words where the DOM put them, into a canvas `scale` device px per CSS px. halo > 0 also paints a blurred dilation in green. */
export function drawGlyphs(h1: HTMLElement, origin: DOMRect, w: number, h: number, scale: number, halo = 0) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const cs = getComputedStyle(h1);
  ctx.font = `${cs.fontWeight} ${parseFloat(cs.fontSize) * scale}px ${cs.fontFamily}`;
  ctx.fontStretch = ["75%", "condensed"].includes(cs.fontStretch) ? "condensed" : "normal";
  ctx.letterSpacing = `${parseFloat(cs.letterSpacing || "0") * scale || 0}px`;
  const words = [...h1.querySelectorAll<HTMLElement>("[data-w]")].map((el) => {
    const r = el.getBoundingClientRect();
    return { text: el.textContent ?? "", x: (r.left - origin.left) * scale, y: (r.top - origin.top) * scale };
  });
  const draw = () => words.forEach((wd) => ctx.fillText(wd.text, wd.x, wd.y + ctx.measureText(wd.text).fontBoundingBoxAscent));
  if (halo) {
    ctx.filter = `blur(${halo * 0.6}px)`;
    ctx.fillStyle = ctx.strokeStyle = "rgb(0,255,0)";
    ctx.lineWidth = halo;
    ctx.lineJoin = "round";
    words.forEach((wd) => ctx.strokeText(wd.text, wd.x, wd.y + ctx.measureText(wd.text).fontBoundingBoxAscent));
    draw();
    // Plates (corner labels, CTAs) hush the field around them the same way the letters do.
    for (const el of h1.closest("section")?.querySelectorAll("[data-plate]") ?? []) {
      const r = el.getBoundingClientRect(), m = 10;
      if (r.width) ctx.fillRect((r.left - origin.left - m) * scale, (r.top - origin.top - m) * scale, (r.width + 2 * m) * scale, (r.height + 2 * m) * scale);
    }
    ctx.filter = "none";
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgb(255,0,0)";
  } else ctx.fillStyle = "#fff";
  draw();
  return c;
}

/** Serpentine error diffusion of an N×N RGBA tone tile (R = tone, G = glyph) into an RG 1-bit tile. */
export function diffuse(src: Uint8Array, n: number, algo: number, out: Uint8Array, err: Float32Array) {
  const k = KERNELS[algo];
  for (let i = 0; i < n * n; i++) err[i] = src[i * 4] / 255;
  for (let y = 0; y < n; y++) {
    const rtl = y & 1;
    for (let j = 0; j < n; j++) {
      const x = rtl ? n - 1 - j : j;
      const i = y * n + x;
      const bit = err[i] > 0.5 ? 1 : 0;
      const e = err[i] - bit;
      out[i * 2] = bit * 255;
      out[i * 2 + 1] = src[i * 4 + 1];
      for (const [dx, dy, wt] of k) {
        const xx = rtl ? x - dx : x + dx, yy = y + dy;
        if (xx >= 0 && xx < n && yy < n) err[yy * n + xx] += e * wt;
      }
    }
  }
}

/** Starts the field; returns a cleanup, or null when the browser can't run it (no WebGL2 or float targets). */
export function startField(section: HTMLElement, canvas: HTMLCanvasElement, opts: FieldOpts): (() => void) | null {
  // Probe on a throwaway canvas, so a failure leaves the real one free for the 2D fallback.
  const probe = document.createElement("canvas").getContext("webgl2");
  const ok = !!probe?.getExtension("EXT_color_buffer_float");
  probe?.getExtension("WEBGL_lose_context")?.loseContext();
  if (!ok) return null;
  const gl = canvas.getContext("webgl2", { antialias: false, alpha: false, preserveDrawingBuffer: false, powerPreference: "low-power" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;
  const h1 = section.querySelector("h1")!;
  const sim = compile(gl, SIM), show = compile(gl, SHOW);
  const colors = readColors(section);
  const SIM_SCALE = opts.mobile ? 1 / 4 : 1 / 3; // sim cells per CSS px
  const STEPS = opts.mobile ? 8 : 16;
  const LENS_R = opts.mobile ? 52 : 84, MAG = 2;

  const state = [texture(gl, gl.NEAREST), texture(gl, gl.NEAREST)];
  const fbo = state.map((t) => {
    const f = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    return f;
  });
  const zone = texture(gl, gl.LINEAR), glyph = texture(gl, gl.LINEAR), lensTex = texture(gl, gl.NEAREST);
  const toneTex = texture(gl, gl.NEAREST), toneFbo = gl.createFramebuffer()!;

  let w = 0, h = 0, sw = 0, sh = 0, dpr = 1, cell = 2, cur = 0, n = 0;
  let lensBuf = new Uint8Array(0), lensOut = new Uint8Array(0), lensErr = new Float32Array(0);
  let fence: WebGLSync | null = null, fenceAt: [number, number] = [0, 0];
  const lens = { x: 0, y: 0, shown: null as [number, number] | null, algo: 0, active: false }; // shown: centre of the last tile, null until one lands
  let seed: [number, number, number] | null = null;

  function setup() {
    const r = section.getBoundingClientRect();
    if (Math.round(r.width) === w && Math.round(r.height) === h) return false;
    w = Math.round(r.width);
    h = Math.round(r.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    dpr = canvas.width / w;
    cell = Math.max(2, Math.round(2 * dpr));
    sw = Math.max(8, Math.round(w * SIM_SCALE));
    sh = Math.max(8, Math.round(h * SIM_SCALE));
    n = Math.ceil((2 * LENS_R * dpr) / cell);
    if (!lens.active) park();

    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true);
    const z = drawGlyphs(h1, r, sw, sh, SIM_SCALE, 34 * SIM_SCALE * (opts.mobile ? 0.6 : 1));
    gl!.bindTexture(gl!.TEXTURE_2D, zone);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, gl!.RGBA, gl!.UNSIGNED_BYTE, z);
    gl!.bindTexture(gl!.TEXTURE_2D, glyph);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.R8, gl!.RED, gl!.UNSIGNED_BYTE, drawGlyphs(h1, r, canvas.width, canvas.height, dpr));
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false);

    // The culture: U = 1 everywhere, V dropped in 5×5 specks inside the letters only (smaller or weaker specks just dissolve).
    const zd = z.getContext("2d")!.getImageData(0, 0, sw, sh).data;
    const init = new Float32Array(sw * sh * 4);
    for (let i = 0; i < sw * sh; i++) init[i * 4] = 1;
    for (let y = 2; y < sh - 2; y++)
      for (let x = 2; x < sw - 2; x++)
        if (zd[(y * sw + x) * 4] > 160 && Math.random() < 0.006)
          for (let dy = -2; dy <= 2; dy++)
            for (let dx = -2; dx <= 2; dx++) {
              const i = ((sh - 1 - y - dy) * sw + x + dx) * 4; // canvas rows run down, GL rows up
              init[i] = 0.5;
              init[i + 1] = 1;
            }
    for (const t of state) {
      gl!.bindTexture(gl!.TEXTURE_2D, t);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA32F, sw, sh, 0, gl!.RGBA, gl!.FLOAT, init);
    }
    gl!.bindTexture(gl!.TEXTURE_2D, toneTex);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA8, n, n, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, null);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, toneFbo);
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, toneTex, 0);
    gl!.bindTexture(gl!.TEXTURE_2D, lensTex);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RG8, n, n, 0, gl!.RG, gl!.UNSIGNED_BYTE, null);
    lensBuf = new Uint8Array(n * n * 4);
    lensOut = new Uint8Array(n * n * 2);
    lensErr = new Float32Array(n * n);
    if (fence) gl!.deleteSync(fence);
    fence = null;
    cur = 0;
    return true;
  }

  // Parked over the field, right of the type, so the rose reticle is there before anyone moves.
  function park() {
    lens.x = w * (opts.mobile ? 0.7 : 0.64);
    lens.y = h * (opts.mobile ? 0.76 : 0.6);
  }

  function step(k: number) {
    gl!.useProgram(sim.p);
    gl!.viewport(0, 0, sw, sh);
    gl!.uniform1i(sim.u("u_state"), 0);
    gl!.uniform1i(sim.u("u_zone"), 1);
    gl!.activeTexture(gl!.TEXTURE1);
    gl!.bindTexture(gl!.TEXTURE_2D, zone);
    gl!.activeTexture(gl!.TEXTURE0);
    for (let i = 0; i < k; i++) {
      gl!.uniform3fv(sim.u("u_seed"), i === 0 && seed ? seed : [0, 0, 0]);
      gl!.uniform1f(sim.u("u_seedT"), Math.random() * 100);
      gl!.bindTexture(gl!.TEXTURE_2D, state[cur]);
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo[1 - cur]);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      cur = 1 - cur;
    }
    seed = null;
  }

  function bindShow(pass: number, [lx, ly]: [number, number] = [0, 0], r = LENS_R) {
    gl!.useProgram(show.p);
    const U = show.u;
    [state[cur], zone, glyph, lensTex].forEach((t, i) => {
      gl!.activeTexture(gl!.TEXTURE0 + i);
      gl!.bindTexture(gl!.TEXTURE_2D, t);
    });
    ["u_sim", "u_zone", "u_glyph", "u_lens"].forEach((name, i) => gl!.uniform1i(U(name), i));
    gl!.uniform2f(U("u_css"), w, h);
    gl!.uniform1f(U("u_dpr"), dpr);
    gl!.uniform1f(U("u_cell"), cell);
    gl!.uniform3f(U("u_lensP"), lx, h - ly, r);
    gl!.uniform1f(U("u_lensN"), n);
    gl!.uniform1f(U("u_mag"), MAG);
    gl!.uniform1i(U("u_pass"), pass);
    gl!.uniform3f(U("u_paper"), ...colors.paper);
    gl!.uniform3f(U("u_ink"), ...colors.ink);
    gl!.uniform3f(U("u_teal"), ...colors.teal);
    gl!.uniform3f(U("u_rose"), ...colors.rose);
    gl!.activeTexture(gl!.TEXTURE0);
  }

  // Lens: draw its tone tile, wait for a fence so the read can't stall, read it, diffuse on the CPU, upload.
  function lensTile() {
    if (fence) {
      if (gl!.getSyncParameter(fence, gl!.SYNC_STATUS) !== gl!.SIGNALED) return;
      gl!.deleteSync(fence);
      fence = null;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, toneFbo);
      gl!.readPixels(0, 0, n, n, gl!.RGBA, gl!.UNSIGNED_BYTE, lensBuf);
      diffuse(lensBuf, n, lens.algo, lensOut, lensErr);
      gl!.bindTexture(gl!.TEXTURE_2D, lensTex);
      gl!.pixelStorei(gl!.UNPACK_ALIGNMENT, 1);
      gl!.texSubImage2D(gl!.TEXTURE_2D, 0, 0, 0, n, n, gl!.RG, gl!.UNSIGNED_BYTE, lensOut);
      lens.shown = fenceAt;
      opts.onLens(fenceAt[0], fenceAt[1], LENS_R, lens.algo);
    }
    // Still frame: nothing new to show unless the lens moved.
    if (opts.reduced && lens.shown?.[0] === lens.x && lens.shown[1] === lens.y) return;
    fenceAt = [lens.x, lens.y];
    bindShow(1, fenceAt);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, toneFbo);
    gl!.viewport(0, 0, n, n);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    fence = gl!.fenceSync(gl!.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl!.flush();
  }

  let primed = 0; // frames until the lens tile has real content
  function render() {
    lensTile();
    bindShow(0, lens.shown ?? undefined, lens.shown ? LENS_R : 0);
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    if (primed < 3 && ++primed === 3) section.dataset.live = "";
  }

  // Loop: runs only while on screen and the tab is visible. Reduced motion: no steps, redraw on demand.
  let raf = 0, onScreen = false, settle = 4, lastCycle = performance.now();
  const loop = (t: number) => {
    raf = 0;
    if (setup() && opts.reduced) step(6000);
    if (!opts.reduced) {
      step(STEPS);
      if (t - lastCycle > 3200) {
        lens.algo = (lens.algo + 1) % ALGOS.length;
        lastCycle = t;
      }
    }
    render();
    if (!opts.reduced || --settle > 0 || fence) schedule();
  };
  const schedule = () => {
    if (!raf && onScreen && !document.hidden) raf = requestAnimationFrame(loop);
  };
  // settle: a few frames after any change, so the lens tile's async readback lands even when nothing animates.
  const kick = () => {
    settle = 4;
    schedule();
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    kick();
  });
  io.observe(section);
  const ro = new ResizeObserver(() => kick());
  ro.observe(section);
  document.addEventListener("visibilitychange", kick);

  const local = (e: PointerEvent) => {
    const r = section.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top] as const;
  };
  const move = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    [lens.x, lens.y] = local(e);
    lens.active = true;
    kick();
  };
  const leave = () => {
    lens.active = false;
    park();
    kick();
  };
  const down = (e: PointerEvent) => {
    if ((e.target as Element).closest("a")) return;
    const [x, y] = local(e);
    seed = [(x * sw) / w, ((h - y) * sh) / h, opts.mobile ? 5 : 7];
    if (e.pointerType === "touch") [lens.x, lens.y] = [x, y];
    kick();
  };
  section.addEventListener("pointermove", move);
  section.addEventListener("pointerleave", leave);
  section.addEventListener("pointerdown", down);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener("visibilitychange", kick);
    section.removeEventListener("pointermove", move);
    section.removeEventListener("pointerleave", leave);
    section.removeEventListener("pointerdown", down);
    delete section.dataset.live;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** No WebGL2: one still frame, simulated once on the CPU at 1/8 res, dithered into 2px cells. The real H1 stays on top. */
export function staticField(section: HTMLElement, canvas: HTMLCanvasElement) {
  const r = section.getBoundingClientRect(), hr = section.querySelector("h1")!.getBoundingClientRect();
  const W = Math.round(r.width / 2), H = Math.round(r.height / 2), S = 4; // 4 dither cells per sim cell
  const sw = Math.ceil(W / S) + 1, sh = Math.ceil(H / S) + 1;
  let u = new Float32Array(sw * sh).fill(1), v = new Float32Array(sw * sh), nu = new Float32Array(sw * sh), nv = new Float32Array(sw * sh);
  for (let i = 0; i < 30; i++) {
    const cx = Math.floor(sw * (0.35 + 0.65 * Math.random())), cy = Math.floor(sh * Math.random());
    for (let y = cy - 1; y <= cy + 1; y++) for (let x = cx - 1; x <= cx + 1; x++) if (x >= 0 && y >= 0 && x < sw && y < sh) [u[y * sw + x], v[y * sw + x]] = [0.5, 1];
  }
  const at = (a: Float32Array, x: number, y: number) => a[Math.min(sh - 1, Math.max(0, y)) * sw + Math.min(sw - 1, Math.max(0, x))];
  for (let t = 0; t < 1600; t++) {
    for (let y = 0; y < sh; y++)
      for (let x = 0; x < sw; x++) {
        const i = y * sw + x, a = u[i], b = v[i];
        const lap = (q: Float32Array) =>
          -q[i] + 0.2 * (at(q, x + 1, y) + at(q, x - 1, y) + at(q, x, y + 1) + at(q, x, y - 1)) + 0.05 * (at(q, x + 1, y + 1) + at(q, x - 1, y + 1) + at(q, x + 1, y - 1) + at(q, x - 1, y - 1));
        const m = smooth(0.2, 0.85, x / sw), f = REGIMES.spots[0] + (REGIMES.coral[0] - REGIMES.spots[0]) * m, k = REGIMES.spots[1] + (REGIMES.coral[1] - REGIMES.spots[1]) * m;
        const abb = a * b * b;
        nu[i] = a + lap(u) - abb + f * (1 - a);
        nv[i] = b + 0.5 * lap(v) + abb - (f + k) * b;
      }
    [u, nu] = [nu, u];
    [v, nv] = [nv, v];
  }
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const teal = readColors(section).teal.map((c) => c * 255);
  // Hushed behind the H1 so the real text reads.
  const hx0 = (hr.left - r.left) / 2 - 20, hx1 = (hr.right - r.left) / 2 + 20, hy0 = (hr.top - r.top) / 2 - 20, hy1 = (hr.bottom - r.top) / 2 + 20;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const sx = x / S, sy = y / S, x0 = Math.floor(sx), y0 = Math.floor(sy), fx = sx - x0, fy = sy - y0;
      const b = (at(v, x0, y0) * (1 - fx) + at(v, x0 + 1, y0) * fx) * (1 - fy) + (at(v, x0, y0 + 1) * (1 - fx) + at(v, x0 + 1, y0 + 1) * fx) * fy;
      const inside = x > hx0 && x < hx1 && y > hy0 && y < hy1 ? 0.1 : 1;
      if (smooth(0.1, 0.42, b) * inside > (BAYER[(y & 7) * 8 + (x & 7)] + 0.5) / 64) {
        const i = (y * W + x) * 4;
        [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]] = [teal[0], teal[1], teal[2], 255];
      }
    }
  ctx.putImageData(img, 0, 0);
}
