import { create } from "zustand";
import { MENU_BY_ID, modifierLabels, unitPrice } from "./menu";
import { CASHIER, INITIAL_KITCHEN, INITIAL_SALES, INITIAL_TABLES, INITIAL_TICKETS, emptyTicket } from "./seed";
import { ticketTotals } from "./format";
import type {
  CartLine,
  CategoryId,
  DiningTable,
  KitchenTicket,
  MenuItem,
  OrderType,
  PaymentMethod,
  Receipt,
  Sale,
  SelectedModifier,
  Ticket,
  ViewId,
} from "./types";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function slotKey(orderType: OrderType, tableId: string | null) {
  if (orderType === "dine-in") return tableId ?? "unseated";
  return orderType;
}

export interface PosState {
  view: ViewId;
  theme: "dark" | "light";
  category: CategoryId;
  search: string;
  orderType: OrderType;
  activeTableId: string | null;
  tickets: Record<string, Ticket>;
  tables: DiningTable[];
  kitchen: KitchenTicket[];
  sales: Sale[];
  held: Ticket[];
  modifierItem: MenuItem | null;
  checkoutOpen: boolean;
  splitOpen: boolean;
  clearOpen: boolean;
  receipt: Receipt | null;
  flashLineId: string | null;

  setView: (view: ViewId) => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setCategory: (category: CategoryId) => void;
  setSearch: (search: string) => void;
  setOrderType: (orderType: OrderType) => void;
  selectTable: (tableId: string) => void;
  setCovers: (covers: number) => void;
  setTip: (tipPercent: number) => void;
  setCustomerName: (name: string) => void;

  addItem: (item: MenuItem) => void;
  addConfiguredItem: (item: MenuItem, modifiers: SelectedModifier[], notes: string) => void;
  changeQty: (lineId: string, delta: number) => void;
  removeLine: (lineId: string) => void;
  openModifier: (item: MenuItem) => void;
  closeModifier: () => void;

  openCheckout: () => void;
  closeCheckout: () => void;
  completePayment: (method: PaymentMethod) => void;
  dismissReceipt: () => void;

  openSplit: () => void;
  closeSplit: () => void;
  openClear: () => void;
  closeClear: () => void;
  clearTicket: () => void;
  holdTicket: () => void;
  recallHeld: (ticketId: string) => void;

  advanceKitchen: (id: string) => void;
  bumpKitchen: (id: string) => void;
  loadOccupiedTable: (tableId: string) => void;
  resetDemo: () => void;
}

function ensureTicket(
  tickets: Record<string, Ticket>,
  tables: DiningTable[],
  orderType: OrderType,
  tableId: string | null,
): { tickets: Record<string, Ticket>; tables: DiningTable[]; ticket: Ticket } {
  if (orderType === "dine-in" && tableId) {
    const table = tables.find((t) => t.id === tableId);
    if (table?.ticketId && tickets[table.ticketId]) {
      return { tickets, tables, ticket: tickets[table.ticketId] };
    }
    const ticket = emptyTicket({
      id: uid("tk"),
      tableId,
      orderType: "dine-in",
      customerName: `Table ${table?.number ?? ""}`.trim(),
      covers: table?.seats ?? 2,
    });
    const nextTables = tables.map((t) =>
      t.id === tableId
        ? {
            ...t,
            status: t.status === "reserved" || t.status === "vacant" ? "occupied" : t.status,
            ticketId: ticket.id,
          }
        : t,
    );
    return {
      tickets: { ...tickets, [ticket.id]: ticket },
      tables: nextTables,
      ticket,
    };
  }

  const existing = Object.values(tickets).find(
    (t) => t.orderType === orderType && !t.tableId && !t.held,
  );
  if (existing) return { tickets, tables, ticket: existing };

  const ticket = emptyTicket({
    id: uid("tk"),
    tableId: null,
    orderType,
    customerName: orderType === "delivery" ? "Delivery" : "Walk-in",
    covers: 1,
  });
  return { tickets: { ...tickets, [ticket.id]: ticket }, tables, ticket };
}

