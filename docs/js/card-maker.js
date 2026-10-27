/* Free card maker. No account, no server.
   Daily designs use the visitor's local calendar date. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.DiwaliCards = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  var SITE = "https://nidhi-bhai.github.io/diwali-kit";
  var DISPLAY_URL = "nidhi-bhai.github.io/diwali-kit";
  var TRIGGER = "Make your own free card";

  var BLESSINGS = [
    "May the house be easy to come home to.",
    "May the people you miss feel near tonight.",
    "A lamp is enough.",
    "Wishing you a full plate and a quiet hour.",
    "May the year ahead be kinder than the last.",
    "Send this to someone who lights a lamp too.",
    "May your kitchen smell like cardamom.",
    "For the group chat, with love.",
    "May the door be open and the flame be watched.",
    "A small light for a dark night.",
    "May you call someone you have been meaning to call.",
    "Sweets first, speeches later.",
    "May the children remember this night.",
    "From our home to yours.",
    "May the week be bright and unhurried.",
    "Light the lamp, then put it out before you sleep."
  ];

  /* opens is a local calendar date, YYYY-MM-DD. One new design each day
     from 28 October through 11 November 2026. The first card is earlier
     so the maker works before that run. */
  var DESIGNS = [
    design("starter", "2026-10-01", "Happy Diwali", "Diwali 2026", "Ready now", "", "diya", "#fbf6ee", "#541418", "#c8963e", "#541418", "#fff8ee"),
    design("lamp", "2026-10-28", "A lamp at the window", "Diwali 2026", "28 Oct", "A greeting, not a festival date.", "diya", "#541418", "#fff8ee", "#e7c27a", "#2a0c10", "#f0d7a6"),
    design("rangoli", "2026-10-29", "Rangoli at the door", "Diwali 2026", "29 Oct", "A greeting, not a festival date.", "dots", "#8a3b12", "#fff8ee", "#f0d7a6", "#3d1a08", "#f8e7c4"),
    design("people", "2026-10-30", "For your people", "Diwali 2026", "30 Oct", "A greeting, not a festival date.", "arch", "#f4e4c4", "#541418", "#7a1f24", "#541418", "#fff8ee"),
    design("sweets", "2026-10-31", "Pass the sweets", "Diwali 2026", "31 Oct", "A greeting, not a festival date.", "band", "#6b2a22", "#fff8ee", "#e7c27a", "#3a1412", "#f0d7a6"),
    design("corner", "2026-11-01", "Light the corner", "Diwali 2026", "1 Nov", "A greeting, not a festival date.", "diya", "#3b241c", "#fff8ee", "#e7c27a", "#24140f", "#f0d7a6"),
    design("evening", "2026-11-02", "A quiet evening", "Diwali 2026", "2 Nov", "A greeting, not a festival date.", "arch", "#fbf6ee", "#541418", "#8a5a12", "#541418", "#fff8ee"),
    design("neighbour", "2026-11-03", "For a neighbour", "Diwali 2026", "3 Nov", "A greeting, not a festival date.", "dots", "#7a1f24", "#fff8ee", "#f0d7a6", "#541418", "#fff8ee"),
    design("house", "2026-11-04", "The house is ready", "Diwali 2026", "4 Nov", "A greeting, not a festival date.", "band", "#c47b2b", "#2a1814", "#fff8ee", "#6a3e10", "#fff8ee"),
    design("week", "2026-11-05", "This week of lamps", "Diwali 2026", "5 Nov", "A greeting, not a festival date.", "diya", "#541418", "#fff8ee", "#e7c27a", "#2a0c10", "#f0d7a6"),
    design("dhanteras", "2026-11-06", "Shubh Dhanteras", "Friday 6 November 2026", "6 Nov", "Drik Panchang lists Dhanteras on Friday 6 November 2026 for every city in the guide.", "diya", "#8a3b12", "#fff8ee", "#f8e7c4", "#3d1a08", "#f8e7c4"),
    design("choti", "2026-11-07", "Choti Diwali", "Saturday 7 November 2026", "7 Nov", "Many families use this name for the eve. Drik Panchang's New Delhi calendar lists Kali Chaudas on Saturday 7 November 2026.", "dots", "#541418", "#fff8ee", "#e7c27a", "#2a0c10", "#f0d7a6"),
    design("lakshmi", "2026-11-08", "Lakshmi Puja", "Sunday 8 November 2026", "8 Nov", "Drik Panchang lists Lakshmi Puja on Sunday 8 November 2026 for every city in the guide. The clock time is on the guide, and it differs by city.", "arch", "#fbf6ee", "#541418", "#c8963e", "#541418", "#fff8ee"),
    design("govardhan", "2026-11-09", "Govardhan Puja", "Opens 9 November", "9 Nov", "Drik lists Govardhan Puja on Monday 9 November 2026 for the US, Canada, the UK, and Dubai, and on Tuesday 10 November for New Delhi, Singapore, Australia, and New Zealand.", "band", "#2f4a38", "#fff8ee", "#e7c27a", "#1c2e22", "#f0d7a6"),
    design("bhai", "2026-11-10", "Bhai Dooj", "Opens 10 November", "10 Nov", "Drik lists Bhai Dooj on Tuesday 10 November 2026 for the US, Canada, the UK, and Dubai, and on Wednesday 11 November for New Delhi, Singapore, Australia, and New Zealand.", "diya", "#7a1f24", "#fff8ee", "#f0d7a6", "#541418", "#fff8ee"),
    design("tilak", "2026-11-11", "A tilak for Bhai Dooj", "Wednesday 11 November 2026", "11 Nov", "A second Bhai Dooj card, for homes keeping Wednesday 11 November 2026. Drik's New Delhi page uses that date.", "dots", "#f4e4c4", "#541418", "#7a1f24", "#541418", "#fff8ee")
  ];

  function design(id, opens, title, kicker, shortDate, note, motif, bg, ink, accent, footer, footerInk) {
    return {
      id: id,
      opens: opens,
      title: title,
      kicker: kicker,
      shortDate: shortDate,
      note: note,
      motif: motif,
      bg: bg,
      ink: ink,
      accent: accent,
      footer: footer,
      footerInk: footerInk
    };
  }

  function clean(value) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, 40);
  }

  function isoDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }

  function isOpen(item, iso) {
    return item.opens <= iso;
  }

  function latestOpen(iso) {
    var found = null;
    DESIGNS.forEach(function (item) {
      if (isOpen(item, iso)) found = item;
    });
    return found;
  }

  function familyLine(given, family) {
    given = clean(given);
    family = clean(family).replace(/^from the\s+/i, "").replace(/\s+family$/i, "");
    var line = "";
    if (family) line = "From the " + family + " family";
    else if (given) line = "From " + given;
    return { line: line, signature: family && given ? given : "" };
  }

  function pickBlessing(rng) {
    var roll = typeof rng === "function" ? rng() : Math.random();
    if (!(roll >= 0) || roll >= 1) roll = 0;
    var index = Math.floor(roll * BLESSINGS.length);
    if (index >= BLESSINGS.length) index = BLESSINGS.length - 1;
    return BLESSINGS[index];
  }

  function shareText(item, fields, blessing) {
    var fam = familyLine(fields && fields.given, fields && fields.family);
    var parts = [item.title];
    if (fam.line) parts.push(fam.line + ".");
    if (blessing) parts.push(blessing);
    parts.push(TRIGGER + ": " + SITE);
    return parts.join(" ");
  }

  function whatsAppUrl(text) {
    return "https://wa.me/?text=" + encodeURIComponent(text);
  }

  function countdown(now) {
    var target = new Date(2026, 10, 8, 0, 0, 0, 0);
    var end = new Date(2026, 10, 9, 0, 0, 0, 0);
    if (now >= end) return { phase: "after" };
    if (now >= target) return { phase: "today" };
    var total = Math.floor((target - now) / 1000);
    if (total < 0) total = 0;
    return {
      phase: "before",
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60)
    };
  }

  function formatCountdown(state) {
    if (state.phase === "today") return "Lakshmi Puja is today, Sunday 8 November 2026.";
    if (state.phase === "after") return "Lakshmi Puja was Sunday 8 November 2026.";
    function unit(n, word) {
      return n + " " + word + (n === 1 ? "" : "s");
    }
    return unit(state.days, "day") + ", " + unit(state.hours, "hour") + ", " + unit(state.minutes, "minute");
  }

  return {
    SITE: SITE,
    DISPLAY_URL: DISPLAY_URL,
    TRIGGER: TRIGGER,
    BLESSINGS: BLESSINGS,
    DESIGNS: DESIGNS,
    clean: clean,
    isoDate: isoDate,
    isOpen: isOpen,
    latestOpen: latestOpen,
    familyLine: familyLine,
    pickBlessing: pickBlessing,
    shareText: shareText,
    whatsAppUrl: whatsAppUrl,
    countdown: countdown,
    formatCountdown: formatCountdown
  };
});
