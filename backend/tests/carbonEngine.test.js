const test = require("node:test");
const assert = require("node:assert/strict");
const carbonData = require("./carbonData");
const C = require("./config");
const { scoreOutfit, offersFor, savingsKg, gradeFor } = require("./carbonEngine");

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);

test("savings and points are never negative, whatever the input (H&M-style sign bug)", () => {
  const types = [...Object.keys(carbonData), "banana", null, "constructor", "__proto__"];
  const mats = [...Object.keys(C.MATERIAL_MULT), "glitter", null];
  const conds = ["new", "secondhand", "owned", "garbage", undefined];
  const months = [-5, 0, 9, 1000, "abc"];
  const qtys = [0, 1, 50, "x", null, -3];
  for (const t of types) for (const m of mats) for (const c of conds)
    for (const mo of months) for (const q of qtys) {
      const r = scoreOutfit([{ type: t, material: m, quantity: q }], { condition: c, monthsOwned: mo });
      assert.ok(r.total.savings_kg >= 0);
      assert.ok(Number.isInteger(r.points) && r.points >= 0);
      assert.ok(r.total.footprint_kg > 0);
    }
});

test("unknown type falls back to 'other'", () => {
  const r = scoreOutfit([{ type: "spacesuit" }]);
  assert.equal(r.items[0].type, "other");
  assert.equal(r.items[0].unit_kg, carbonData.other.carbon);
});

test("unknown material is neutral", () => {
  assert.equal(scoreOutfit([{ type: "tshirt", material: "unobtainium" }]).items[0].unit_kg, 5);
});

test("empty and malformed input is safe", () => {
  for (const bad of [[], null, undefined, "str", ["string", 5, null]]) {
    const r = scoreOutfit(bad);
    assert.equal(r.total.footprint_kg, 0);
    assert.equal(r.points, 0);
    assert.equal(r.total.confidence, "low");
  }
});

test("buying new earns no points; invalid condition never over-rewards", () => {
  assert.equal(scoreOutfit([{ type: "jeans" }], { condition: "new" }).points, 0);
  assert.equal(scoreOutfit([{ type: "jeans" }], { condition: "hacked" }).points, 0);
});

test("second-hand uses the displacement rate", () => {
  close(savingsKg(5, "secondhand", 0), 1.575); // 5 x 0.90 x 0.35
});

test("longevity bonus is capped at 30%", () => {
  close(savingsKg(10, "owned", 10_000), 3);
});

test("range brackets the estimate and widens on fallback", () => {
  const n = scoreOutfit([{ type: "jacket" }]).total;
  const f = scoreOutfit([{ type: "jacket" }], { fallback: true }).total;
  assert.ok(n.range_kg[0] <= n.footprint_kg && n.footprint_kg <= n.range_kg[1]);
  assert.ok(f.range_kg[1] - f.range_kg[0] > n.range_kg[1] - n.range_kg[0]);
  assert.equal(f.confidence, "low");
});

test("lifecycle stages sum to the total", () => {
  close(Object.values(C.STAGE_SPLIT).reduce((a, b) => a + b, 0), 1);
  const item = scoreOutfit([{ type: "dress", quantity: 2 }]).items[0];
  const sum = Object.values(item.stages_kg).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - item.footprint_kg) <= 0.05);
});

test("grade boundaries", () => {
  for (const [kg, g] of [[0, "A"], [3, "A"], [3.01, "B"], [6, "B"], [10, "C"], [15, "D"], [15.01, "E"]])
    assert.equal(gradeFor(kg), g);
});

test("quantity is clamped", () => {
  assert.equal(scoreOutfit([{ type: "tshirt", quantity: 9999 }]).items[0].quantity, 20);
});

test("offers unlock by points", () => {
  assert.deepEqual(offersFor(0).available, []);
  assert.equal(offersFor(0).next_offer.points_needed, 10);
  assert.equal(offersFor(50).available.length, 3);
  assert.equal(offersFor(10_000).next_offer, null);
});