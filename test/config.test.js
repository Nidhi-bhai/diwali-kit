const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const file = path.join(__dirname, "..", "docs", "config.js");

test("config.js parses and the PayPal client id is set", () => {
  const code = fs.readFileSync(file, "utf8");
  const opens = (code.match(/\/\*/g) || []).length;
  const closes = (code.match(/\*\//g) || []).length;
  assert.equal(opens, closes, "block comments must be closed");
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: "config.js" });
  const cfg = sandbox.window.DIWALIKIT_CONFIG;
  assert.equal(typeof cfg.PAYPAL_CLIENT_ID, "string");
  assert.ok(cfg.PAYPAL_CLIENT_ID.length > 20);
  assert.equal(
    cfg.PAYPAL_CLIENT_ID,
    "BAAb5cq2I0Xx3lFhRJNBjnuGCVT5VDtWfWHgAuSasCoaA_F4cFzLmDWcDmYhsXG6panQVSaRPR3gvrgE9w"
  );
  assert.equal(cfg.PRICE_USD, "7.00");
  assert.equal(cfg.CURRENCY, "USD");
  assert.equal(code.includes("CLIENT_SECRET"), false);
});
