import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/menu";
import { usePos } from "@/lib/store";
import { cn } from "@/lib/utils";

export function CategoryBar() {
  const category = usePos((s) => s.category);
  const setCategory = usePos((s) => s.setCategory);
  const search = usePos((s) => s.search);
  const setSearch = usePos((s) => s.setSearch);

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-3">
      <div className="relative w-[240px] shrink-0">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search the pass…"
          className="h-11 rounded-xl pl-9"
        />
      </div>
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-0.5">
        {CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "h-11 shrink-0 rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
