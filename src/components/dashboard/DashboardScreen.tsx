import { clockString, dateString } from "@/lib/format";
import { CASHIER } from "@/lib/seed";
import { FloorPlan } from "./FloorPlan";
import { KitchenBoard } from "./KitchenBoard";
import { KpiRow } from "./KpiRow";
import { TopSellers } from "./TopSellers";
import { useEffect, useState } from "react";

export function DashboardScreen() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-6">
        <div>
          <h1 className="font-serif text-2xl leading-none">Service board</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {CASHIER.shift} · live mock
            {now ? ` · ${dateString(now)} ${clockString(now)}` : ""}
          </p>
        </div>
        <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Demo data</p>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <KpiRow />
        <div className="grid min-h-[360px] flex-1 grid-cols-[1.4fr_0.9fr] gap-3">
          <KitchenBoard />
          <TopSellers />
        </div>
        <FloorPlan />
      </div>
    </div>
  );
}
