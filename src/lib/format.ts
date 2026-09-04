import { SERVICE_RATE, TAX_RATE, type CartLine, type Ticket, type TicketTotals } from "./types";

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const moneyPlain = (n: number) => n.toFixed(2);

export function lineTotal(line: CartLine) {
  return line.unitPrice * line.quantity;
}

export function ticketTotals(ticket: Ticket | null | undefined): TicketTotals {
  if (!ticket || ticket.lines.length === 0) {
    return { subtotal: 0, tax: 0, service: 0, tip: 0, total: 0, itemCount: 0 };
  }
  const subtotal = ticket.lines.reduce((sum, line) => sum + lineTotal(line), 0);
  const tax = round2(subtotal * TAX_RATE);
  const service =
    ticket.orderType === "dine-in" ? round2(subtotal * SERVICE_RATE) : 0;
  const tip = round2(subtotal * ticket.tipPercent);
  const itemCount = ticket.lines.reduce((sum, line) => sum + line.quantity, 0);
  return {
    subtotal: round2(subtotal),
    tax,
    service,
    tip,
    total: round2(subtotal + tax + service + tip),
    itemCount,
  };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export function padTicket(n: string) {
  return n.replace(/\D/g, "").padStart(4, "0");
}

export function clockString(d = new Date()) {
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function dateString(d = new Date()) {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function elapsed(from: number) {
  const mins = Math.max(0, Math.floor((Date.now() - from) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}
