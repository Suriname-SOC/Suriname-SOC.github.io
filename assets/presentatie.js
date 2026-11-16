// Presentatie: één dia per keer op brede schermen, bladeren met toetsen, knoppen of vegen.
(function () {
  var dias = Array.prototype.slice.call(document.querySelectorAll(".dia"));
  var teller = document.getElementById("teller");
  var vorige = document.getElementById("vorige");
  var volgende = document.getElementById("volgende");
  var scherm = document.getElementById("scherm");
  var pdf = document.getElementById("pdf");
  var deck = document.getElementById("deck");
  if (!dias.length || !teller) return;

  document.documentElement.classList.add("js");
  var breed = window.matchMedia("(min-width: 48rem) and (min-aspect-ratio: 4/3)");
  var i = 0;

  function uitAdres() {
    var m = location.hash.match(/^#dia-(\d+)$/);
    return m ? Math.min(Math.max(parseInt(m[1], 10) - 1, 0), dias.length - 1) : 0;
  }

  function toon(n, adres) {
    var oud = i;
    i = Math.min(Math.max(n, 0), dias.length - 1);
    dias.forEach(function (d, k) {
      d.hidden = breed.matches && k !== i;
      d.classList.remove("verschijnt");
    });
    if (breed.matches && oud !== i) {
      var d = dias[i];
      d.style.setProperty("--richting", i > oud ? "2%" : "-2%");
      void d.offsetWidth;
      d.classList.add("verschijnt");
    }
    teller.textContent = i + 1 + " / " + dias.length;
    vorige.disabled = i === 0;
    volgende.disabled = i === dias.length - 1;
    if (adres) history.replaceState(null, "", "#dia-" + (i + 1));
  }

  vorige.addEventListener("click", function () { toon(i - 1, true); });
  volgende.addEventListener("click", function () { toon(i + 1, true); });
  pdf.addEventListener("click", function () { window.print(); });

  function volledig() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  }
  if (document.documentElement.requestFullscreen) scherm.addEventListener("click", volledig);
  else scherm.hidden = true;

  document.addEventListener("keydown", function (e) {
    if (!breed.matches || e.altKey || e.ctrlKey || e.metaKey) return;
    var knop = e.target.tagName === "BUTTON" || e.target.tagName === "A";
    var k = e.key;
    if (k === "ArrowRight" || k === "PageDown" || (k === " " && !knop)) { e.preventDefault(); toon(i + 1, true); }
    else if (k === "ArrowLeft" || k === "PageUp") { e.preventDefault(); toon(i - 1, true); }
    else if (k === "Home") { e.preventDefault(); toon(0, true); }
    else if (k === "End") { e.preventDefault(); toon(dias.length - 1, true); }
    else if (k === "f" || k === "F") { volledig(); }
  });

  // Vegen op aanraakschermen
  var startX = null;
  deck.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") startX = e.clientX; });
  deck.addEventListener("pointerup", function (e) {
    if (startX === null) return;
    var dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50) toon(dx < 0 ? i + 1 : i - 1, true);
  });

  window.addEventListener("hashchange", function () { toon(uitAdres(), false); });
  breed.addEventListener("change", function () { toon(i, false); });
  window.addEventListener("beforeprint", function () { dias.forEach(function (d) { d.hidden = false; }); });
  window.addEventListener("afterprint", function () { toon(i, false); });

  i = uitAdres();
  toon(i, false);
})();
