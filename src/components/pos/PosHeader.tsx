import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clockString, dateString } from "@/lib/format";
import { CASHIER } from "@/lib/seed";
import { usePos } from "@/lib/store";
import type { OrderType, TableStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDER_TYPES: { id: OrderType; label: string }[] = [
  { id: "dine-in", label: "Dine-in" },
  { id: "takeaway", label: "Takeaway" },
  { id: "delivery", label: "Delivery" },
];

const STATUS_DOT: Record<TableStatus, string> = {
  vacant: "bg-muted-foreground/40",
  occupied: "bg-primary",
  reserved: "bg-sky-400",
  billed: "bg-amber-400",
};

export function PosHeader() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  const orderType = usePos((s) => s.orderType);
  const setOrderType = usePos((s) => s.setOrderType);
  const tables = usePos((s) => s.tables);
  const activeTableId = usePos((s) => s.activeTableId);
  const selectTable = usePos((s) => s.selectTable);
  const active = tables.find((t) => t.id === activeTableId);

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 overflow-hidden border-b border-border px-4">
      <div className="min-w-[108px] shrink-0">
        <p className="font-mono text-lg leading-none tracking-tight tabular-nums">
          {now ? clockString(now) : "—"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{now ? dateString(now) : " "}</p>
      </div>

      <div className="flex shrink-0 rounded-xl bg-muted p-1">
        {ORDER_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setOrderType(type.id)}
            className={cn(
              "h-10 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors",
              orderType === type.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {type.label}
          </button>
        ))}
      </div>

      {orderType === "dine-in" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 gap-2 rounded-xl px-3">
              <span
                className={cn(
                  "size-2 rounded-full",
                  active ? STATUS_DOT[active.status] : STATUS_DOT.vacant,
                )}
              />
              <span className="font-medium">
                {active ? `Table ${active.number}` : "Select table"}
              </span>
              <span className="text-muted-foreground">
                {active ? `· ${active.zone}` : ""}
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Dining room</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tables.map((table) => (
              <DropdownMenuItem
                key={table.id}
                onClick={() => selectTable(table.id)}
                className="justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", STATUS_DOT[table.status])} />
                  Table {table.number}
                  <span className="text-muted-foreground">{table.zone}</span>
                </span>
                <span className="text-xs capitalize text-muted-foreground">{table.status}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Badge variant="secondary" className="h-8 rounded-lg px-3 text-sm capitalize">
          {orderType}
        </Badge>
      )}

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <div className="hidden text-right min-[1280px]:block">
          <p className="text-sm font-medium leading-none">{CASHIER.name}</p>
          <p className="mt-1 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            {CASHIER.shift}
          </p>
        </div>
        <Avatar className="size-10">
          <AvatarImage src={CASHIER.avatar} alt={CASHIER.name} />
          <AvatarFallback>{CASHIER.initials}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
