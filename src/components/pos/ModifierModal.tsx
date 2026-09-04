import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/lib/format";
import { unitPrice } from "@/lib/menu";
import { usePos } from "@/lib/store";
import type { SelectedModifier } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ModifierModal() {
  const item = usePos((s) => s.modifierItem);
  const close = usePos((s) => s.closeModifier);
  const add = usePos((s) => s.addConfiguredItem);
  const [notes, setNotes] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const open = Boolean(item);
  const groups = item?.modifierGroups ?? [];

  const selection: SelectedModifier[] = useMemo(
    () =>
      groups.map((group) => ({
        groupId: group.id,
        optionIds: selected[group.id] ?? (group.required ? [group.options[0].id] : []),
      })),
    [groups, selected],
  );

  const price = item ? unitPrice(item, selection) : 0;
  const missing = groups.filter(
    (g) => g.required && (selected[g.id] ?? [g.options[0].id]).length === 0,
  );

  function toggle(groupId: string, optionId: string, maxSelect: number) {
    setSelected((prev) => {
      const current = prev[groupId] ?? [];
      if (maxSelect === 1) return { ...prev, [groupId]: [optionId] };
      const has = current.includes(optionId);
      const next = has
        ? current.filter((id) => id !== optionId)
        : current.length < maxSelect
          ? [...current, optionId]
          : current;
      return { ...prev, [groupId]: next };
    });
  }

  function handleOpen(next: boolean) {
    if (!next) {
      close();
      setNotes("");
      setSelected({});
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg gap-0 p-0 sm:max-w-lg">
        {item && (
          <>
            <div className="relative h-40 overflow-hidden rounded-t-lg">
              <img src={item.image} alt="" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            </div>
            <DialogHeader className="px-6 pt-2">
              <DialogTitle className="font-serif text-2xl">{item.name}</DialogTitle>
              <DialogDescription>{item.description}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[42vh] space-y-5 overflow-y-auto px-6 py-4">
              {groups.map((group) => {
                const current = selected[group.id] ?? (group.required ? [group.options[0].id] : []);
                return (
                  <div key={group.id}>
                    <p className="mb-2 text-sm font-medium">
                      {group.name}
                      {group.required ? (
                        <span className="ml-2 text-xs text-primary">Required</span>
                      ) : (
                        <span className="ml-2 text-xs text-muted-foreground">Optional</span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const active = current.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggle(group.id, option.id, group.maxSelect)}
                            className={cn(
                              "h-11 rounded-xl border px-3 text-sm",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-foreground/30",
                            )}
                          >
                            {option.name}
                            {option.price > 0 && (
                              <span className="ml-1.5 opacity-80">+{money(option.price)}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div>
                <p className="mb-2 text-sm font-medium">Special notes</p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Allergies, plating, timing…"
                  className="min-h-20 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter className="mx-0 mb-0 border-t border-border bg-transparent px-6 py-4 sm:justify-between">
              <p className="font-serif text-2xl tabular-nums">{money(price)}</p>
              <Button
                className="h-12 rounded-xl px-6"
                disabled={missing.length > 0}
                onClick={() => {
                  add(item, selection, notes.trim());
                  setNotes("");
                  setSelected({});
                }}
              >
                Add to ticket
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
