import { Minus, Pause, Plus, Split, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { money, ticketTotals } from "@/lib/format";
import { MENU_BY_ID, modifierLabels } from "@/lib/menu";
import { currentTicket, usePos } from "@/lib/store";
import { TIP_PRESETS } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderTicket({ className }: { className?: string }) {
  const ticket = usePos((s) => currentTicket(s));
  const tables = usePos((s) => s.tables);
  const flashLineId = usePos((s) => s.flashLineId);
  const held = usePos((s) => s.held);
  const changeQty = usePos((s) => s.changeQty);
  const removeLine = usePos((s) => s.removeLine);
  const setTip = usePos((s) => s.setTip);
  const setCustomerName = usePos((s) => s.setCustomerName);
  const setCovers = usePos((s) => s.setCovers);
  const openCheckout = usePos((s) => s.openCheckout);
  const openSplit = usePos((s) => s.openSplit);
  const openClear = usePos((s) => s.openClear);
  const holdTicket = usePos((s) => s.holdTicket);
  const recallHeld = usePos((s) => s.recallHeld);

  const table = tables.find((t) => t.id === ticket?.tableId);
  const totals = ticketTotals(ticket);
  const empty = !ticket || ticket.lines.length === 0;

  return (
    <aside
      className={cn(
        "flex h-full w-[380px] shrink-0 flex-col border-l border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Guest check
        </p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h2 className="font-serif text-2xl leading-none">
            {table ? `Table ${table.number}` : ticket?.customerName || "Walk-in"}
          </h2>
          {table && (
            <span className="text-xs text-muted-foreground">
              {table.zone} · {table.seats} top
            </span>
          )}
        </div>
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <UserRound className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={ticket?.customerName ?? ""}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Guest name"
              className="h-10 rounded-lg pl-8"
            />
          </div>
          <Input
            type="number"
            min={1}
            max={12}
            value={ticket?.covers ?? 2}
            onChange={(e) => setCovers(Number(e.target.value) || 1)}
            className="h-10 w-16 rounded-lg text-center"
            aria-label="Covers"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-3">
          {empty ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
              <p className="font-serif text-lg">Ticket is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap a dish to fire it to this check.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {ticket.lines.map((line) => {
                const item = MENU_BY_ID[line.itemId];
                const mods = item ? modifierLabels(item, line.modifiers) : [];
                return (
                  <li
                    key={line.lineId}
                    className={cn(
                      "rounded-xl border border-border bg-muted/45 p-3 transition-colors",
                      flashLineId === line.lineId && "border-primary bg-primary/10",
                    )}
                  >
                    <div className="flex gap-3">
                      {item && (
                        <img
                          src={item.image}
                          alt=""
                          className="size-12 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{item?.name}</p>
                          <p className="font-mono text-sm tabular-nums">
                            {money(line.unitPrice * line.quantity)}
                          </p>
                        </div>
                        {mods.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">{mods.join(" · ")}</p>
                        )}
                        {line.notes && (
                          <p className="mt-1 text-xs italic text-primary">{line.notes}</p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              type="button"
                              className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => changeQty(line.lineId, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-6 text-center font-mono text-sm tabular-nums">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              className="flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
                              onClick={() => changeQty(line.lineId, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.lineId)}
                            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            aria-label="Remove item"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {held.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                Held
              </p>
              <div className="space-y-1.5">
                {held.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => recallHeld(h.id)}
                    className="flex w-full items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <span>{h.customerName || h.orderType}</span>
                    <span className="text-muted-foreground">
                      {h.lines.reduce((n, l) => n + l.quantity, 0)} items
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-5 py-4">
        <div className="mb-3">
          <p className="mb-1.5 text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
            Tip
          </p>
          <div className="flex gap-1.5">
            {TIP_PRESETS.map((tip) => (
              <button
                key={tip}
                type="button"
                onClick={() => setTip(tip)}
                className={cn(
                  "h-9 flex-1 rounded-lg border text-xs font-medium",
                  ticket?.tipPercent === tip
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {tip === 0 ? "No" : `${Math.round(tip * 100)}%`}
              </button>
            ))}
          </div>
        </div>

        <dl className="space-y-1.5 text-sm">
          <Row label="Subtotal" value={money(totals.subtotal)} />
          <Row label="Tax 10%" value={money(totals.tax)} />
          {totals.service > 0 && <Row label="Service 5%" value={money(totals.service)} />}
          <Row label="Tip" value={money(totals.tip)} />
          <Separator className="my-2" />
          <div className="flex items-baseline justify-between">
            <dt className="text-muted-foreground">Due</dt>
            <dd className="font-serif text-3xl tabular-nums">{money(totals.total)}</dd>
          </div>
        </dl>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button variant="outline" className="h-11 rounded-xl" onClick={openSplit} disabled={empty}>
            <Split className="size-4" />
            Split
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" onClick={holdTicket} disabled={empty}>
            <Pause className="size-4" />
            Hold
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={openClear}
            disabled={empty}
          >
            <Trash2 className="size-4" />
            Clear
          </Button>
        </div>
        <Button
          className="mt-2 h-14 w-full rounded-xl text-base font-semibold"
          onClick={openCheckout}
          disabled={empty}
        >
          Charge {empty ? "" : money(totals.total)}
        </Button>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-mono tabular-nums text-foreground">{value}</dd>
    </div>
  );
}
