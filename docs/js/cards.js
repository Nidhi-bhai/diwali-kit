(function () {
  var SITE = "https://nidhi-bhai.github.io/diwali-kit";
  var PLATE = { x: 90, y: 990, w: 900, h: 130 };

  function fit(ctx, text, maxWidth, startSize) {
    var size = startSize;
    ctx.font = "600 " + size + "px Georgia, serif";
    while (size > 28 && ctx.measureText(text).width > maxWidth) {
      size -= 2;
      ctx.font = "600 " + size + "px Georgia, serif";
    }
    return size;
  }

  function paint(canvas, img, name, ink, plateFill) {
    var ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    if (!name) return;
    ctx.fillStyle = plateFill;
    ctx.fillRect(PLATE.x, PLATE.y, PLATE.w, PLATE.h);
    ctx.fillStyle = ink;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    fit(ctx, name, PLATE.w - 48, 64);
    ctx.fillText(name, PLATE.x + PLATE.w / 2, PLATE.y + PLATE.h / 2);
  }

  function wishText(base, name) {
    var text = base;
    if (name) text += " From the " + name + " family.";
    return text + " " + SITE;
  }

  function setup(root) {
    var input = root.querySelector(".family-name");
    var base = root.getAttribute("data-img") || "share-cards/";
    var articles = root.querySelectorAll(".wish");

    function currentName() {
      var raw = input ? input.value : "";
      return raw.replace(/\s+/g, " ").trim().slice(0, 40);
    }

    articles.forEach(function (article) {
      var canvas = article.querySelector("canvas");
      var img = new Image();
      img.alt = "";
      img.src = base + article.getAttribute("data-file");
      var ink = article.getAttribute("data-ink") || "#541418";
      var plateFill = article.getAttribute("data-plate") || "#fffaf3";

      function draw() {
        if (!img.complete || !img.naturalWidth) return;
        paint(canvas, img, currentName(), ink, plateFill);
      }

      img.onload = draw;

      var wa = article.querySelector(".wa");
      function refreshLink() {
        if (!wa) return;
        var text = wishText(article.getAttribute("data-wish") || "Happy Diwali.", currentName());
        wa.href = "https://wa.me/?text=" + encodeURIComponent(text);
      }
      refreshLink();

      var download = article.querySelector(".download-card");
      if (download) {
        download.addEventListener("click", function (event) {
          if (!currentName() || !canvas.width) return;
          event.preventDefault();
          var link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.download = article.getAttribute("data-download") || "diwali-card.png";
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
      }

      if (input) input.addEventListener("input", function () {
        draw();
        refreshLink();
      });
    });
  }

  function init() {
    document.querySelectorAll(".share-cards").forEach(setup);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
