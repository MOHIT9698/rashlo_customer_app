// import { getCategoryOfItem, getItemById } from '../data/rashanCategories';

import { getItemById } from "@/components/home_screen/rashancategries";
import { getCategoryOfItem } from "./Rashancategories";

type KitUnit = 'kg' | 'g' | 'L' | 'pcs';

interface KitLineConfig {
  itemId: string;      // must match an item id in the catalog
  unit: KitUnit;
  perPerson: number;   // estimated monthly use per person, in `unit`
  min: number;         // never suggest less than this, even for a single person
  step: number;        // round UP to a multiple of this (a shop can't sell 3.37kg of dal)
  optional?: boolean;  // optional lines start unticked
}

// STARTING ESTIMATES — typical monthly use for an Indian household, per person.
// Your shop owners know their customers better than any default, so adjust these.
// Customers can still edit every line before adding to cart.
const KIT_LINES: KitLineConfig[] = [
  // Essentials
  { itemId: 'wheat-atta', unit: 'kg', perPerson: 4, min: 4, step: 1 },
  { itemId: 'basmati-rice', unit: 'kg', perPerson: 2, min: 2, step: 1 },
  { itemId: 'toor-dal', unit: 'kg', perPerson: 0.5, min: 0.5, step: 0.5 },
  { itemId: 'moong-dal', unit: 'kg', perPerson: 0.25, min: 0.5, step: 0.25 },
  { itemId: 'chana-dal', unit: 'kg', perPerson: 0.25, min: 0.5, step: 0.25 },
  { itemId: 'masoor-dal', unit: 'kg', perPerson: 0.25, min: 0.5, step: 0.25 },
  { itemId: 'mustard-oil', unit: 'L', perPerson: 0.75, min: 1, step: 0.5 },
  { itemId: 'white-sugar', unit: 'kg', perPerson: 1, min: 1, step: 1 },
  { itemId: 'iodised-salt', unit: 'kg', perPerson: 0.25, min: 1, step: 1 },
  { itemId: 'tea-leaf', unit: 'kg', perPerson: 0.1, min: 0.25, step: 0.25 },
  { itemId: 'turmeric-powder', unit: 'g', perPerson: 20, min: 100, step: 50 },
  { itemId: 'red-chilli-powder', unit: 'g', perPerson: 20, min: 100, step: 50 },
  { itemId: 'coriander-powder', unit: 'g', perPerson: 40, min: 100, step: 50 },
  { itemId: 'cumin-seeds', unit: 'g', perPerson: 15, min: 100, step: 50 },
  { itemId: 'garam-masala', unit: 'g', perPerson: 10, min: 50, step: 50 },

  // Optional extras — start unticked so the list isn't padded with things people don't want
  { itemId: 'ghee', unit: 'L', perPerson: 0.15, min: 0.25, step: 0.25, optional: true },
  { itemId: 'besan', unit: 'kg', perPerson: 0.15, min: 0.5, step: 0.25, optional: true },
  { itemId: 'kabuli-chana', unit: 'kg', perPerson: 0.15, min: 0.5, step: 0.5, optional: true },
  { itemId: 'detergent-powder', unit: 'kg', perPerson: 0.5, min: 1, step: 0.5, optional: true },
  { itemId: 'dishwash-bar', unit: 'pcs', perPerson: 0.75, min: 2, step: 1, optional: true },
  { itemId: 'bathing-soap', unit: 'pcs', perPerson: 1.5, min: 2, step: 1, optional: true },
  { itemId: 'toothpaste', unit: 'pcs', perPerson: 0.5, min: 1, step: 1, optional: true },
];

export interface RationLine {
  key: string;
  itemId: string;
  name: string;
  icon: string;
  categoryId: string;
  quantity: string;       // editable free text, e.g. "16kg" or "500g"
  included: boolean;
  edited: boolean;        // true once the customer has typed their own quantity
  optional: boolean;
  brand?: string;
  isCustom?: boolean;
}

function trimNumber(n: number): string {
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
}

export function formatAmount(amount: number, unit: KitUnit): string {
  switch (unit) {
    case 'kg':
      return amount < 1 ? `${Math.round(amount * 1000)}g` : `${trimNumber(amount)}kg`;
    case 'L':
      return amount < 1 ? `${Math.round(amount * 1000)}ml` : `${trimNumber(amount)}L`;
    case 'g':
      return amount >= 1000 ? `${trimNumber(amount / 1000)}kg` : `${Math.round(amount)}g`;
    case 'pcs':
      return `${Math.round(amount)} pcs`;
  }
}

function computeAmount(line: KitLineConfig, members: number): number {
  const raw = line.perPerson * members;
  const rounded = Math.ceil(raw / line.step - 1e-9) * line.step;
  return Math.max(line.min, rounded);
}

export function getKitQuantity(itemId: string, members: number): string | undefined {
  const config = KIT_LINES.find((l) => l.itemId === itemId);
  if (!config) return undefined;
  return formatAmount(computeAmount(config, members), config.unit);
}

export function buildRationPlan(members: number): RationLine[] {
  const lines: RationLine[] = [];

  for (const config of KIT_LINES) {
    const item = getItemById(config.itemId);
    const category = getCategoryOfItem(config.itemId);
    // Defensive: if a catalog item was renamed or removed, skip the line
    // instead of crashing the whole screen.
    if (!item || !category) continue;

    lines.push({
      key: config.itemId,
      itemId: config.itemId,
      name: item.name,
      icon: item.icon,
      categoryId: category.id,
      quantity: formatAmount(computeAmount(config, members), config.unit),
      included: !config.optional,
      edited: false,
      optional: !!config.optional,
    });
  }

  return lines;
}