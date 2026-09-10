/**
 * Pure filter-combination logic.
 *
 * @param {Array} items - List of food items
 * @param {Object} filters
 * @param {Set|Array} filters.selectedCategories - Selected category IDs (e.g. ['SNACKS', 'POPCORN'])
 * @param {string|null} filters.selectedFoodType - 'Veg', 'Non Veg', or null (all)
 * @returns {Array} Filtered list of food items
 */
export function filterFoodItems(items = [], { selectedCategories = [], selectedFoodType = null } = {}) {
  const categoryList = Array.isArray(selectedCategories)
    ? selectedCategories
    : Array.from(selectedCategories || []);

  const hasCategoryFilter = categoryList.length > 0;
  const hasFoodTypeFilter = Boolean(selectedFoodType);

  if (!hasCategoryFilter && !hasFoodTypeFilter) {
    return items;
  }

  return items.filter((item) => {
    // 1. Food Type Filter match (Veg / Non Veg)
    if (hasFoodTypeFilter) {
      const itemType = (item.foodType || '').trim().toLowerCase();
      const targetType = selectedFoodType.trim().toLowerCase();
      if (itemType !== targetType) {
        return false;
      }
    }

    // 2. Category Filter match (SNACKS, POPCORN, COMBOS, etc.)
    if (hasCategoryFilter) {
      const itemCategory = (item.itemCategory || '').trim().toUpperCase();
      const matched = categoryList.some(
        (cat) => cat.trim().toUpperCase() === itemCategory
      );
      if (!matched) {
        return false;
      }
    }

    return true;
  });
}