function fireKitchen(
  ticket: Ticket,
  kitchen: KitchenTicket[],
  tables: DiningTable[],
): KitchenTicket[] {
  const itemRows = ticket.lines.map((line) => {
    const item = MENU_BY_ID[line.itemId];
    const mods = item ? modifierLabels(item, line.modifiers) : [];
    const noteParts = [line.notes, ...mods].filter(Boolean);
    return {
      name: item?.name ?? line.itemId,
      qty: line.quantity,
      notes: noteParts.join(" · ") || undefined,
    };
  });
  const existing = kitchen.find((k) => k.ticketId === ticket.id && k.status !== "ready");
  const table = ticket.tableId ? tables.find((t) => t.id === ticket.tableId) : null;
  const tableLabel = ticket.tableId
    ? `T${table?.number ?? ticket.tableId} · ${table?.zone ?? "Floor"}`
    : ticket.orderType === "delivery"
      ? "Delivery"
      : "Takeaway";

  if (existing) {
    return kitchen.map((k) =>
      k.id === existing.id ? { ...k, items: itemRows, tableLabel } : k,
    );
  }
  return [
    {
      id: uid("kds"),
      ticketId: ticket.id,
      tableLabel,
      items: itemRows,
      status: "pending",
      firedAt: Date.now(),
    },
    ...kitchen,
  ];
}

