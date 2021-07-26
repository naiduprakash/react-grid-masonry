import React from 'react';
import useMasonryNew from './useMasonry';
import MasonryItem from './masonryItem';

/**
 * TODO: use context and compound component pattern
 */
function Masonry({ children, ...props }) {
  const { comp: Component, items = [], columnWidth, minCols, gutter } = props;
  let containerRef = React.useRef();
  const { measurementStore, getContainerProps, getStoneProps, forceUpdate } = useMasonryNew({
    containerRef,
    gutter,
    minCols,
    columnWidth,
    items,
  });

  const updateStoneSize = (height, item, itemIndex) => {
    if (height) {
      let hasItemInStore = measurementStore.has(item);
      let prevHeight = 0;
      if (hasItemInStore) {
        prevHeight = measurementStore.get(item);
      }
      if (prevHeight !== height) {
        measurementStore.set(item, height);
        forceUpdate();
      }
    }
  };

  return (
    <div className="grid-container" ref={containerRef} {...getContainerProps()}>
      {items.map((item, itemIndex) => {
        return (
          <MasonryItem
            key={item.uuid}
            updateSize={(height) => updateStoneSize(height, item, itemIndex)}
            {...getStoneProps(itemIndex)}
          >
            <Component data={item} itemIdx={itemIndex} isMeasuring={false} />
          </MasonryItem>
        );
      })}
    </div>
  );
}

export default React.memo(Masonry);
