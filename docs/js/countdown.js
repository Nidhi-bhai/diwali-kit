(function () {
  var api = window.DiwaliCards;
  var label = document.getElementById("countdown-label");
  var clock = document.getElementById("countdown-clock");
  if (!api || !label || !clock) return;

  function render() {
    var state = api.countdown(new Date());
    if (state.phase === "before") {
      label.textContent = "Lakshmi Puja is Sunday 8 November 2026.";
      clock.textContent = api.formatCountdown(state);
      return;
    }
    label.textContent = api.formatCountdown(state);
    clock.textContent = "";
  }

  render();
  window.setInterval(render, 30000);
})();
