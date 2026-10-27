(function () {
  var cfg = window.DIWALIKIT_CONFIG || {};
  var PACK_PATH = "pack/diwali-2026-puja-kit.pdf";
  var KEY = "diwalikit-unlock-v1";

  function el(id) { return document.getElementById(id); }

  function readUnlock() {
    try {
      var parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!parsed || !parsed.orderId) return null;
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function reveal(rec) {
    var panel = el("download-panel");
    var link = el("download-link");
    var note = el("download-note");
    if (!panel || !link) return;
    link.href = PACK_PATH;
    link.setAttribute("download", "diwali-2026-puja-kit.pdf");
    note.textContent = "PayPal captured order " + rec.orderId + " in this browser. The PDF download is below.";
    panel.hidden = false;
    var buttons = el("paypal-button");
    if (buttons) buttons.hidden = true;
  }

  function setStatus(text) {
    var status = el("pay-status");
    if (status) status.textContent = text;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error("PayPal failed to load.")); };
      document.head.appendChild(script);
    });
  }

  function setup() {
    var existing = readUnlock();
    if (existing) reveal(existing);
    var id = cfg.PAYPAL_CLIENT_ID || "";
    if (!id || id.indexOf("YOUR_PAYPAL") !== -1) {
      setStatus("PayPal is not configured on this copy of the page.");
      return;
    }
    var src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(id) +
      "&currency=" + encodeURIComponent(cfg.CURRENCY || "USD") + "&intent=capture";
    loadScript(src).then(function () {
      if (!window.paypal || !window.paypal.Buttons) {
        setStatus("PayPal loaded without buttons.");
        return;
      }
      window.paypal.Buttons({
        style: { layout: "vertical", shape: "rect", label: "pay" },
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [{
              description: "Diwali 2026 printable puja kit",
              amount: {
                currency_code: cfg.CURRENCY || "USD",
                value: cfg.PRICE_USD || "7.00"
              }
            }]
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            var orderId = (details && details.id) || data.orderID;
            var status = details && details.status;
            if (!orderId) throw new Error("PayPal did not return an order id.");
            if (status && status !== "COMPLETED") {
              throw new Error("PayPal did not complete the order.");
            }
            var rec = { orderId: orderId, capturedAt: new Date().toISOString() };
            localStorage.setItem(KEY, JSON.stringify(rec));
            reveal(rec);
            setStatus("Payment captured. The download is saved in this browser only.");
          });
        },
        onCancel: function () {
          setStatus("Checkout was cancelled. The download stays hidden.");
        },
        onError: function () {
          setStatus("PayPal reported an error. The download stays hidden. If money left your account, email nidhi69n@gmail.com with the time of the payment.");
        }
      }).render("#paypal-button");
    }).catch(function (err) {
      setStatus(err.message || "PayPal failed to load.");
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
})();
