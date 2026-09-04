import { money } from "@/lib/format";
import { selectTopSellers } from "@/lib/selectors";
import { usePos } from "@/lib/store";

export function TopSellers() {
  const sales = usePos((s) => s.sales);
  const rows = selectTopSellers({ sales }, 6);

  return (
    <section className="rounded-2xl border border-border bg-card">
      <header className="border-b border-border px-5 py-3">
        <h2 className="font-serif text-xl">Top of the pass</h2>
      </header>
      <ol className="divide-y divide-border">
        {rows.map((row, i) => (
          <li key={row.itemId} className="flex items-center gap-3 px-4 py-3">
            <span className="w-5 font-mono text-sm text-muted-foreground tabular-nums">
              {i + 1}
            </span>
            {row.image ? (
              <img src={row.image} alt="" className="size-12 rounded-lg object-cover" />
            ) : (
              <div className="size-12 rounded-lg bg-muted" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{row.name}</p>
              <p className="text-xs text-muted-foreground">{row.qty} sold</p>
            </div>
            <p className="font-mono text-sm tabular-nums">{money(row.revenue)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
