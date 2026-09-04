import { money } from "@/lib/format";
import { selectKpis } from "@/lib/selectors";
import { usePos } from "@/lib/store";

export function KpiRow() {
  const sales = usePos((s) => s.sales);
  const tables = usePos((s) => s.tables);
  const tickets = usePos((s) => s.tickets);
  const kitchen = usePos((s) => s.kitchen);
  const kpis = selectKpis({ sales, tables, tickets, kitchen });

  const cards = [
    { label: "Tonight’s take", value: money(kpis.revenue), hint: "Closed checks" },
    {
      label: "On the floor",
      value: String(kpis.activeOrders),
      hint: `${kpis.preparing} in the kitchen`,
    },
    {
      label: "Table turns",
      value: kpis.turnover.toFixed(1),
      hint: `${kpis.seated} seated now`,
    },
    { label: "Avg check", value: money(kpis.avgTicket), hint: "Per closed ticket" },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-2xl border border-border bg-card px-5 py-4">
          <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            {card.label}
          </p>
          <p className="mt-2 font-serif text-3xl tabular-nums tracking-tight">{card.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{card.hint}</p>
        </article>
      ))}
    </div>
  );
}
