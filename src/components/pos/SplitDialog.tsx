import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { money, ticketTotals } from "@/lib/format";
import { currentTicket, usePos } from "@/lib/store";

export function SplitDialog() {
  const open = usePos((s) => s.splitOpen);
  const close = usePos((s) => s.closeSplit);
  const ticket = usePos((s) => currentTicket(s));
  const totals = ticketTotals(ticket);
  const [ways, setWays] = useState(ticket?.covers || 2);
  const each = ways > 0 ? totals.total / ways : totals.total;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
        else setWays(ticket?.covers || 2);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Split the check</DialogTitle>
          <DialogDescription>Even split across covers. Itemized split is a later pass.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
          <span className="text-sm text-muted-foreground">Ways</span>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-10"
              onClick={() => setWays((n) => Math.max(2, n - 1))}
            >
              −
            </Button>
            <span className="w-8 text-center font-mono text-xl tabular-nums">{ways}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-10"
              onClick={() => setWays((n) => Math.min(12, n + 1))}
            >
              +
            </Button>
          </div>
        </div>
        <p className="font-serif text-4xl tabular-nums">{money(each)}</p>
        <p className="text-sm text-muted-foreground">each · {money(totals.total)} total</p>
        <DialogFooter>
          <Button className="h-11 rounded-xl" onClick={close}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
