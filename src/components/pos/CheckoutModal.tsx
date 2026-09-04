import { Banknote, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { money, ticketTotals } from "@/lib/format";
import { currentTicket, usePos } from "@/lib/store";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const METHODS: { id: PaymentMethod; label: string; hint: string; icon: typeof Banknote }[] = [
  { id: "cash", label: "Cash", hint: "Drawer · counted tender", icon: Banknote },
  { id: "card", label: "Credit card", hint: "Tap · chip · swipe", icon: CreditCard },
  { id: "apple-pay", label: "Apple Pay", hint: "Contactless wallet", icon: CreditCard },
];

export function CheckoutModal() {
  const open = usePos((s) => s.checkoutOpen);
  const close = usePos((s) => s.closeCheckout);
  const complete = usePos((s) => s.completePayment);
  const ticket = usePos((s) => currentTicket(s));
  const totals = ticketTotals(ticket);
  const [busy, setBusy] = useState<PaymentMethod | null>(null);

  function pay(method: PaymentMethod) {
    setBusy(method);
    window.setTimeout(() => {
      complete(method);
      setBusy(null);
    }, 700);
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Take payment</DialogTitle>
          <DialogDescription>Simulated tender — nothing is charged.</DialogDescription>
        </DialogHeader>
        <p className="font-serif text-5xl tabular-nums tracking-tight">{money(totals.total)}</p>
        <p className="text-sm text-muted-foreground">
          {totals.itemCount} item{totals.itemCount === 1 ? "" : "s"} · includes tax
          {totals.service > 0 ? " & service" : ""}
        </p>
        <div className="mt-2 grid gap-2">
          {METHODS.map((method) => {
            const Icon = method.icon;
            const loading = busy === method.id;
            return (
              <button
                key={method.id}
                type="button"
                disabled={Boolean(busy)}
                onClick={() => pay(method.id)}
                className={cn(
                  "flex h-16 items-center gap-4 rounded-xl border border-border px-4 text-left transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-60",
                )}
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  {loading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </span>
                <span>
                  <span className="block font-medium">{method.label}</span>
                  <span className="text-xs text-muted-foreground">{method.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        <Button variant="ghost" onClick={close} disabled={Boolean(busy)}>
          Back to ticket
        </Button>
      </DialogContent>
    </Dialog>
  );
}
