export type ViewId = "pos" | "dashboard";

export type OrderType = "dine-in" | "takeaway" | "delivery";

export type TableStatus = "vacant" | "occupied" | "reserved" | "billed";

export type KitchenStatus = "pending" | "preparing" | "ready";

export type CategoryId =
  | "all"
  | "appetizers"
  | "mains"
  | "steaks"
  | "pizzas"
  | "desserts"
  | "drinks";

export type ItemTag = "popular" | "spicy" | "vegetarian" | "signature";

export type PaymentMethod = "cash" | "card" | "apple-pay";

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface ModifierGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect: number;
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<CategoryId, "all">;
  image: string;
  tags: ItemTag[];
  customizable: boolean;
  modifierGroups?: ModifierGroup[];
}

export interface SelectedModifier {
  groupId: string;
  optionIds: string[];
}

export interface CartLine {
  lineId: string;
  itemId: string;
  quantity: number;
  modifiers: SelectedModifier[];
  notes: string;
  unitPrice: number;
}

export interface Ticket {
  id: string;
  tableId: string | null;
  customerName: string;
  orderType: OrderType;
  lines: CartLine[];
  held: boolean;
  tipPercent: number;
  createdAt: number;
  covers: number;
}

export interface DiningTable {
  id: string;
  number: number;
  seats: number;
  zone: "Window" | "Hearth" | "Garden";
  status: TableStatus;
  ticketId: string | null;
  server: string;
  reservedName?: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface KitchenTicket {
  id: string;
  ticketId: string;
  tableLabel: string;
  items: { name: string; qty: number; notes?: string }[];
  status: KitchenStatus;
  firedAt: number;
}

export interface Sale {
  id: string;
  ticketId: string;
  tableLabel: string;
  items: { itemId: string; name: string; qty: number; revenue: number }[];
  subtotal: number;
  tax: number;
  service: number;
  tip: number;
  total: number;
  method: PaymentMethod;
  at: number;
}

export interface Receipt {
  sale: Sale;
  lines: { name: string; qty: number; price: number; mods: string[] }[];
  customerName: string;
  tableLabel: string;
  cashier: string;
}

export interface TicketTotals {
  subtotal: number;
  tax: number;
  service: number;
  tip: number;
  total: number;
  itemCount: number;
}

export const TAX_RATE = 0.1;
export const SERVICE_RATE = 0.05;
export const TIP_PRESETS = [0, 0.15, 0.18, 0.2, 0.25] as const;
