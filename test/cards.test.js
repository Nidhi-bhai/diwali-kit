const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const cards = require("../docs/js/card-maker.js");

test("four ready-made cards are 1080x1350", () => {
  const { execFileSync } = require("node:child_process");
  for (let i = 1; i <= 4; i++) {
    const file = path.join(root, "docs/share-cards/card-" + i + ".png");
    const out = execFileSync("python3", ["-c", "from PIL import Image; im=Image.open(r'" + file + "'); print(im.size)"], { encoding: "utf8" });
    assert.equal(out.trim(), "(1080, 1350)");
  }
});

test("a new design opens each day from 28 October to 11 November 2026", () => {
  const daily = cards.DESIGNS.filter((item) => item.opens >= "2026-10-28" && item.opens <= "2026-11-11");
  const dates = daily.map((item) => item.opens);
  assert.equal(new Set(dates).size, dates.length);
  const cursor = new Date(2026, 9, 28);
  const end = new Date(2026, 10, 11);
  while (cursor <= end) {
    const iso = cards.isoDate(cursor);
    assert.equal(dates.filter((item) => item === iso).length, 1, iso);
    cursor.setDate(cursor.getDate() + 1);
  }
  assert.equal(cards.latestOpen("2026-10-27").id, "starter");
  assert.equal(cards.isOpen(cards.DESIGNS.find((item) => item.id === "dhanteras"), "2026-11-05"), false);
  assert.equal(cards.isOpen(cards.DESIGNS.find((item) => item.id === "dhanteras"), "2026-11-06"), true);
  assert.equal(cards.latestOpen("2026-11-08").id, "lakshmi");
  assert.equal(cards.latestOpen("2026-11-12").id, "tilak");
  for (const id of ["dhanteras", "choti", "lakshmi", "govardhan", "bhai"]) {
    assert.ok(cards.DESIGNS.some((item) => item.id === id));
  }
});

test("the family line and the share text close the loop", () => {
  assert.deepEqual(cards.familyLine("Priya", "Sharma"), {
    line: "From the Sharma family",
    signature: "Priya"
  });
  const design = cards.DESIGNS.find((item) => item.id === "lakshmi");
  const text = cards.shareText(design, { given: "Priya", family: "Sharma" }, "A lamp is enough.");
  assert.match(text, /From the Sharma family/);
  assert.match(text, /Make your own free card: https:\/\/nidhi-bhai\.github\.io\/diwali-kit/);
  assert.equal(cards.whatsAppUrl(text).startsWith("https://wa.me/?text="), true);
  assert.equal(cards.pickBlessing(() => 0), cards.BLESSINGS[0]);
  assert.equal(cards.pickBlessing(() => 0.999), cards.BLESSINGS[cards.BLESSINGS.length - 1]);
});

test("the Lakshmi Puja countdown is a real date, not a sale timer", () => {
  const before = cards.countdown(new Date(2026, 9, 27, 15, 0, 0));
  assert.equal(before.phase, "before");
  assert.equal(before.days, 11);
  assert.equal(before.hours, 9);
  assert.equal(cards.countdown(new Date(2026, 10, 8, 12, 0, 0)).phase, "today");
  assert.equal(cards.countdown(new Date(2026, 10, 9, 0, 0, 0)).phase, "after");
  assert.match(cards.formatCountdown(before), /11 days, 9 hours, 0 minutes/);
  assert.equal(cards.formatCountdown({ phase: "today" }).includes("today"), true);
});

test("the card maker is free and the home page counts down", () => {
  const html = read("docs/cards/index.html");
  const home = read("docs/index.html");
  const guide = read("docs/lakshmi-puja.html");
  assert.match(html, /id="given-name"/);
  assert.match(html, /id="family-name"/);
  assert.match(html, /id="wa-share"/);
  assert.match(html, /https:\/\/wa\.me\/\?text=/);
  assert.match(html, /id="share-image"/);
  assert.match(html, /id="upsell"/);
  assert.match(html, /\$7/);
  assert.match(html, /PayPal can't take payments from buyers in India/);
  assert.match(html, /no sign-up/i);
  assert.equal(html.includes("pack/diwali-2026-puja-kit.pdf"), false);
  assert.match(read("docs/js/cards.js"), /navigator\.share/);
  assert.match(read("docs/js/cards.js"), /Make your own free card|api\.TRIGGER/);
  assert.equal(read("docs/js/cards.js").includes("paypal"), false);
  assert.match(home, /id="lakshmi-countdown"/);
  assert.match(home, /Sunday 8 November 2026/);
  assert.match(home, /not your city's muhurat/);
  assert.match(guide, /cards\//);
  assert.equal(home.includes("hurry"), false);
  assert.equal(html.includes("people have"), false);
});
