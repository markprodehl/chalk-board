/**
 * Sort items by order property
 * @param {Array} items - Items to sort
 * @returns {Array} Sorted items
 */
export const sortByOrder = (items) => {
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};
