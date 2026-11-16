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
