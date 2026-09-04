import { useState } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { money, ticketTotals } from "@/lib/format";
import { selectCartCount } from "@/lib/selectors";
import { currentTicket, usePos } from "@/lib/store";
import { CategoryBar } from "./CategoryBar";
import { MenuGrid } from "./MenuGrid";
import { OrderTicket } from "./OrderTicket";
import { PosHeader } from "./PosHeader";

export function PosScreen() {
  const [open, setOpen] = useState(false);
  const count = usePos(selectCartCount);
  const ticket = usePos((s) => currentTicket(s));
  const totals = ticketTotals(ticket);

  return (
    <div className="flex min-w-0 flex-1">
      <section className="flex min-h-0 min-w-0 flex-1 flex-col">
        <PosHeader />
        <CategoryBar />
        <MenuGrid />
      </section>
      <OrderTicket className="hidden lg:flex" />

      <Button
        className="fixed right-5 bottom-5 z-30 h-14 rounded-2xl px-5 text-base shadow-lg lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Receipt className="size-5" />
        Ticket
        {count > 0 && (
          <span className="ml-1 font-mono tabular-nums">
            · {count} · {money(totals.total)}
          </span>
        )}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton
          className="w-[400px] gap-0 p-0 sm:max-w-[400px]"
        >
          <SheetTitle className="sr-only">Current ticket</SheetTitle>
          <OrderTicket className="w-full border-l-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}
