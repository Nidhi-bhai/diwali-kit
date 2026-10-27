const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const cities = [
  ["New York City", "05:04 PM to 06:52 PM", "5128581"],
  ["San Francisco", "05:24 PM to 07:15 PM", "5391959"],
  ["Chicago", "04:55 PM to 06:43 PM", "4887398"],
  ["Houston", "05:52 PM to 07:47 PM", "4699066"],
  ["Toronto", "05:17 PM to 07:03 PM", "6167865"],
  ["Vancouver", "05:55 PM to 07:36 PM", "6173331"],
  ["London", "04:35 PM to 06:12 PM", "2643743"],
  ["Leicester", "04:34 PM to 06:10 PM", "2644668"],
  ["Sydney", "08:04 PM to 09:33 PM", "2147714"],
  ["Melbourne", "08:37 PM to 10:03 PM", "2158177"],
  ["Auckland", "08:36 PM to 10:02 PM", "2193733"],
  ["Singapore", "07:19 PM to 09:13 PM", "1880252"],
  ["Dubai", "05:58 PM to 07:56 PM", "292223"],
];

test("the free guide lists every verified city time and a temple disclaimer", () => {
  const html = read("docs/lakshmi-puja.html");
  assert.match(html, /Confirm this with your local temple/);
  assert.match(html, /Made by Nidhi Karuturi/);
  assert.match(html, /nidhi69n@gmail.com/);
  for (const [city, time, id] of cities) {
    assert.ok(html.includes(city), city);
    assert.ok(html.includes(time), time);
    assert.ok(html.includes("geoname-id=" + id), id);
  }
});

test("the paid PDF is unlisted until PayPal capture", () => {
  const index = read("docs/index.html");
  const buy = read("docs/js/buy.js");
  const sitemap = read("docs/sitemap.xml");
  const robots = read("docs/robots.txt");
  assert.match(index, /PayPal can't take payments from buyers in India/);
  assert.match(index, /Made by Nidhi Karuturi/);
  assert.match(index, /actions\.order\.capture|js\/buy\.js/);
  assert.match(buy, /order\.capture/);
  assert.match(buy, /localStorage/);
  assert.match(buy, /pack\/diwali-2026-puja-kit\.pdf/);
  assert.equal(index.includes("pack/diwali-2026-puja-kit.pdf"), false);
  assert.equal(sitemap.includes("pack/"), false);
  assert.match(sitemap, /lakshmi-puja\.html/);
  assert.match(robots, /Disallow: \/diwali-kit\/pack\//);
  const pdf = path.join(root, "docs/pack/diwali-2026-puja-kit.pdf");
  assert.equal(fs.readFileSync(pdf).subarray(0, 5).toString(), "%PDF-");
});
