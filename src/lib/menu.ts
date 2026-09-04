import type { CategoryId, MenuItem, ModifierGroup } from "./types";

const doneness: ModifierGroup = {
  id: "doneness",
  name: "Doneness",
  required: true,
  maxSelect: 1,
  options: [
    { id: "rare", name: "Rare", price: 0 },
    { id: "mr", name: "Medium rare", price: 0 },
    { id: "med", name: "Medium", price: 0 },
    { id: "mw", name: "Medium well", price: 0 },
    { id: "well", name: "Well done", price: 0 },
  ],
};

const steakFinish: ModifierGroup = {
  id: "finish",
  name: "Finish & sides",
  required: false,
  maxSelect: 4,
  options: [
    { id: "truffle-fries", name: "Truffle fries", price: 8 },
    { id: "asparagus", name: "Charred asparagus", price: 7 },
    { id: "marrow-butter", name: "Bone marrow butter", price: 4 },
    { id: "au-poivre", name: "Extra au poivre", price: 3 },
    { id: "egg", name: "Sunny hen egg", price: 4 },
  ],
};

const pizzaSize: ModifierGroup = {
  id: "size",
  name: "Size",
  required: true,
  maxSelect: 1,
  options: [
    { id: "10", name: '10" personal', price: 0 },
    { id: "12", name: '12" share', price: 4 },
    { id: "14", name: '14" table', price: 8 },
  ],
};

const pizzaAdd: ModifierGroup = {
  id: "pizza-add",
  name: "Add-ons",
  required: false,
  maxSelect: 4,
  options: [
    { id: "extra-cheese", name: "Extra cheese", price: 3 },
    { id: "chili-honey", name: "Chili honey", price: 2 },
    { id: "truffle-oil", name: "White truffle oil", price: 5 },
    { id: "gf", name: "Gluten-free crust", price: 4 },
  ],
};

const plateSides: ModifierGroup = {
  id: "sides",
  name: "Add a side",
  required: false,
  maxSelect: 3,
  options: [
    { id: "heritage", name: "Heritage salad", price: 6 },
    { id: "truffle-fries", name: "Truffle fries", price: 8 },
    { id: "broccolini", name: "Grilled broccolini", price: 7 },
  ],
};

const drinkBuild: ModifierGroup = {
  id: "build",
  name: "Build",
  required: true,
  maxSelect: 1,
  options: [
    { id: "up", name: "Up", price: 0 },
    { id: "rocks", name: "Rocks", price: 0 },
    { id: "extra-shot", name: "Extra shot", price: 2 },
  ],
};

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "appetizers", label: "Appetizers" },
  { id: "mains", label: "Mains" },
  { id: "steaks", label: "Steaks & Grills" },
  { id: "pizzas", label: "Artisan Pizzas" },
  { id: "desserts", label: "Desserts" },
  { id: "drinks", label: "Signature Drinks" },
];

