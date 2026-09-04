import { usePos } from "@/lib/store";
import type { TableStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS: Record<TableStatus, { label: string; className: string }> = {
  vacant: {
    label: "Vacant",
    className: "border-dashed border-muted-foreground/40 bg-transparent text-muted-foreground",
  },
  occupied: {
    label: "Occupied",
    className: "border-primary bg-primary/20 text-foreground",
  },
  reserved: {
    label: "Reserved",
    className: "border-sky-400/70 bg-sky-400/10 text-sky-100 dark:text-sky-100 text-sky-800",
  },
  billed: {
    label: "Billed",
    className: "border-amber-400/70 bg-amber-400/15 text-amber-950 dark:text-amber-100",
  },
};

export function FloorPlan() {
  const tables = usePos((s) => s.tables);
  const load = usePos((s) => s.loadOccupiedTable);

  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="font-serif text-xl">Room</h2>
        <div className="flex gap-3 text-[11px] text-muted-foreground">
          {Object.entries(STATUS).map(([key, value]) => (
            <span key={key} className="flex items-center gap-1.5 capitalize">
              <span className={cn("size-2 rounded-full border", value.className)} />
              {value.label}
            </span>
          ))}
        </div>
      </header>
      <div className="relative min-h-[280px] flex-1 overflow-hidden p-4">
        <div className="absolute inset-4 rounded-[28px] border border-border bg-muted/40">
          <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Window
          </p>
          <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Garden
          </p>
          <p className="absolute top-1/2 left-3 -translate-y-1/2 -rotate-90 text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Hearth
          </p>
          {tables.map((table) => {
            const status = STATUS[table.status];
            const clickable = table.status === "occupied" || table.status === "billed";
            return (
              <button
                key={table.id}
                type="button"
                disabled={!clickable}
                onClick={() => clickable && load(table.id)}
                style={{
                  left: `${table.x}%`,
                  top: `${table.y}%`,
                  width: `${table.w}%`,
                  height: `${table.h}%`,
                }}
                className={cn(
                  "absolute flex flex-col items-center justify-center rounded-2xl border text-center transition-transform",
                  status.className,
                  clickable && "hover:scale-[1.03] cursor-pointer",
                  !clickable && "cursor-default",
                )}
              >
                <span className="font-serif text-lg leading-none">{table.number}</span>
                <span className="mt-1 text-[10px] tracking-wide uppercase">{status.label}</span>
                {table.reservedName && (
                  <span className="mt-0.5 max-w-[90%] truncate text-[10px] opacity-80">
                    {table.reservedName}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
