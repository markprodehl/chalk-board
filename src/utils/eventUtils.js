/**
 * Create event handlers that stop propagation
 * Usage: {...createStopPropagationHandlers()}
 */
export const createStopPropagationHandlers = () => {
  return {
    onPointerDown: (e) => e.stopPropagation(),
    onTouchStart: (e) => e.stopPropagation(),
    onClick: (e) => e.stopPropagation(),
  };
};
