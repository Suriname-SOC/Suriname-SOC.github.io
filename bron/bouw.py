"""Bouwt de HTML-pagina's van de site uit bron/.

Kop, poort (privacymelding), menu en voet staan hier één keer; de inhoud per
pagina staat in bron/pagina-*.html. Draai na een wijziging:

    python3 bron/bouw.py

De gegenereerde .html-bestanden in de hoofdmap worden meegecommit; de CI
controleert dat ze actueel zijn.
"""
from pathlib import Path

BRON = Path(__file__).parent
ROOT = BRON.parent
SITE = "https://suriname-soc.github.io/"

PAGINAS = [
    # bestand, menu-sleutel, titel, beschrijving
    ("index.html", "home", "SOC Suriname: SOC en Cyber Academy in Paramaribo",
     "Lokaal Security Operations Center en Cyber Academy in Paramaribo. Monitoring, incidentrespons op locatie, OSINT en opleiding tot SOC-analist, gebouwd op open source."),
    ("diensten.html", "diensten", "Diensten en pakketten: SOC Suriname",
     "SOC-pakketten voor Surinaamse organisaties: bewaking op werkdagen, tot middernacht of de klok rond, plus OSINT-scan, incidentrespons en advies."),
    ("academy.html", "academy", "Cyber Academy: SOC Suriname",
     "In twaalf weken van IT-er naar SOC-analist, met stage in een echt SOC. Plus trainingen voor werkgevers en bewustwording voor alle medewerkers."),
    ("over.html", "over", "Over ons: SOC Suriname",
     "Wie SOC Suriname opzet, waarom in Suriname zelf, en waarom we bouwen op open source."),
    ("contact.html", "contact", "Contact: SOC Suriname",
     "Word pilotklant, laat medewerkers opleiden of word partner van SOC Suriname."),
    ("privacy.html", "privacy", "Privacyverklaring: SOC Suriname",
     "Deze site plaatst geen cookies, gebruikt geen trackers en laadt niets van andere servers."),
]

MENU = [
    ("diensten", "diensten.html", "Diensten en pakketten"),
    ("academy", "academy.html", "Academy"),
    ("over", "over.html", "Over ons"),
    ("presentatie", "pitch/", "Presentatie"),
]

STER = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#f1be2b" '
        'd="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.5l7.1-.6z"/></svg>')

HOOFD = """<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{titel}</title>
<meta name="description" content="{beschrijving}">
<meta property="og:title" content="{titel}">
<meta property="og:description" content="{beschrijving}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<link rel="canonical" href="{url}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/style.css">
<script>document.documentElement.classList.add("js");try{{if(!sessionStorage.getItem("poort-open"))document.documentElement.classList.add("poort-dicht")}}catch(e){{}}</script>
</head>
<body>
<a class="skip" href="#inhoud">Naar de inhoud</a>
"""

POORT = """
<div class="poort" id="poort" role="dialog" aria-modal="true" aria-labelledby="poort-titel" aria-describedby="poort-tekst">
  <div class="luik-paneel links" aria-hidden="true"></div>
  <div class="luik-paneel rechts" aria-hidden="true"></div>
  <div class="poort-licht" aria-hidden="true"></div>
  <div class="poort-kaart">
    <div class="poort-zegel" aria-hidden="true">{ster}</div>
    <p class="poort-titel" id="poort-titel">Eerst even over uw privacy</p>
    <div id="poort-tekst">
      <p>Een beveiligingsbedrijf hoort zelf het goede voorbeeld te geven. Daarom:</p>
      <ul>
        <li>geen cookies en geen trackers;</li>
        <li>geen advertenties of analysediensten;</li>
        <li>niets geladen van andere servers.</li>
      </ul>
    </div>
    <button type="button" class="knop" id="poort-open">Open de luiken</button>
    <p class="klein"><a href="privacy.html">Lees de privacyverklaring</a></p>
  </div>
</div>
"""

KOP = """
<header class="top">
  <div class="wrap top-in">
    <a class="merk" href="./">
      <img src="assets/logo.svg" alt="" width="34" height="38">
      <span>SOC Suriname</span>
    </a>
    <button type="button" class="menu-knop" id="menu-knop" aria-expanded="false" aria-controls="hoofdmenu">Menu</button>
    <nav id="hoofdmenu" aria-label="Hoofdmenu">
      <ul>
{items}
        <li><a class="nav-cta" href="contact.html"{cta_huidig}>Contact</a></li>
      </ul>
    </nav>
  </div>
</header>
"""

VOET = """
<footer class="voet">
  <div class="wrap">
    <div class="voet-raster">
      <div>
        <a class="merk" href="./"><img src="assets/logo.svg" alt="" width="26" height="29"><span>SOC Suriname</span></a>
        <p>Security Operations Center en Cyber Academy in Paramaribo. Werknaam, het bedrijf is in oprichting.</p>
      </div>
      <div>
        <h2>Aanbod</h2>
        <ul>
          <li><a href="diensten.html#pakketten">SOC-pakketten</a></li>
          <li><a href="diensten.html#losse-diensten">Losse diensten</a></li>
          <li><a href="academy.html">Cyber Academy</a></li>
          <li><a href="academy.html#werkgevers">Voor werkgevers</a></li>
        </ul>
      </div>
      <div>
        <h2>Organisatie</h2>
        <ul>
          <li><a href="over.html">Over ons</a></li>
          <li><a href="pitch/">Presentatie</a></li>
          <li><a href="contact.html">Contact</a></li>
          <li><a href="privacy.html">Privacy</a></li>
        </ul>
      </div>
    </div>
    <div class="klein">
      <p>Geen cookies, geen trackers. Lettertypen Bricolage Grotesque en Public Sans onder de SIL Open Font License.</p>
      <p><a href="https://github.com/Suriname-SOC/Suriname-SOC.github.io">Broncode op GitHub</a></p>
    </div>
  </div>
</footer>

<script src="assets/site.js" defer></script>
</body>
</html>
"""


def bouw() -> list[str]:
    stukken = {p.stem: p.read_text(encoding="utf-8").strip() for p in BRON.glob("*.svg")}
    stukken |= {p.stem.removeprefix("deel-"): p.read_text(encoding="utf-8").strip() for p in BRON.glob("deel-*.html")}
    # Tweede exemplaar van de analist op dezelfde pagina: unieke id's.
    a = stukken["analist"]
    for oud in ("clip-log", "clip-radar", "illus-analist-t"):
        a = a.replace(oud, oud + "-2")
    stukken["analist-klein"] = a
    geschreven = []
    for bestand, sleutel, titel, beschrijving in PAGINAS:
        inhoud = (BRON / f"pagina-{Path(bestand).stem}.html").read_text(encoding="utf-8")
        for naam, html in stukken.items():
            inhoud = inhoud.replace("{{" + naam + "}}", html)
        items = "\n".join(
            f'        <li><a href="{href}"{" aria-current=\"page\"" if k == sleutel else ""}>{tekst}</a></li>'
            for k, href, tekst in MENU
        )
        url = SITE if bestand == "index.html" else SITE + bestand
        html = (
            HOOFD.format(titel=titel, beschrijving=beschrijving, url=url)
            + POORT.format(ster=STER)
            + KOP.format(items=items, cta_huidig=' aria-current="page"' if sleutel == "contact" else "")
            + '\n<main id="inhoud">\n' + inhoud.strip() + "\n</main>\n"
            + VOET
        )
        (ROOT / bestand).write_text(html, encoding="utf-8")
        geschreven.append(bestand)
    return geschreven


if __name__ == "__main__":
    print("\n".join(bouw()))