export const MENU: MenuItem[] = [
  {
    id: "burrata-peach",
    name: "Burrata & Charred Peach",
    description: "Torn burrata, blistered peach, pistachio, basil oil.",
    price: 18,
    category: "appetizers",
    image: "/images/dishes/burrata-peach.jpg",
    tags: ["vegetarian", "popular"],
    customizable: false,
  },
  {
    id: "tuna-crudo",
    name: "Tuna Crudo, Yuzu & Chili",
    description: "Yellowfin, yuzu pearls, chili oil, ice plant.",
    price: 22,
    category: "appetizers",
    image: "/images/dishes/tuna-crudo.jpg",
    tags: ["spicy", "signature"],
    customizable: false,
  },
  {
    id: "bone-marrow",
    name: "Bone Marrow Toast",
    description: "Roasted marrow, grilled sourdough, parsley-shallot.",
    price: 19,
    category: "appetizers",
    image: "/images/dishes/bone-marrow.jpg",
    tags: ["popular"],
    customizable: true,
    modifierGroups: [plateSides],
  },
  {
    id: "tomato-consomme",
    name: "Heirloom Tomato Consommé",
    description: "Clear red broth, basil blossom, gold oil.",
    price: 16,
    category: "appetizers",
    image: "/images/dishes/tomato-consomme.jpg",
    tags: ["vegetarian"],
    customizable: false,
  },
  {
    id: "branzino",
    name: "Herb-Roasted Branzino",
    description: "Whole fish, lemon, fennel fronds, olive oil.",
    price: 38,
    category: "mains",
    image: "/images/dishes/branzino.jpg",
    tags: ["signature"],
    customizable: true,
    modifierGroups: [plateSides],
  },
  {
    id: "lobster-risotto",
    name: "Saffron Lobster Risotto",
    description: "Arborio, split tail, saffron, chive oil.",
    price: 42,
    category: "mains",
    image: "/images/dishes/lobster-risotto.jpg",
    tags: ["popular"],
    customizable: true,
    modifierGroups: [plateSides],
  },
  {
    id: "duck-breast",
    name: "Duck, Cherry & Fennel",
    description: "Rosy breast, cherry gastrique, caramelized fennel.",
    price: 36,
    category: "mains",
    image: "/images/dishes/duck-breast.jpg",
    tags: [],
    customizable: true,
    modifierGroups: [plateSides],
  },
  {
    id: "black-cod",
    name: "Miso-Glazed Black Cod",
    description: "Lacquered sable, shishito, pickled daikon.",
    price: 39,
    category: "mains",
    image: "/images/dishes/black-cod.jpg",
    tags: ["signature"],
    customizable: true,
    modifierGroups: [plateSides],
  },
  {
    id: "ribeye",
    name: "Dry-Aged Ribeye 16oz",
    description: "Bone-in, herb butter, deep crust.",
    price: 68,
    category: "steaks",
    image: "/images/dishes/ribeye.jpg",
    tags: ["popular", "signature"],
    customizable: true,
    modifierGroups: [doneness, steakFinish],
  },
  {
    id: "filet",
    name: "Filet Mignon 8oz",
    description: "Center-cut, green peppercorn, baby carrot.",
    price: 58,
    category: "steaks",
    image: "/images/dishes/filet-mignon.jpg",
    tags: [],
    customizable: true,
    modifierGroups: [doneness, steakFinish],
  },
  {
    id: "wagyu-skirt",
    name: "Wagyu Skirt, Chimichurri",
    description: "Against the grain, charred scallion.",
    price: 48,
    category: "steaks",
    image: "/images/dishes/wagyu-skirt.jpg",
    tags: ["spicy"],
    customizable: true,
    modifierGroups: [doneness, steakFinish],
  },
  {
    id: "lamb-chops",
    name: "Fire-Roasted Lamb Chops",
    description: "Herb crust, pomegranate, smoked eggplant.",
    price: 52,
    category: "steaks",
    image: "/images/dishes/lamb-chops.jpg",
    tags: ["signature"],
    customizable: true,
    modifierGroups: [doneness, steakFinish],
  },
  {
    id: "pizza-tartufo",
    name: "Bianca Tartufo",
    description: "Mozzarella, shaved black truffle, olive oil.",
    price: 24,
    category: "pizzas",
    image: "/images/dishes/pizza-tartufo.jpg",
    tags: ["vegetarian", "popular"],
    customizable: true,
    modifierGroups: [pizzaSize, pizzaAdd],
  },
  {
    id: "pizza-fig",
    name: "Fig, Prosciutto & Honey",
    description: "Caramelized fig, folded ham, goat cheese.",
    price: 26,
    category: "pizzas",
    image: "/images/dishes/pizza-fig.jpg",
    tags: [],
    customizable: true,
    modifierGroups: [pizzaSize, pizzaAdd],
  },
  {
    id: "pizza-nduja",
    name: "Spicy 'Nduja & Burrata",
    description: "Calabrian spread, torn burrata, chili oil.",
    price: 25,
    category: "pizzas",
    image: "/images/dishes/pizza-nduja.jpg",
    tags: ["spicy", "popular"],
    customizable: true,
    modifierGroups: [pizzaSize, pizzaAdd],
  },
  {
    id: "chocolate-nemesis",
    name: "Dark Chocolate Nemesis",
    description: "Flourless cake, ganache, gold leaf, crème fraîche.",
    price: 14,
    category: "desserts",
    image: "/images/dishes/chocolate-nemesis.jpg",
    tags: ["vegetarian", "popular"],
    customizable: false,
  },
  {
    id: "olive-oil-cake",
    name: "Olive Oil Cake, Citrus",
    description: "Golden crumb, candied citrus, mascarpone.",
    price: 13,
    category: "desserts",
    image: "/images/dishes/olive-oil-cake.jpg",
    tags: ["vegetarian"],
    customizable: false,
  },
  {
    id: "old-fashioned",
    name: "Smoked Old Fashioned",
    description: "Rye, demerara, orange, applewood smoke.",
    price: 16,
    category: "drinks",
    image: "/images/dishes/smoked-old-fashioned.jpg",
    tags: ["signature"],
    customizable: true,
    modifierGroups: [drinkBuild],
  },
  {
    id: "yuzu-paloma",
    name: "Yuzu Paloma",
    description: "Tequila, yuzu, grapefruit, salt rim.",
    price: 14,
    category: "drinks",
    image: "/images/dishes/yuzu-paloma.jpg",
    tags: [],
    customizable: true,
    modifierGroups: [drinkBuild],
  },
  {
    id: "espresso-martini",
    name: "Espresso Martini, Cacao",
    description: "Vodka, house espresso, cacao dust.",
    price: 15,
    category: "drinks",
    image: "/images/dishes/espresso-martini.jpg",
    tags: ["popular"],
    customizable: true,
    modifierGroups: [drinkBuild],
  },
];

export const MENU_BY_ID = Object.fromEntries(MENU.map((item) => [item.id, item])) as Record<
  string,
  MenuItem
>;

export function unitPrice(item: MenuItem, modifiers: { groupId: string; optionIds: string[] }[]) {
  let extra = 0;
  for (const selected of modifiers) {
    const group = item.modifierGroups?.find((g) => g.id === selected.groupId);
    if (!group) continue;
    for (const optionId of selected.optionIds) {
      const option = group.options.find((o) => o.id === optionId);
      if (option) extra += option.price;
    }
  }
  return item.price + extra;
}

export function modifierLabels(
  item: MenuItem,
  modifiers: { groupId: string; optionIds: string[] }[],
) {
  const labels: string[] = [];
  for (const selected of modifiers) {
    const group = item.modifierGroups?.find((g) => g.id === selected.groupId);
    if (!group) continue;
    for (const optionId of selected.optionIds) {
      const option = group.options.find((o) => o.id === optionId);
      if (option) labels.push(option.price ? `${option.name} +$${option.price}` : option.name);
    }
  }
  return labels;
}
