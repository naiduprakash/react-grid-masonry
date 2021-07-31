"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.array.reduce.js");

const mindex = arr => {
  let idx = 0;

  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] < arr[idx]) {
      idx = i;
    }
  }

  return idx;
};

const fullWidthLayout = (_ref) => {
  let {
    gutter = 0,
    cache,
    minCols = 2,
    idealColumnWidth = 236,
    width
  } = _ref;

  if (width == null) {
    return items => {
      return items.map(() => ({
        top: Infinity,
        left: Infinity,
        width: Infinity,
        height: Infinity
      }));
    };
  }

  const colguess = Math.floor(width / idealColumnWidth);
  const columnCount = Math.max(Math.floor((width - colguess * gutter) / idealColumnWidth), minCols);
  const columnWidth = Math.floor(width / columnCount); // eslint-disable-next-line flowtype/no-mutable-array

  return items => {
    // the total height of each column
    const heights = new Array(columnCount).fill(0);
    return items.reduce((acc, item) => {
      const positions = acc;
      const height = cache.get(item);
      let position;

      if (height == null) {
        position = {
          top: Infinity,
          left: Infinity,
          width: columnWidth,
          height: Infinity
        };
      } else {
        let heightWithGutter = height + gutter;
        const col = mindex(heights);
        const top = heights[col];
        const left = col * columnWidth + gutter / 2;
        heights[col] += heightWithGutter;
        position = {
          top,
          left,
          width: columnWidth - gutter,
          height
        };
      }

      positions.push(position);
      return positions;
    }, []);
  };
};

var _default = fullWidthLayout;
exports.default = _default;