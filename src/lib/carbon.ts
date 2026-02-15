// Average CO₂ savings estimates per product category (kg CO₂)
// Based on industry averages comparing new vs. second-hand purchases
export const CARBON_SAVINGS: Record<string, number> = {
    clothing: 3.6,
    shoes: 8.5,
    electronics: 15.2,
    accessories: 1.8,
    default: 3.6,
};

export function getCarbonSaving(category?: string | null): number {
    if (!category) return CARBON_SAVINGS.default;
    const key = category.toLowerCase();
    return CARBON_SAVINGS[key] ?? CARBON_SAVINGS.default;
}