export const usePos = create<PosState>()((set, get) => ({
      view: "pos",
      theme: "dark",
      category: "all",
      search: "",
      orderType: "dine-in",
      activeTableId: "t3",
      tickets: INITIAL_TICKETS,
      tables: INITIAL_TABLES,
      kitchen: INITIAL_KITCHEN,
      sales: INITIAL_SALES,
      held: [],
      modifierItem: null,
      checkoutOpen: false,
      splitOpen: false,
      clearOpen: false,
      receipt: null,
      flashLineId: null,

      setView: (view) => set({ view }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setCategory: (category) => set({ category }),
      setSearch: (search) => set({ search }),
      setOrderType: (orderType) => {
        if (orderType === "dine-in") {
          const occupied = get().tables.find((t) => t.status === "occupied") ?? get().tables[0];
          set({ orderType, activeTableId: occupied?.id ?? null });
        } else {
          set({ orderType, activeTableId: null });
        }
      },
      selectTable: (tableId) => set({ orderType: "dine-in", activeTableId: tableId, view: "pos" }),
      setCovers: (covers) => {
        const current = currentTicket(get());
        if (!current) return;
        set((s) => ({
          tickets: { ...s.tickets, [current.id]: { ...current, covers } },
        }));
      },
      setTip: (tipPercent) => {
        const current = currentTicket(get());
        if (!current) return;
        set((s) => ({
          tickets: { ...s.tickets, [current.id]: { ...current, tipPercent } },
        }));
      },
      setCustomerName: (name) => {
        const current = currentTicket(get());
        if (!current) return;
        set((s) => ({
          tickets: { ...s.tickets, [current.id]: { ...current, customerName: name } },
        }));
      },

      addItem: (item) => {
        if (item.customizable) {
          set({ modifierItem: item });
          return;
        }
        get().addConfiguredItem(item, [], "");
      },

      addConfiguredItem: (item, modifiers, notes) => {
        const state = get();
        const ensured = ensureTicket(
          state.tickets,
          state.tables,
          state.orderType,
          state.orderType === "dine-in" ? state.activeTableId : null,
        );
        const price = unitPrice(item, modifiers);
        const signature = JSON.stringify({ itemId: item.id, modifiers, notes });
        const existing = ensured.ticket.lines.find(
          (line) => JSON.stringify({ itemId: line.itemId, modifiers: line.modifiers, notes: line.notes }) === signature,
        );
        let nextLines: CartLine[];
        let flashLineId: string;
        if (existing) {
          flashLineId = existing.lineId;
          nextLines = ensured.ticket.lines.map((line) =>
            line.lineId === existing.lineId ? { ...line, quantity: line.quantity + 1 } : line,
          );
        } else {
          flashLineId = uid("ln");
          nextLines = [
            ...ensured.ticket.lines,
            {
              lineId: flashLineId,
              itemId: item.id,
              quantity: 1,
              modifiers,
              notes,
              unitPrice: price,
            },
          ];
        }
        const ticket = { ...ensured.ticket, lines: nextLines };
        set({
          tickets: { ...ensured.tickets, [ticket.id]: ticket },
          tables: ensured.tables,
          kitchen: fireKitchen(ticket, state.kitchen, ensured.tables),
          modifierItem: null,
          flashLineId,
          activeTableId: state.orderType === "dine-in" ? ticket.tableId : state.activeTableId,
        });
        window.setTimeout(() => {
          if (get().flashLineId === flashLineId) set({ flashLineId: null });
        }, 600);
      },

      changeQty: (lineId, delta) => {
        const current = currentTicket(get());
        if (!current) return;
        const nextLines = current.lines
          .map((line) =>
            line.lineId === lineId ? { ...line, quantity: line.quantity + delta } : line,
          )
          .filter((line) => line.quantity > 0);
        const ticket = { ...current, lines: nextLines };
        set((s) => ({
          tickets: { ...s.tickets, [ticket.id]: ticket },
          kitchen: fireKitchen(ticket, s.kitchen, s.tables),
        }));
      },

      removeLine: (lineId) => {
        const current = currentTicket(get());
        if (!current) return;
        const ticket = { ...current, lines: current.lines.filter((l) => l.lineId !== lineId) };
        set((s) => ({
          tickets: { ...s.tickets, [ticket.id]: ticket },
          kitchen: fireKitchen(ticket, s.kitchen, s.tables),
        }));
      },

      openModifier: (item) => set({ modifierItem: item }),
      closeModifier: () => set({ modifierItem: null }),

      openCheckout: () => {
        const current = currentTicket(get());
        if (!current || current.lines.length === 0) return;
        set({ checkoutOpen: true });
      },
      closeCheckout: () => set({ checkoutOpen: false }),

      completePayment: (method) => {
        const state = get();
        const current = currentTicket(state);
        if (!current || current.lines.length === 0) return;
        const totals = ticketTotals(current);
        const table = current.tableId
          ? state.tables.find((t) => t.id === current.tableId)
          : null;
        const tableLabel = table
          ? `T${table.number}`
          : current.orderType === "delivery"
            ? "Delivery"
            : "Takeaway";
        const sale: Sale = {
          id: uid("sale"),
          ticketId: current.id,
          tableLabel,
          items: current.lines.map((line) => {
            const item = MENU_BY_ID[line.itemId];
            return {
              itemId: line.itemId,
              name: item?.name ?? line.itemId,
              qty: line.quantity,
              revenue: line.unitPrice * line.quantity,
            };
          }),
          subtotal: totals.subtotal,
          tax: totals.tax,
          service: totals.service,
          tip: totals.tip,
          total: totals.total,
          method,
          at: Date.now(),
        };
        const receipt: Receipt = {
          sale,
          customerName: current.customerName || tableLabel,
          tableLabel,
          cashier: CASHIER.name,
          lines: current.lines.map((line) => {
            const item = MENU_BY_ID[line.itemId];
            return {
              name: item?.name ?? line.itemId,
              qty: line.quantity,
              price: line.unitPrice * line.quantity,
              mods: item ? modifierLabels(item, line.modifiers) : [],
            };
          }),
        };
        const { [current.id]: _removed, ...rest } = state.tickets;
        const tables = state.tables.map((t) =>
          t.id === current.tableId ? { ...t, status: "vacant" as const, ticketId: null } : t,
        );
        const nextOccupied = tables.find((t) => t.status === "occupied");
        set({
          sales: [sale, ...state.sales],
          tickets: rest,
          tables,
          kitchen: state.kitchen.filter((k) => k.ticketId !== current.id),
          checkoutOpen: false,
          receipt,
          activeTableId: state.orderType === "dine-in" ? nextOccupied?.id ?? "t1" : null,
        });
      },

      dismissReceipt: () => set({ receipt: null }),

      openSplit: () => set({ splitOpen: true }),
      closeSplit: () => set({ splitOpen: false }),
      openClear: () => set({ clearOpen: true }),
      closeClear: () => set({ clearOpen: false }),

      clearTicket: () => {
        const current = currentTicket(get());
        if (!current) return;
        set((s) => ({
          tickets: { ...s.tickets, [current.id]: { ...current, lines: [] } },
          kitchen: s.kitchen.filter((k) => k.ticketId !== current.id),
          clearOpen: false,
        }));
      },

      holdTicket: () => {
        const current = currentTicket(get());
        if (!current || current.lines.length === 0) return;
        const held = { ...current, held: true, id: uid("hold") };
        const { [current.id]: _removed, ...rest } = get().tickets;
        const tables = get().tables.map((t) =>
          t.id === current.tableId ? { ...t, status: "vacant" as const, ticketId: null } : t,
        );
        set((s) => ({
          held: [held, ...s.held],
          tickets: rest,
          tables,
          kitchen: s.kitchen.filter((k) => k.ticketId !== current.id),
        }));
      },

      recallHeld: (ticketId) => {
        const held = get().held.find((t) => t.id === ticketId);
        if (!held) return;
        const restored = { ...held, held: false, id: uid("tk") };
        const tables = get().tables.map((t) =>
          t.id === restored.tableId
            ? { ...t, status: "occupied" as const, ticketId: restored.id }
            : t,
        );
        set((s) => ({
          held: s.held.filter((t) => t.id !== ticketId),
          tickets: { ...s.tickets, [restored.id]: restored },
          tables,
          orderType: restored.orderType,
          activeTableId: restored.tableId,
          view: "pos",
        }));
      },

      advanceKitchen: (id) => {
        set((s) => ({
          kitchen: s.kitchen.map((k) => {
            if (k.id !== id) return k;
            const next = k.status === "pending" ? "preparing" : k.status === "preparing" ? "ready" : "ready";
            return { ...k, status: next };
          }),
        }));
      },
      bumpKitchen: (id) => {
        set((s) => ({ kitchen: s.kitchen.filter((k) => k.id !== id) }));
      },

      loadOccupiedTable: (tableId) => {
        set({ view: "pos", orderType: "dine-in", activeTableId: tableId });
      },

      resetDemo: () =>
        set({
          view: "pos",
          category: "all",
          search: "",
          orderType: "dine-in",
          activeTableId: "t3",
          tickets: INITIAL_TICKETS,
          tables: INITIAL_TABLES,
          kitchen: INITIAL_KITCHEN,
          sales: INITIAL_SALES,
          held: [],
          modifierItem: null,
          checkoutOpen: false,
          splitOpen: false,
          clearOpen: false,
          receipt: null,
          flashLineId: null,
        }),
}));

export function currentTicket(state: Pick<PosState, "tickets" | "tables" | "orderType" | "activeTableId">) {
  if (state.orderType === "dine-in") {
    const table = state.tables.find((t) => t.id === state.activeTableId);
    if (table?.ticketId && state.tickets[table.ticketId]) return state.tickets[table.ticketId];
    return null;
  }
  return (
    Object.values(state.tickets).find(
      (t) => t.orderType === state.orderType && !t.tableId && !t.held,
    ) ?? null
  );
}

export function useCurrentTicket() {
  return usePos((s) => currentTicket(s));
}

void slotKey;
