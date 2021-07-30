const mindex = (arr) => {
  let idx = 0;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] < arr[idx]) {
      idx = i;
    }
  }
  return idx;
};

const offscreen = (width, height = Infinity) => ({
  top: -9999,
  left: -9999,
  width,
  height,
});

const defaultLayout =
  ({ cache, columnWidth = 236, gutter = 14, justify, minCols = 2, rawItemCount, width }) =>
  (items) => {
    if (width == null) {
      return items.map(() => offscreen(columnWidth));
    }

    const columnWidthAndGutter = columnWidth + gutter;
    const columnCount = Math.max(Math.floor((width + gutter) / columnWidthAndGutter), minCols);
    // the total height of each column
    const heights = new Array(columnCount).fill(0);

    let centerOffset;
    if (justify === 'center') {
      const contentWidth =
        Math.min(rawItemCount, columnCount) * columnWidth + (columnCount - 1) * gutter;
      centerOffset = Math.max(Math.floor((width - contentWidth) / 2), 0);
      console.log('contentWidth', contentWidth);
      console.log('centerOffset', centerOffset);
    } else {
      centerOffset = Math.max(
        Math.floor((width - columnWidthAndGutter * columnCount + gutter) / 2),
        0
      );
    }

    return items.reduce((acc, item) => {
      const positions = acc;
      const height = cache.get(item);
      let position;

      if (height == null) {
        position = offscreen(columnWidth);
      } else {
        const heightAndGutter = height + gutter;
        const col = mindex(heights);
        const top = heights[col];
        const left = col * columnWidthAndGutter + centerOffset;

        heights[col] += heightAndGutter;
        position = { top, left, width: columnWidth, height };
      }
      positions.push(position);
      return positions;
    }, []);
  };

export default defaultLayout;
