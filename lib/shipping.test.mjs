import test from "node:test";
import assert from "node:assert/strict";
import { shippingCost, shippingZone } from "./shipping.ts";

const rates = {
  shipping_flat_cents: "1500",
  free_shipping_threshold_cents: "10000",
  shipping_world_cents: "2500",
  shipping_australia_cents: "4200",
};

test("Europe retains the standard and free shipping threshold", () => {
  assert.equal(shippingCost("RO", 2999, rates), 1500);
  assert.equal(shippingCost("DE", 10000, rates), 0);
});

test("Australia and other distant countries never use Europe's free threshold", () => {
  assert.equal(shippingZone("AU"), "australia");
  assert.equal(shippingCost("AU", 20000, rates), 4200);
  assert.equal(shippingCost("US", 20000, rates), 2500);
});

test("unconfigured distant destination cannot start checkout", () => {
  assert.equal(shippingCost("AU", 2999, { ...rates, shipping_australia_cents: "0" }), null);
  assert.equal(shippingCost("US", 2999, { ...rates, shipping_world_cents: "0" }), null);
});
