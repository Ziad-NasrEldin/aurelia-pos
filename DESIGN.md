# Design

Aurelia is a night-service register. The plate is the catalog; the chrome stays quiet.

## Surfaces

- **Register** (`/`): left rail, plated menu, live guest check.
- **Floor** (same app, view switch): tonight’s numbers, kitchen columns, room map.

## Color

Restrained. Neutrals plus one ember copper accent.

| Token | Dark (default) | Light |
|---|---|---|
| Background | Warm charcoal `oklch(0.145 0.014 55)` | Linen `oklch(0.965 0.012 80)` |
| Primary | Ember copper `oklch(0.74 0.13 55)` | Deeper copper `oklch(0.52 0.13 50)` |
| Card | Lifted charcoal | Near-white |

Dark is night floor; light is morning office. Food photography carries hue.

## Type

- Geist Variable for chrome, numbers, tickets.
- Source Serif 4 for dish names and display totals.
- Tabular nums on money and the clock.

## Layout

Tablet landscape, 10–12". Persistent 76px icon rail. Guest check 380px from `lg`. Below `lg`, the check is a right sheet behind a Ticket FAB. Menu is a 2-up photo grid (3-up from 1440px). Tap targets ≥ 40–44px.

## Motion

150–250ms state changes. Card press scale. Ticket line flash on add. Receipt unfurls (`clip-path`) unless `prefers-reduced-motion`.

## Imagery

Generated plated photography in `public/images/dishes/`, provenance in `public/images/PROVENANCE.json`. Staff portrait is fictional.
