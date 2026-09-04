import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePos } from "@/lib/store";
import { DashboardScreen } from "./dashboard/DashboardScreen";
import { SideNav } from "./layout/SideNav";
import { CheckoutModal } from "./pos/CheckoutModal";
import { ClearDialog } from "./pos/ClearDialog";
import { ModifierModal } from "./pos/ModifierModal";
import { PosScreen } from "./pos/PosScreen";
import { ReceiptOverlay } from "./pos/ReceiptOverlay";
import { SplitDialog } from "./pos/SplitDialog";

export function App() {
  const view = usePos((s) => s.view);
  const theme = usePos((s) => s.theme);
  const setTheme = usePos((s) => s.setTheme);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if ((stored === "light" || stored === "dark") && stored !== usePos.getState().theme) {
      setTheme(stored);
    }
  }, [setTheme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        <SideNav />
        {view === "pos" ? <PosScreen /> : <DashboardScreen />}
        <ModifierModal />
        <CheckoutModal />
        <SplitDialog />
        <ClearDialog />
        <ReceiptOverlay />
      </div>
    </TooltipProvider>
  );
}
