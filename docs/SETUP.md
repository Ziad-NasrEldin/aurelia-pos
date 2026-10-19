# Setup

Aurelia is a frontend demo. There is no backend. Menu, tickets, kitchen, and sales are in-memory mock data. Photography and the cashier portrait are generated. Nothing is charged.

**Live demo:** [https://liminal-thistle-yp2j.here.now/](https://liminal-thistle-yp2j.here.now/)

Built for a 10–12" landscape tablet (iPad-class). Dark mode is dinner service; the sun icon on the rail switches to linen day service.

## Stack

- [Astro](https://astro.build) 7 with React islands
- [shadcn/ui](https://ui.shadcn.com) (Radix Nova)
- Tailwind CSS 4
- Zustand
- Lucide icons

Node 22.12+.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Astro prints (default `http://localhost:4321`).

```bash
npm run build
npm run preview
```

## Project layout

```
src/
  pages/index.astro          # shell, theme boot, mounts the app
  components/
    App.tsx                  # register / floor switch
    layout/SideNav.tsx
    pos/                     # register: menu, ticket, modifiers, checkout
    dashboard/               # KPIs, KDS, top sellers, floor plan
    ui/                      # shadcn primitives
  lib/
    menu.ts                  # 20 dishes, modifiers, prices
    seed.ts                  # tables, open tickets, kitchen, sales
    store.ts                 # live POS state
    types.ts
  styles/global.css
public/images/dishes/        # plated photography
```

## License

Demo source. Use and adapt. Generated images and copy are synthetic — do not treat them as a real restaurant, real staff, or real sales.
