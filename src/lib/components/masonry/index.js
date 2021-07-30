import { useCallback, useEffect, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import styles from './styles.js';
import debounce from './debounce.js';
import throttle from './throttle.js';
import FetchItems from './FetchItems.js';
import useForceUpdate from './useForceUpdate';
import useState from './useStateWithCallback';
import defaultLayout from './defaultLayout.js';
import ScrollContainer from './ScrollContainer.js';
import fullWidthLayout from './fullWidthLayout.js';
import MeasurementStore from './MeasurementStore.js';
import { getElementHeight, getRelativeScrollTop, getScrollPos } from './scrollUtils.js';

// Multiplied against container height.
// The amount of extra buffer space for populating visible items.
const VIRTUAL_BUFFER_FACTOR = 0.7;

const layoutNumberToCssDimension = (n) => (n !== Infinity ? n : undefined);

function createMeasurementStore() {
  return new MeasurementStore();
}

function emptyFn() {}

export default function Masonry(props) {
  const {
    columnWidth = 236,
    comp: Component,
    flexible = false,
    gutterWidth,
    items,
    loadItems = emptyFn,
    minCols = 3,
    scrollContainer,
    virtualize = false,
    virtualBoundsTop,
    virtualBoundsBottom,
  } = props;

  const gutter = Number(gutterWidth);

  const containerHeightRef = useRef(0);
  const containerOffsetRef = useRef(0);
  const insertAnimationFrameRef = useRef();

  const gridWrapperRef = useRef();
  const scrollContainerRef = useRef();

  const [scrollTop, setScrollTop] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const { width } = useResizeDetector({
    targetRef: gridWrapperRef,
    refreshMode: 'throttle',
  });

  const [forceUpdateValue, forceUpdate] = useForceUpdate();

  const [measurementStore] = useState(createMeasurementStore());

  const [hasPendingMeasurements, setHasPendingMeasurements] = useState(
    props.items.some((item) => !!item && !measurementStore.has(item))
  );

  const measureContainer = useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current.getScrollContainerRef();
      if (scrollContainer) {
        containerHeightRef.current = getElementHeight(scrollContainer);
        const el = gridWrapperRef.current;
        if (el instanceof HTMLElement) {
          const relativeScrollTop = getRelativeScrollTop(scrollContainer);
          containerOffsetRef.current = el.getBoundingClientRect().top + relativeScrollTop;
        }
      }
    }
  }, [scrollContainerRef, gridWrapperRef]);

  const fetchMore = () => {
    if (loadItems && typeof loadItems === 'function') {
      setIsFetching(true, () => loadItems({ from: items.length }));
    }
  };

  const forceUpdateAsync = useCallback(
    throttle(() => {
      forceUpdate();
    }),
    [forceUpdate]
  );

  const updateScrollPosition = useCallback(
    throttle(() => {
      if (!scrollContainerRef.current) {
        return;
      }
      const scrollContainer = scrollContainerRef.current.getScrollContainerRef();

      if (!scrollContainer) {
        return;
      }

      setScrollTop(getScrollPos(scrollContainer));
    }),
    [scrollContainerRef.current]
  );

  const measureContainerAsync = useCallback(
    debounce(() => {
      measureContainer();
    }, 0),
    [measureContainer]
  );

  /**
   * only used it when neccessary
   */
  const reFlow = useCallback(() => {
    if (measurementStore) {
      measurementStore.reset();
    }
    measureContainer();
    forceUpdateAsync();
  }, [forceUpdateAsync, measureContainer, measurementStore]);

  const handleRefereceEle = (el, item, isMeasuring = false) => {
    if (el) {
      let height = el.clientHeight;
      let hasItemInStore = measurementStore.has(item);
      let prevHeight = 0;
      if (hasItemInStore) {
        prevHeight = measurementStore.get(item);
      }
      if (prevHeight !== height) {
        measurementStore.set(item, height);
        if (!isMeasuring) {
          forceUpdateAsync();
        }
      }
    }
  };

  const renderMasonryComponent = (item, idx, position) => {
    const { top, left, width } = position;

    let isVisible;
    if (scrollContainer) {
      const containerHeight = containerHeightRef.current;
      const containerOffset = containerOffsetRef.current;
      const virtualBuffer = containerHeight * VIRTUAL_BUFFER_FACTOR;
      const offsetScrollPos = scrollTop - containerOffset;
      const viewportTop = virtualBoundsTop
        ? offsetScrollPos - virtualBoundsTop
        : offsetScrollPos - virtualBuffer;
      const viewportBottom = virtualBoundsBottom
        ? offsetScrollPos + containerHeight + virtualBoundsBottom
        : offsetScrollPos + containerHeight + virtualBuffer;

      isVisible = !(position.top + position.height < viewportTop || position.top > viewportBottom);
    } else {
      // if no scroll container is passed in, items should always be visible
      isVisible = true;
    }

    const itemComponent = (
      <div
        key={`item-${idx}`}
        className="masonry-item masonry-item-mounted"
        data-grid-item={idx}
        style={{
          ...styles.Masonry__Item,
          ...styles.Masonry__Item__Mounted,
          top: 0,
          left: 0,
          transform: `translateX(${left}px) translateY(${top}px)`,
          WebkitTransform: `translateX(${left}px) translateY(${top}px)`,
          width: layoutNumberToCssDimension(width),
        }}
        ref={(el) => handleRefereceEle(el, item)}
      >
        <Component data={item} itemIdx={idx} isMeasuring={false} />
      </div>
    );

    return virtualize ? (isVisible && itemComponent) || null : itemComponent;
  };

  const renderMeasuringComponent = (item, idx, position) => {
    let isMeasuring = true;
    return (
      <div
        key={`measuring-${idx}`}
        className="masonry-item"
        style={{
          ...styles.Masonry__Item,
          ...styles.Masonry__Item__Measuring,
          top: layoutNumberToCssDimension(position.top),
          left: layoutNumberToCssDimension(position.left),
          width: layoutNumberToCssDimension(position.width),
        }}
        ref={(el) => handleRefereceEle(el, item, isMeasuring)}
      >
        <Component data={item} itemIdx={idx} isMeasuring={isMeasuring} />
      </div>
    );
  };

  let getPositions;

  if (flexible && width !== null) {
    getPositions = fullWidthLayout({
      gutter,
      cache: measurementStore,
      minCols,
      idealColumnWidth: columnWidth,
      width,
    });
  } else {
    getPositions = defaultLayout({
      cache: measurementStore,
      columnWidth,
      gutter,
      justify: 'center',
      minCols,
      rawItemCount: items.length,
      width,
    });
  }

  useEffect(() => {
    measureContainer();
  }, [measureContainer]);

  useEffect(() => {
    setIsFetching(false);
  }, [items]);

  useEffect(() => {
    const hasPendingMeasurementsUpdated = items.some(
      (item) => !!item && !measurementStore.has(item)
    );

    if (hasPendingMeasurementsUpdated || hasPendingMeasurementsUpdated !== hasPendingMeasurements) {
      insertAnimationFrameRef.current = requestAnimationFrame(() => {
        setHasPendingMeasurements(hasPendingMeasurementsUpdated);
        forceUpdateAsync();
      });
    }
    return () => {
      if (insertAnimationFrameRef.current) {
        cancelAnimationFrame(insertAnimationFrameRef.current);
      }
    };
  }, [forceUpdateAsync, forceUpdateValue, hasPendingMeasurements, items, measurementStore]);

  useEffect(() => {
    measureContainerAsync();

    if (scrollContainerRef.current != null) {
      const scrollContainer = scrollContainerRef.current.getScrollContainerRef();
      if (scrollContainer) {
        setScrollTop(getScrollPos(scrollContainer));
      }
    }
  }, [measureContainerAsync, width]);

  useEffect(() => {
    return () => {
      measureContainerAsync.clearTimeout();
      updateScrollPosition.clearTimeout();
    };
  }, [measureContainerAsync, updateScrollPosition]);

  let gridBody;
  if (width == null) {
    // When the width is empty (usually after a re-mount) render an empty
    // div to collect the width for layout
    gridBody = <div style={{ width: '100%' }} ref={gridWrapperRef} />;
  } else {
    // Full layout is possible
    const itemsToRender = items.filter((item) => item && measurementStore.has(item));
    const itemsToMeasure = items
      .filter((item) => item && !measurementStore.has(item))
      .slice(0, minCols);
    const positions = getPositions(itemsToRender);
    const measuringPositions = getPositions(itemsToMeasure);
    const height = positions.length ? Math.max(...positions.map((pos) => pos.top + pos.height)) : 0;
    gridBody = (
      <div style={{ width: '100%' }} ref={gridWrapperRef}>
        <div className="masonry" style={{ ...styles.Masonry, height, width }}>
          {itemsToRender.map((item, i) => renderMasonryComponent(item, i, positions[i]))}
        </div>
        <div className="masonry" style={{ ...styles.Masonry, width }}>
          {itemsToMeasure.map((item, i) =>
            renderMeasuringComponent(item, itemsToRender.length + i, measuringPositions[i])
          )}
        </div>

        {scrollContainer && (
          <FetchItems
            containerHeight={containerHeightRef.current}
            fetchMore={fetchMore}
            isFetching={isFetching || hasPendingMeasurements}
            scrollHeight={height + containerOffsetRef.current}
            scrollTop={scrollTop}
          />
        )}
      </div>
    );
  }

  return scrollContainer ? (
    <ScrollContainer
      ref={scrollContainerRef}
      onScroll={updateScrollPosition}
      scrollContainer={scrollContainer}
    >
      {gridBody}
    </ScrollContainer>
  ) : (
    gridBody
  );
}
