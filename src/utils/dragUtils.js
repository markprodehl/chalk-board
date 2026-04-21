/**
 * Handle drag end reordering for items
 * @param {Object} result - Drag result from DragDropContext
 * @param {Array} items - Current items array
 * @param {Function} setItems - State setter for items
 * @param {Function} updateFirebase - Callback to update Firebase for each item
 */
export const handleDragEnd = (result, items, setItems, updateFirebase) => {
  if (!result.destination) return;
  
  const sourceIndex = result.source.index;
  const destinationIndex = result.destination.index;
  
  if (sourceIndex === destinationIndex) return;

  const updatedItems = Array.from(items);
  const [movedItem] = updatedItems.splice(sourceIndex, 1);
  updatedItems.splice(destinationIndex, 0, movedItem);
  
  setItems(updatedItems);

  // Update order in Firebase
  updatedItems.forEach((item, index) => {
    updateFirebase(item.id, index);
  });
};
