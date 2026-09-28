import assert from "node:assert";
import { chaseOf, hopsOf, landedOf } from "../forward.js";
import { step, close } from "../forwardrun.js";
import { render } from "../app.js";

const base = {
  budget: 1, hops: 3,
  state: { slots: [], forwards: [], reads: [], ledger: [], applied: [] },
  events: [{ id: 1, kind: "put", name: "a", size: 4 }],
  bad_name_code: "E_BAD_NAME", bad_size_code: "E_BAD_SIZE",
  dup_code: "E_DUP", no_name_code: "E_NO_NAME",
  no_addr_code: "E_NO_ADDR", deep_code: "E_TOO_DEEP",
  event_error_code: "E_BAD_EVENT"
};

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("chaseOf returns a list", () => {
  assert.ok(Array.isArray(chaseOf([[1, 3]], 1)));
});

check("hopsOf returns a number", () => {
  assert.strictEqual(typeof hopsOf([[1, 3]], 1), "number");
});

check("landedOf returns a number", () => {
  assert.strictEqual(typeof landedOf([[1, 3]], 1), "number");
});

check("step returns a state", () => {
  assert.strictEqual(typeof step(base).state, "object");
});

check("render counts events", () => {
  assert.strictEqual(typeof render(base).count_events, "number");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
