import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";
import { RESTAURANT } from "@/lib/seed";
import { usePos } from "@/lib/store";

export function ReceiptOverlay() {
  const receipt = usePos((s) => s.receipt);
  const dismiss = usePos((s) => s.dismissReceipt);
  if (!receipt) return null;

  const methodLabel =
    receipt.sale.method === "apple-pay"
      ? "Apple Pay"
      : receipt.sale.method === "card"
        ? "Card · Visa ****1847"
        : "Cash";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm">
      <div className="w-[360px]">
        <div className="receipt-print overflow-hidden rounded-sm bg-[#f4efe4] text-[#1c1710] shadow-2xl">
          <div className="px-6 pt-6 pb-4 text-center">
            <p className="font-serif text-3xl">{RESTAURANT.name}</p>
            <p className="mt-1 text-[11px] tracking-[0.2em] uppercase">{RESTAURANT.tagline}</p>
            <p className="mt-2 text-xs">{RESTAURANT.address}</p>
          </div>
          <div className="mx-6 border-t border-dashed border-[#1c1710]/30" />
          <div className="px-6 py-3 text-xs">
            <p>
              {receipt.tableLabel} · {receipt.customerName}
            </p>
            <p>
              {new Date(receipt.sale.at).toLocaleString()} · {receipt.cashier}
            </p>
          </div>
          <div className="mx-6 border-t border-dashed border-[#1c1710]/30" />
          <ul className="space-y-2 px-6 py-4 text-sm">
            {receipt.lines.map((line, i) => (
              <li key={i}>
                <div className="flex justify-between gap-3">
                  <span>
                    {line.qty} × {line.name}
                  </span>
                  <span className="font-mono tabular-nums">{money(line.price)}</span>
                </div>
                {line.mods.length > 0 && (
                  <p className="text-xs text-[#1c1710]/65">{line.mods.join(" · ")}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="mx-6 border-t border-dashed border-[#1c1710]/30" />
          <dl className="space-y-1 px-6 py-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-mono">{money(receipt.sale.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Tax</dt>
              <dd className="font-mono">{money(receipt.sale.tax)}</dd>
            </div>
            {receipt.sale.service > 0 && (
              <div className="flex justify-between">
                <dt>Service</dt>
                <dd className="font-mono">{money(receipt.sale.service)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Tip</dt>
              <dd className="font-mono">{money(receipt.sale.tip)}</dd>
            </div>
            <div className="flex justify-between pt-2 font-serif text-2xl">
              <dt>Total</dt>
              <dd className="font-mono text-xl">{money(receipt.sale.total)}</dd>
            </div>
          </dl>
          <p className="px-6 pb-2 text-xs tracking-[0.16em] uppercase">{methodLabel}</p>
          <p className="px-6 pb-6 text-center text-xs">Demo receipt · not a fiscal document</p>
        </div>
        <Button className="mt-4 h-12 w-full rounded-xl" onClick={dismiss}>
          New ticket
        </Button>
      </div>
    </div>
  );
}
