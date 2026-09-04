# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the brief: Astro, shadcn/ui, generated food imagery, client-side React islands for the register. [inferred from explicit brief]

## Users

Primary: floor cashiers and servers on a 10–12" tablet register during live service. Secondary: a floor manager reviewing the same device between rushes. [inferred from explicit brief]

## Product Purpose

A production-quality frontend demo of a restaurant point-of-sale and floor-management system. Success is a cashier completing a realistic ticket — browse, customize, tender, receipt — and a manager reading live floor, kitchen, and sales state without broken layouts or stale numbers.

## Positioning

The register is the tasting-menu book and the kitchen pass at once: high-end plated photography is the catalog, the ticket is a live copper dupe, and the floor plan is an operational map — not a generic admin dashboard with food thumbnails glued on.

## Operating Context

Night service in a contemporary California fire grill. Ambient dining-room light is low and warm; the tablet must stay high-contrast and touch-first. Order types are dine-in, takeaway, and delivery. Occupied tables carry live tickets. Completing checkout frees the table and posts the sale into tonight's numbers. [inferred restaurant identity: Aurelia]

## Capabilities and Constraints

- Two views behind a persistent side rail: Terminal (POS) and Manager dashboard.
- Menu of 15–20 gourmet dishes with search, category pills, modifiers, cart math (10% tax, service, tip), split / hold / clear, and simulated tender (cash, card, Apple Pay) with receipt preview.
- Dashboard: KPI cards, KDS columns (pending / preparing / ready), top sellers, interactive floor plan. Occupied-table click loads that ticket into the POS.
- Dark/light theme. No backend. Mock data only; all figures are synthetic demo data.
- Touch targets sized for tablet thumbs. Optimized for landscape iPad, not a marketing site.

## Brand Commitments

- Name: **Aurelia** (authored for this demo).
- Voice: precise, culinary, operational — dish names and ticket language, not startup marketing.
- Visual constraint from the brief: modern high-contrast dark/light UI, shadcn/ui, appetizing generated food photography.

## Evidence on Hand

No real restaurant, no real sales, no real staff photos. All menu copy, prices, covers, KPIs, and portraits are synthetic demo material and must remain obviously a demo in the product chrome.

## Product Principles

1. The ticket is the source of truth — every view reads the same live state.
2. Photography sells the dish; chrome stays quiet so the plate can be loud.
3. Touch first: large targets, instant add, no hover-only actions.
4. Demo completeness over backend theater — every button does something visible.
5. Night service is the default scene; light mode is the morning-office exception.

## Accessibility & Inclusion

WCAG 2.2 AA contrast on chrome and text. 44px minimum tap targets. Keyboard operable dialogs. Reduced-motion respected on non-essential animation.
