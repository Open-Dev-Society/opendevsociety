// Run: node src/components/site/atlas/organism.check.mjs
import assert from "node:assert/strict";
import { colony, grow, ringsOf } from "./organism.ts";

const os = { name: "OpenStock", language: "TypeScript", stars: 21406, forks: 2669, discoverers: 21 };
// Same data, same organism; a different name grows a different one.
assert.deepEqual(grow(os, 50), grow(os, 50));
assert.notDeepEqual(grow(os, 50).s, grow({ ...os, name: "kitbash" }, 50).s);
assert.equal(ringsOf(0), 1);
assert.equal(ringsOf(21406), 5);

// The colony: fig. 1 on the top axis, the rest alternate right/left, and the foot stays clear.
const tools = Array.from({ length: 15 }, (_, i) => ({ ...os, name: `t${i}`, stars: 1000 >> i }));
const c = colony(tools, Array(24).fill(5));
assert.equal(c.slots[0].theta, 0);
c.slots.slice(1).forEach((s, i) => assert.equal(Math.sign(s.theta), i % 2 ? -1 : 1));
assert.ok(c.slots.every((s) => Math.abs(s.theta) < Math.PI - 0.1));
assert.ok(Math.abs(c.vacant.x - 500) < 0.01 && c.vacant.y > 500);
console.log("organism ok");
