import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { money } from "@/lib/format";
import { lineQtyForItem } from "@/lib/selectors";
import { usePos } from "@/lib/store";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const TAG_CLASS: Record<string, string> = {
  popular: "bg-primary/15 text-primary border-primary/20",
  spicy: "bg-red-500/15 text-red-400 border-red-500/20",
  vegetarian: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  signature: "bg-amber-500/15 text-amber-300 border-amber-500/20",
};

export function MenuCard({ item }: { item: MenuItem }) {
  const addItem = usePos((s) => s.addItem);
  const qty = usePos((s) => lineQtyForItem(s, item.id));

  return (
    <button
      type="button"
      onClick={() => addItem(item)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[0_10px_30px_-24px_oklch(0.2_0.02_55)] transition-[transform,border-color] duration-150 active:scale-[0.98] hover:border-primary/40"
    >
      <div className="relative aspect-[4/3] min-h-[148px] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/55 to-transparent" />
        <p className="absolute right-3 bottom-3 font-mono text-lg font-medium text-white tabular-nums">
          {money(item.price)}
        </p>
        {qty > 0 && (
          <span className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {qty}
          </span>
        )}
        <span className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <Plus className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="font-serif text-[17px] leading-snug">{item.name}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>
        {item.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {item.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className={cn("rounded-md px-1.5 text-[10px] capitalize", TAG_CLASS[tag])}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}
