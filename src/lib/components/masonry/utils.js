export const layoutNumberToCssDimension = (n) => (n !== Infinity ? n : undefined);

export const mindex = (arr) => {
  return arr.indexOf(Math.min(...arr)) || 0;
};

export function debounce(fn, threshhold = 100) {
  let deferTimer = null;

  const debounced = (...args) => {
    if (deferTimer) {
      clearTimeout(deferTimer);
    }
    deferTimer = setTimeout(() => {
      deferTimer = null;
      fn(...args);
    }, threshhold);
  };

  debounced.clearTimeout = () => {
    if (deferTimer) {
      clearTimeout(deferTimer);
    }
  };
  return debounced;
}

export function getPosition(props) {
  let { top = Infinity, left = Infinity, width = Infinity, height = Infinity } = props || {};
  return {
    top,
    left,
    width,
    height,
  };
}

export function getRefinedColumnData(props) {
  let { minCols, width, columnWidth, gutter } = props;
  const colguess = Math.floor(width / columnWidth);
  const columnCount = Math.max(Math.floor((width - colguess * gutter) / columnWidth), minCols);
  const refinedColumnWidth = Math.floor(width / columnCount);
  return { columnCount, refinedColumnWidth };
}
