const test = require("node:test");
const assert = require("node:assert/strict");

const { calculateEcoScore } = require("../src/services/ecoScore");

test("calculates the footprint and points for a T-shirt", () => {
  const result = calculateEcoScore([
    { type: "tshirt", quantity: 1 },
  ]);

  assert.equal(result.totalCarbon, 5);
  assert.equal(result.points, 10);
  assert.equal(result.items[0].name, "T-Shirt");
});

test("calculates the total for multiple clothing items", () => {
  const result = calculateEcoScore([
    { type: "tshirt", quantity: 2 },
    { type: "jeans", quantity: 1 },
  ]);

  assert.equal(result.totalCarbon, 20);
  assert.equal(result.points, 40);
});

test("rejects an unknown clothing type", () => {
  assert.throws(
    () => calculateEcoScore([{ type: "unknown" }]),
    /Unknown clothing type/
  );
});

test("rejects invalid quantities", () => {
  assert.throws(
    () => calculateEcoScore([{ type: "tshirt", quantity: 0 }]),
    /Quantity must be/
  );
});