// SOC Suriname: poort (privacymelding), menu, illustraties en klok.
(function () {
  var html = document.documentElement;

  // --- Poort: twee luiken met de privacymelding, één keer per bezoek ---
  var poort = document.getElementById("poort");
  var openKnop = document.getElementById("poort-open");
  var achter = document.querySelectorAll(".skip, .top, main, .voet");

  function zetInert(aan) {
    achter.forEach(function (el) { if (aan) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
  }

  function openPoort() {
    try { sessionStorage.setItem("poort-open", "1"); } catch (e) { /* privévenster: dan volgende pagina opnieuw */ }
    var snel = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    poort.classList.add("opent");
    zetInert(false);
    setTimeout(function () {
      html.classList.remove("poort-dicht");
      poort.remove();
      var h1 = document.querySelector("main h1");
      if (h1) h1.focus({ preventScroll: true });
    }, snel ? 260 : 1600);
  }

  if (poort && html.classList.contains("poort-dicht")) {
    zetInert(true);
    openKnop.focus();
    openKnop.addEventListener("click", openPoort);
    poort.addEventListener("keydown", function (e) {
      if (e.key === "Escape") openPoort();
      if (e.key === "Tab") { // focus binnen de kaart houden
        var f = poort.querySelectorAll("button, a[href]");
        var eerste = f[0], laatste = f[f.length - 1];
        if (e.shiftKey && document.activeElement === eerste) { e.preventDefault(); laatste.focus(); }
        else if (!e.shiftKey && document.activeElement === laatste) { e.preventDefault(); eerste.focus(); }
      }
    });
  } else if (poort) {
    poort.remove();
  }

  // --- Menu op smalle schermen ---
  var menuKnop = document.getElementById("menu-knop");
  var menu = document.getElementById("hoofdmenu");
  if (menuKnop && menu) {
    menuKnop.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menuKnop.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Illustraties bewegen alleen als ze in beeld zijn ---
  var illus = document.querySelectorAll(".illus-kader");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) { it.target.classList.toggle("speelt", it.isIntersecting); });
    }, { threshold: 0.25 });
    illus.forEach(function (el) { io.observe(el); });
  } else {
    illus.forEach(function (el) { el.classList.add("speelt"); });
  }

  // --- Klok: huidige tijd in Paramaribo (UTC-3, geen zomertijd) op de band ---
  var nu = document.getElementById("nu");
  var label = document.getElementById("nu-label");
  if (nu && label) {
    var zet = function () {
      var d = new Date();
      var min = (d.getUTCHours() * 60 + d.getUTCMinutes() - 180 + 1440) % 1440;
      var pos = min / 1440;
      nu.style.setProperty("--pos", pos.toFixed(4));
      label.textContent = "Nu " + String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0") + " in Paramaribo";
      label.style.transform = pos < 0.15 ? "translateX(-8%)" : pos > 0.85 ? "translateX(-92%)" : "translateX(-50%)";
      nu.hidden = false;
    };
    zet();
    setInterval(zet, 30000);
  }
})();
