export const DEFAULT_FILTERS = {
  minPrice: 0,
  maxPrice: 300,
  skinType: [],
  skinConcern: [],
  form: [],
  ingredients: [],
  aroma: [],
};

// Drives the FilterDrawer accordions dynamically (zero duplicated JSX!)
export const FILTER_SECTIONS = [
  { key: "skinType", label: "Skin type", isArray: true },
  { key: "skinConcern", label: "Skin concern", isArray: true },
  { key: "form", label: "Form", isArray: false },
  { key: "ingredients", label: "Ingredients", isArray: true },
  { key: "aroma", label: "Aroma", isArray: false },
];

export function getFilterOptions(products) {
  const options = {};
  for (const section of FILTER_SECTIONS) {
    const counts = {};
    for (const p of products) {
      const val = p[section.key];
      const list = Array.isArray(val) ? val : val ? [val] : [];
      for (const item of list) {
        counts[item] = (counts[item] || 0) + 1;
      }
    }
    options[section.key] = Object.entries(counts).map(([value, count]) => ({
      value,
      count,
    }));
  }
  return options;
}

export function filterAndSortProducts(products, filters, sortBy) {
  const filtered = products.filter((p) => {
    if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;

    for (const section of FILTER_SECTIONS) {
      const selected = filters[section.key];
      if (!selected || selected.length === 0) continue;

      const productVal = p[section.key];
      const matches = Array.isArray(productVal)
        ? selected.some((s) => productVal.includes(s))
        : selected.includes(productVal);

      if (!matches) return false;
    }
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);
  if (sortBy === "name-asc") sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "name-desc") sorted.sort((a, b) => b.name.localeCompare(a.name));
  return sorted;
}