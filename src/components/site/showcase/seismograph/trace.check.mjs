// node src/components/site/showcase/seismograph/trace.check.mjs: order and month ticks.
import assert from "node:assert/strict";
import { byActivity, monthTicks } from "./trace.ts";

const w = (recent, old = 0) => [...Array(44).fill(old), ...Array(8).fill(recent)];
const lanes = [
  { name: "a", stars: 9, weeks: w(0, 5) },
  { name: "b", stars: 1, weeks: w(2) },
  { name: "c", stars: 5, weeks: w(2) },
];
assert.deepEqual(lanes.sort(byActivity).map((l) => l.name), ["c", "b", "a"]); // recent beats old, ties go to stars

const from = Date.UTC(2025, 10, 16), to = Date.UTC(2026, 10, 15);
const t = monthTicks(from, to);
assert.equal(t[0].label, "Dec");
assert.equal(t.at(-1).label, "Nov");
assert.equal(t.at(-1).end, true);
assert.equal(t.length, 12);
assert.ok(t.find((x) => x.label === "Jan 2026") && t.find((x) => x.label === "Feb"));
assert.ok(t.every((x) => x.at >= 0 && x.at <= 1));
console.log("trace ok");
