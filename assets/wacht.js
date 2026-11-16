// Toont de huidige tijd in Paramaribo (UTC-3, geen zomertijd) op de 24-uursband.
(function () {
  var nu = document.getElementById("nu");
  var label = document.getElementById("nu-label");
  if (!nu || !label) return;
  function zet() {
    var d = new Date();
    var min = (d.getUTCHours() * 60 + d.getUTCMinutes() - 180 + 1440) % 1440;
    var hh = String(Math.floor(min / 60)).padStart(2, "0");
    var mm = String(min % 60).padStart(2, "0");
    nu.style.setProperty("--pos", (min / 1440).toFixed(4));
    label.textContent = "Nu " + hh + ":" + mm + " in Paramaribo";
    var pos = min / 1440;
    label.style.transform = pos < 0.15 ? "translateX(-8%)" : pos > 0.85 ? "translateX(-92%)" : "translateX(-50%)";
    nu.hidden = false;
  }
  zet();
  setInterval(zet, 30000);
})();
