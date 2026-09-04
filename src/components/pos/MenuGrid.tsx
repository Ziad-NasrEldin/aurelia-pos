import { MENU } from "@/lib/menu";
import { usePos } from "@/lib/store";
import { MenuCard } from "./MenuCard";

export function MenuGrid() {
  const category = usePos((s) => s.category);
  const search = usePos((s) => s.search);
  const q = search.trim().toLowerCase();

  const items = MENU.filter((item) => {
    const inCat = category === "all" || item.category === category;
    if (!inCat) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.includes(q))
    );
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-center">
        <div>
          <p className="font-serif text-2xl">Nothing on the pass matches.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try another category, or clear the search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3 min-[1440px]:grid-cols-3">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
