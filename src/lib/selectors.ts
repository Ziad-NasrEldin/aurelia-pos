import { MENU_BY_ID } from "./menu";
import type { PosState } from "./store";
import { currentTicket } from "./store";

export function selectKpis(s: Pick<PosState, "sales" | "tables" | "tickets" | "kitchen">) {
  const revenue = s.sales.reduce((n, sale) => n + sale.total, 0);
  const dineInActive = s.tables.filter((t) => t.status === "occupied").length;
  const offFloor = Object.values(s.tickets).filter(
    (t) => !t.tableId && !t.held && t.lines.length > 0,
  ).length;
  const activeOrders = dineInActive + offFloor;
  const seated = s.tables.filter((t) => t.status !== "vacant").length;
  const turnover = s.tables.length ? s.sales.length / s.tables.length : 0;
  const avgTicket = s.sales.length ? revenue / s.sales.length : 0;
  const preparing = s.kitchen.filter((k) => k.status !== "ready").length;
  return { revenue, activeOrders, seated, turnover, avgTicket, preparing };
}

export function selectTopSellers(s: Pick<PosState, "sales">, limit = 5) {
  const map = new Map<string, { itemId: string; name: string; qty: number; revenue: number }>();
  for (const sale of s.sales) {
    for (const item of sale.items) {
      const prev = map.get(item.itemId) ?? {
        itemId: item.itemId,
        name: item.name,
        qty: 0,
        revenue: 0,
      };
      prev.qty += item.qty;
      prev.revenue += item.revenue;
      map.set(item.itemId, prev);
    }
  }
  return [...map.values()]
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit)
    .map((row) => ({
      ...row,
      image: MENU_BY_ID[row.itemId]?.image,
    }));
}

export function selectCartCount(s: Parameters<typeof currentTicket>[0]) {
  const ticket = currentTicket(s);
  return ticket?.lines.reduce((n, line) => n + line.quantity, 0) ?? 0;
}

export function lineQtyForItem(
  s: Parameters<typeof currentTicket>[0],
  itemId: string,
) {
  const ticket = currentTicket(s);
  return ticket?.lines.filter((l) => l.itemId === itemId).reduce((n, l) => n + l.quantity, 0) ?? 0;
}
