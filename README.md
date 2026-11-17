# Website SOC Suriname

Statische website (HTML en CSS, geen build-stap), gepubliceerd op <https://suriname-soc.github.io>.

Elke push en pull request draait deze checks; alleen als alles groen is wordt `main` gepubliceerd:

| Check | Tool (open source) |
|---|---|
| HTML-validatie | html-validate |
| Spelling (Nederlands) | cspell met NL-woordenboek |
| Dode links | lychee |
| Toegankelijkheid WCAG 2.2 AA, werking, geen externe verzoeken | Playwright + axe-core |
| Snelheid, toegankelijkheid, SEO | Lighthouse CI |
| Geheimen in de code | gitleaks |
| Veiligheid van de workflows | zizmor |

Lokaal: `npm ci`, dan `npm run check:html`, `check:spelling`, `check:a11y`, `check:lighthouse`.

Lettertypen: Bricolage Grotesque en Public Sans, SIL Open Font License (zie `assets/fonts`). Logo is tijdelijk.

## Pagina's bouwen

De pagina's (`index.html`, `diensten.html`, `academy.html`, `over.html`, `contact.html`, `privacy.html`) worden gegenereerd uit `bron/`. Kop, privacymelding, menu en voet staan in `bron/bouw.py`; de inhoud per pagina in `bron/pagina-*.html`, gedeelde blokken in `bron/deel-*.html` en de illustraties in `bron/*.svg`.

```sh
python3 bron/bouw.py
```

De CI faalt als de gegenereerde pagina's niet overeenkomen met `bron/`. `404.html` is met de hand geschreven. `pitch/index.html` is de presentatie; `presentatie.html` stuurt alleen door naar `pitch/` zodat oude links blijven werken.
