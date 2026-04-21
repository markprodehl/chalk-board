/**
 * Push history state to browser history API
 * @param {Object} state - State object to push
 */
export const pushHistoryState = (state) => {
  if (typeof window !== "undefined") {
    window.history.pushState(state, "", window.location.pathname);
  }
};

/**
 * Replace current history state
 * @param {Object} state - State object to replace with
 */
export const replaceHistoryState = (state) => {
  if (typeof window !== "undefined") {
    window.history.replaceState(state, "", window.location.pathname);
  }
};

/**
 * Add popstate event listener
 * @param {Function} callback - Callback to handle popstate events
 * @returns {Function} Cleanup function to remove listener
 */
export const addPopStateListener = (callback) => {
  if (typeof window !== "undefined") {
    window.addEventListener("popstate", callback);
    return () => window.removeEventListener("popstate", callback);
  }
  return () => {};
};
