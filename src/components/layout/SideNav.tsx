import { LayoutGrid, RotateCcw, Sun, Moon, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePos } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const items = [
  { id: "pos" as const, label: "Register", icon: UtensilsCrossed },
  { id: "dashboard" as const, label: "Floor", icon: LayoutGrid },
];

export function SideNav() {
  const view = usePos((s) => s.view);
  const setView = usePos((s) => s.setView);
  const theme = usePos((s) => s.theme);
  const toggleTheme = usePos((s) => s.toggleTheme);
  const resetDemo = usePos((s) => s.resetDemo);

  return (
    <aside className="flex h-full w-[76px] shrink-0 flex-col items-center border-r border-border bg-sidebar py-4">
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_oklch(0.55_0.14_55)]">
        <AureliaMark />
      </div>
      <p className="mt-2 font-serif text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        Aur
      </p>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                  <span className="sr-only">{item.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 rounded-xl text-muted-foreground"
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {theme === "dark" ? "Day service" : "Night service"}
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-12 rounded-xl text-muted-foreground"
              onClick={resetDemo}
            >
              <RotateCcw className="size-5" />
              <span className="sr-only">Reset demo</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Reset demo</TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}

function AureliaMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-6" aria-hidden="true">
      <path
        d="M16 3.5c.4 4.2 2.4 7.4 6 9.6-3.1 1.2-5.2 3.6-6 7.4-.8-3.8-2.9-6.2-6-7.4 3.6-2.2 5.6-5.4 6-9.6Z"
        fill="currentColor"
      />
      <path
        d="M8 24.5c2.4-1.6 5.1-2.4 8-2.4s5.6.8 8 2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
