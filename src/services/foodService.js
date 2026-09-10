import rawData from '../assets/fnb.json';

function formatImageUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  // Base64 JPEG data string from original fnb.json
  return `data:image/jpeg;base64,${trimmed}`;
}

class FoodService {
  constructor() {
    this.items = (rawData.listOfFnbItems || []).map((item) => ({
      ...item,
      // Normalize image data URI
      itemImageURL: formatImageUrl(item.itemImageURL),
      // Normalize rate / price
      effectivePrice: item.itemOfferRate || item.itemRate || 0,
      // Standardize foodType capitalization
      foodType: (item.foodType || 'Veg').trim().toLowerCase() === 'non veg' ? 'Non Veg' : 'Veg',
    }));

    this.itemsMap = new Map();
    this.items.forEach((item) => {
      this.itemsMap.set(item.itemId, item);
    });
  }

  getAllItems() {
    return this.items;
  }

  getItemsMap() {
    return this.itemsMap;
  }

  getItemById(itemId) {
    return this.itemsMap.get(itemId) || null;
  }

  getPopularItems() {
    const popular = this.items.filter((item) => Boolean(item.isPopuplarItem));
    return popular.length > 0 ? popular : this.items.slice(0, 4);
  }

  getRepeatItems() {
    const repeat = this.items.filter((item) => Boolean(item.isRepeat));
    // If only 1 repeat item in raw data, include a couple top items so repeat carousel is functional
    if (repeat.length <= 1) {
      const additional = this.items.filter(
        (it) => it.itemId !== (repeat[0]?.itemId) && (it.itemCategory === 'HOT BEVERAGES' || it.itemCategory === 'SNACKS' || it.itemCategory === 'POPCORN')
      ).slice(0, 3);
      return [...repeat, ...additional];
    }
    return repeat;
  }
}

export const foodService = new FoodService();
export default foodService;
