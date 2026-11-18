import test from "node:test";
import assert from "node:assert/strict";
import { shippingCost, shippingZone } from "./shipping.ts";

const rates = {
  shipping_flat_cents: "1500",
  free_shipping_threshold_cents: "10000",
  shipping_world_cents: "2500",
};

test("US uses the standard rate below the free shipping threshold", () => {
  assert.equal(shippingZone("US"), "us");
  assert.equal(shippingCost("US", 9999, rates), 1500);
  assert.equal(shippingCost("US", 10000, rates), 0);
});

test("all countries outside the US use the rest-of-world rate", () => {
  assert.equal(shippingZone("RO"), "world");
  assert.equal(shippingZone("AU"), "world");
  assert.equal(shippingCost("RO", 20000, rates), 2500);
  assert.equal(shippingCost("AU", 20000, rates), 2500);
});

test("an unconfigured rate cannot start checkout", () => {
  assert.equal(shippingCost("RO", 2999, { ...rates, shipping_world_cents: "0" }), null);
  assert.equal(shippingCost("US", 2999, { ...rates, shipping_flat_cents: "0" }), null);
});
