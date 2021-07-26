import React from 'react';
import { useResizeDetector } from 'react-resize-detector';

import useForceUpdate from './useForceUpdate';
import { mindex, getPosition, getRefinedColumnData } from './utils';

export default function usePositions(props) {
  const { items, columnWidth, minCols, gutter, measurementStore, containerRef } = props;
  
  const [positions, setPositions] = React.useState([]);

  const [updatedData, forceUpdate] = useForceUpdate();
  const { width } = useResizeDetector({
    targetRef: containerRef,
  });

  const calculatePositions = () => {
    let positions = [];
    if (!width) {
      positions = items.map(() => getPosition());
    } else {
      let { columnCount, refinedColumnWidth } = getRefinedColumnData({
        width,
        columnWidth,
        minCols,
        gutter,
      });
      let heights = new Array(columnCount).fill(0);
      positions = items.map((item, itemIndex) => {
        let height = measurementStore.get(item);

        if (height == null) {
          return getPosition({ width: refinedColumnWidth });
        }

        let heightWithGutter = height + gutter;
        let col = mindex(heights);
        let top = heights[col];
        let left = col * refinedColumnWidth + gutter / 2;
        let width = refinedColumnWidth - gutter;

        heights[col] += heightWithGutter;

        return getPosition({ top, left, width, height });
      });
    }
    setPositions(positions);
  };
  
  React.useEffect(() => {
    calculatePositions();
  }, [updatedData, items, width]);

  return { positions, forceUpdate };
}
