const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

test("four free cards are 1080x1350 and the generator burns in the site line", () => {
  const script = read("scripts/build_cards.py");
  assert.match(script, /Free card \+ your city's puja time: nidhi-bhai\.github\.io\/diwali-kit/);
  const { execFileSync } = require("node:child_process");
  for (let i = 1; i <= 4; i++) {
    const file = path.join(root, "docs/share-cards/card-" + i + ".png");
    assert.equal(fs.existsSync(file), true, file);
    const out = execFileSync("python3", ["-c", "from PIL import Image; im=Image.open(r'" + file + "'); print(im.size)"], { encoding: "utf8" });
    assert.equal(out.trim(), "(1080, 1350)");
  }
});

test("the cards page is free and has a WhatsApp share link", () => {
  const html = read("docs/cards/index.html");
  const guide = read("docs/lakshmi-puja.html");
  const home = read("docs/index.html");
  for (const page of [html, guide, home]) {
    assert.match(page, /https:\/\/wa\.me\/\?text=/);
    assert.match(page, /class="family-name"/);
    assert.match(page, /Share on WhatsApp/);
    assert.match(page, /pinterest\.com\/pin\/create\/button/);
    assert.match(page, /Diwali%20wishes/);
    assert.equal(page.includes("pack/diwali-2026-puja-kit.pdf"), false);
  }
  assert.match(html, /Free card \+ your city's puja time: nidhi-bhai\.github\.io\/diwali-kit/);
  assert.match(read("docs/sitemap.xml"), /diwali-kit\/cards\//);
  assert.match(read("docs/js/cards.js"), /wa\.me\/\?text=/);
  assert.equal(read("docs/js/cards.js").includes("paypal"), false);
});
