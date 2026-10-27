(function () {
  var api = window.DiwaliCards;
  if (!api) return;

  var canvas = document.getElementById("card-canvas");
  var givenInput = document.getElementById("given-name");
  var familyInput = document.getElementById("family-name");
  var picker = document.getElementById("design-picker");
  var note = document.getElementById("design-note");
  var blessingEl = document.getElementById("blessing");
  var wa = document.getElementById("wa-share");
  var status = document.getElementById("share-status");
  if (!canvas || !picker) return;

  var NAME_KEY = "diwalikit-card-names";
  var today = api.isoDate(new Date());
  var selected = api.latestOpen(today);
  var blessing = api.pickBlessing();

  function loadNames() {
    try {
      var saved = JSON.parse(localStorage.getItem(NAME_KEY) || "null");
      if (!saved) return;
      if (givenInput && saved.given) givenInput.value = saved.given;
      if (familyInput && saved.family) familyInput.value = saved.family;
    } catch (err) {
      /* This browser is not storing the name. The card still works. */
    }
  }

  function saveNames() {
    try {
      localStorage.setItem(NAME_KEY, JSON.stringify({
        given: givenInput ? givenInput.value : "",
        family: familyInput ? familyInput.value : ""
      }));
    } catch (err) {
      /* Ignore a full or blocked store. */
    }
  }

  function fields() {
    return {
      given: givenInput ? givenInput.value : "",
      family: familyInput ? familyInput.value : ""
    };
  }

  function currentText() {
    return api.shareText(selected, fields(), blessing);
  }

  function fit(ctx, text, maxWidth, start) {
    var size = start;
    ctx.font = "600 " + size + "px Georgia, serif";
    while (size > 28 && ctx.measureText(text).width > maxWidth) {
      size -= 2;
      ctx.font = "600 " + size + "px Georgia, serif";
    }
  }

  function wrap(ctx, text, maxWidth) {
    var words = String(text || "").split(" ");
    var lines = [];
    var line = "";
    words.forEach(function (word) {
      var trial = line ? line + " " + word : word;
      if (line && ctx.measureText(trial).width > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = trial;
      }
    });
    if (line) lines.push(line);
    return lines;
  }

  function motif(ctx, kind, accent, ink) {
    var x = 540;
    var y = 230;
    ctx.fillStyle = accent;
    if (kind === "dots") {
      [0, 1, 2, 3, 4].forEach(function (i) {
        ctx.beginPath();
        ctx.arc(x - 120 + i * 60, y + (i % 2) * 18, 16, 0, Math.PI * 2);
        ctx.fill();
      });
      return;
    }
    if (kind === "arch") {
      ctx.strokeStyle = accent;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(x, y + 40, 90, Math.PI, 0);
      ctx.stroke();
      return;
    }
    if (kind === "band") {
      ctx.fillRect(180, y, 720, 14);
      ctx.fillRect(260, y + 36, 560, 8);
      return;
    }
    ctx.beginPath();
    ctx.ellipse(x, y + 36, 78, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink === "#fff8ee" ? "#f0d7a6" : "#e07a2f";
    ctx.beginPath();
    ctx.moveTo(x, y - 70);
    ctx.lineTo(x - 24, y + 16);
    ctx.lineTo(x + 24, y + 16);
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    var d = selected;
    var fam = api.familyLine(fields().given, fields().family);
    var ctx = canvas.getContext("2d");
    canvas.width = 1080;
    canvas.height = 1350;
    ctx.fillStyle = d.bg;
    ctx.fillRect(0, 0, 1080, 1350);
    ctx.strokeStyle = d.accent;
    ctx.lineWidth = 8;
    ctx.strokeRect(46, 46, 988, 1258);
    motif(ctx, d.motif, d.accent, d.ink);

    ctx.fillStyle = d.ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "32px Georgia, serif";
    ctx.fillText(d.kicker, 540, 400);
    fit(ctx, d.title, 900, d.title.length > 18 ? 72 : 84);
    ctx.fillText(d.title, 540, 500);

    if (fam.line) {
      fit(ctx, fam.line, 900, 54);
      ctx.fillText(fam.line, 540, 640);
    }
    if (fam.signature) {
      ctx.font = "36px Georgia, serif";
      ctx.fillText(fam.signature, 540, 710);
    }

    ctx.font = "34px Georgia, serif";
    var lines = wrap(ctx, blessing, 860).slice(0, 4);
    lines.forEach(function (line, i) {
      ctx.fillText(line, 540, 860 + i * 48);
    });

    ctx.fillStyle = d.footer;
    ctx.fillRect(46, 1168, 988, 136);
    ctx.fillStyle = d.footerInk;
    ctx.font = "32px Georgia, serif";
    ctx.fillText(api.TRIGGER, 540, 1212);
    ctx.font = "28px Georgia, serif";
    ctx.fillText(api.DISPLAY_URL, 540, 1262);
  }

  function refreshLink() {
    if (wa) wa.href = api.whatsAppUrl(currentText());
  }

  function showNote() {
    if (!note) return;
    note.textContent = selected.note || "";
  }

  function markPicker() {
    var buttons = picker.querySelectorAll("button");
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", button.getAttribute("data-id") === selected.id ? "true" : "false");
    });
  }

  function renderPicker() {
    picker.innerHTML = "";
    api.DESIGNS.forEach(function (item) {
      var open = api.isOpen(item, today);
      var button = document.createElement("button");
      button.type = "button";
      button.setAttribute("data-id", item.id);
      button.style.borderTop = "6px solid " + item.accent;
      var name = document.createElement("span");
      name.className = "design-name";
      name.textContent = item.title;
      var when = document.createElement("span");
      when.className = "design-when";
      when.textContent = open ? item.shortDate : "Opens " + item.shortDate;
      button.appendChild(name);
      button.appendChild(when);
      if (!open) button.disabled = true;
      button.addEventListener("click", function () {
        if (!open) return;
        selected = item;
        blessing = api.pickBlessing();
        if (blessingEl) blessingEl.textContent = blessing;
        markPicker();
        showNote();
        draw();
        refreshLink();
      });
      picker.appendChild(button);
    });
    markPicker();
  }

  function reroll() {
    var next = api.pickBlessing();
    if (next === blessing) next = api.pickBlessing();
    blessing = next;
    if (blessingEl) blessingEl.textContent = blessing;
    draw();
    refreshLink();
  }

  function download() {
    var link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = selected.id + "-diwali-card.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function shareImage() {
    var text = currentText();
    if (!navigator.share) {
      if (status) status.textContent = "This browser has no share sheet. The WhatsApp button sends the wish and the link. Download the picture if you want to attach it.";
      return;
    }
    canvas.toBlob(function (blob) {
      var file = new File([blob], "diwali-card.png", { type: "image/png" });
      var payload = { text: text, title: selected.title };
      var shareFiles = navigator.canShare && navigator.canShare({ files: [file] });
      if (shareFiles) payload.files = [file];
      navigator.share(payload).then(function () {
        if (status) {
          status.textContent = shareFiles
            ? "The share sheet opened with the picture."
            : "The share sheet opened with the words. Download the picture if you also want to attach it.";
        }
      }).catch(function (err) {
        if (err && err.name === "AbortError") return;
        if (shareFiles) {
          navigator.share({ text: text, title: selected.title }).catch(function () {
            if (status) status.textContent = "The share sheet did not open. Use the WhatsApp button, or download the picture.";
          });
          return;
        }
        if (status) status.textContent = "The share sheet did not open. Use the WhatsApp button, or download the picture.";
      });
    }, "image/png");
  }

  loadNames();
  renderPicker();
  showNote();
  if (blessingEl) blessingEl.textContent = blessing;
  draw();
  refreshLink();

  [givenInput, familyInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", function () {
      saveNames();
      draw();
      refreshLink();
    });
  });

  var again = document.getElementById("another-wish");
  if (again) again.addEventListener("click", reroll);
  var down = document.getElementById("download-card");
  if (down) down.addEventListener("click", download);
  var share = document.getElementById("share-image");
  if (share) share.addEventListener("click", shareImage);
})();
