// Run: node src/components/site/hero-a/life.check.mjs
import assert from "node:assert/strict";
import { organism, plant, step } from "./life.ts";

const w = 8, h = 8;
const at = (g) => [...g].flatMap((v, i) => (v ? [i] : []));

// A blinker flips and flips back.
const a = new Uint8Array(w * h), b = new Uint8Array(w * h);
plant(a, w, h, 3, 3, [[0, 0], [1, 0], [2, 0]]);
assert.equal(step(a, b, w, h), 3);
assert.deepEqual(at(b), [20, 28, 36]);
step(b, a, w, h);
assert.deepEqual(at(a), [27, 28, 29]);

// A glider wraps around the torus and comes home after 4 * 8 generations.
const g = new Uint8Array(w * h), t = new Uint8Array(w * h);
plant(g, w, h, 0, 0, [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]]);
const start = at(g);
let x = g, y = t;
for (let i = 0; i < 32; i++) { assert.equal(step(x, y, w, h), 5); [x, y] = [y, x]; }
assert.deepEqual(at(x), start);

// Same login, same organism.
assert.deepEqual(organism("ravixalgorithm"), organism("ravixalgorithm"));
console.log("life ok");
