import { elapsed } from "@/lib/format";
import { usePos } from "@/lib/store";
import type { KitchenStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLUMNS: { id: KitchenStatus; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "preparing", label: "Preparing" },
  { id: "ready", label: "Ready" },
];

export function KitchenBoard() {
  const kitchen = usePos((s) => s.kitchen);
  const advance = usePos((s) => s.advanceKitchen);
  const bump = usePos((s) => s.bumpKitchen);

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="font-serif text-xl">Kitchen display</h2>
        <p className="text-xs text-muted-foreground">Tap a ticket to advance</p>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-3 gap-3 p-4">
        {COLUMNS.map((col) => {
          const tickets = kitchen.filter((k) => k.status === col.id);
          return (
            <div key={col.id} className="flex min-h-0 flex-col">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                  {col.label}
                </p>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {tickets.length}
                </span>
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
                {tickets.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
                    Quiet
                  </div>
                )}
                {tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() =>
                      ticket.status === "ready" ? bump(ticket.id) : advance(ticket.id)
                    }
                    className={cn(
                      "rounded-xl border border-border bg-background p-3 text-left transition-colors hover:border-primary/50",
                      ticket.status === "ready" && "border-emerald-500/40 bg-emerald-500/8",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{ticket.tableLabel}</p>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {elapsed(ticket.firedAt)}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {ticket.items.map((item, i) => (
                        <li key={i}>
                          <span className="font-mono text-foreground">{item.qty}×</span> {item.name}
                          {item.notes && (
                            <span className="block italic text-primary/80">{item.notes}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
