import { useCallback, useEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

import styles from './styles.js';
import debounce from './debounce.js';
import throttle from './throttle.js';
import useForceUpdate from './useForceUpdate';
import defaultLayout from './defaultLayout.js';
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

export default function useMasonry(props) {
  const {
    columnWidth = 236,
    flexible = false,
    gutterWidth,
    items,
    loadItems = emptyFn,
    minCols = 3,
    scrollContainer,
    virtualBoundsTop,
    virtualBoundsBottom,
  } = props;

  const gutter = Number(gutterWidth);

  const containerHeightRef = useRef(0);
  const containerOffsetRef = useRef(0);
  const insertAnimationFrameRef = useRef();
  
  const gridWrapperElementRef = useRef();
  const scrollContainerElementRef = useRef();

  const [scrollTop, setScrollTop] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const { width } = useResizeDetector({
    targetRef: gridWrapperElementRef,
    refreshMode: 'throttle',
  });

  const [forceUpdateValue, forceUpdate] = useForceUpdate();

  const [measurementStore] = useState(createMeasurementStore());

  const [hasPendingMeasurements, setHasPendingMeasurements] = useState(
    props.items.some((item) => !!item && !measurementStore.has(item))
  );

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

  const itemsToRender = items.filter((item) => item && measurementStore.has(item));
  const itemsToMeasure = items
    .filter((item) => item && !measurementStore.has(item))
    .slice(0, minCols);
  const positions = getPositions(itemsToRender);
  const measuringPositions = getPositions(itemsToMeasure);
  const height = positions.length ? Math.max(...positions.map((pos) => pos.top + pos.height)) : 0;

  const measureContainer = useCallback(() => {
    if (scrollContainerElementRef.current) {
      const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();
      if (scrollContainer) {
        containerHeightRef.current = getElementHeight(scrollContainer);
        const el = gridWrapperElementRef.current;
        if (el instanceof HTMLElement) {
          const relativeScrollTop = getRelativeScrollTop(scrollContainer);
          containerOffsetRef.current = el.getBoundingClientRect().top + relativeScrollTop;
        }
      }
    }
  }, [scrollContainerElementRef, gridWrapperElementRef]);

  const fetchMore = () => {
    if (loadItems && typeof loadItems === 'function') {
      setIsFetching(true);
      loadItems({ from: items.length });
    }
  };

  const getStoneProps = (item, i, position, isMeasuring) => {
    let stoneProps = {};
    const { top, left, width } = position;
    const className = 'masonry-item';
    let style = { ...styles.Masonry__Item };
    if (isMeasuring) {
      stoneProps.className = className + ' masonry-item-measuring';
      stoneProps.style = {
        ...style,
        ...styles.Masonry__Item__Measuring,
        top: layoutNumberToCssDimension(top),
        left: layoutNumberToCssDimension(left),
        width: layoutNumberToCssDimension(width),
      };
    } else {
      stoneProps.className = className + ' masonry-item-mounted';
      stoneProps.style = {
        ...style,
        ...styles.Masonry__Item__Mounted,
        top: 0,
        left: 0,
        transform: `translateX(${left}px) translateY(${top}px)`,
        WebkitTransform: `translateX(${left}px) translateY(${top}px)`,
        width: layoutNumberToCssDimension(width),
      };
    }
    stoneProps.ref = (el) => handleRefereceEle(el, item, isMeasuring);
    stoneProps['data-grid-item'] = i;

    return stoneProps;
  };

  const shouldVisible = (position) => {
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
    return isVisible;
  };

  const forceUpdateAsync = useCallback(
    throttle(() => {
      forceUpdate();
    }),
    [forceUpdate]
  );

  const updateScrollPosition = useCallback(
    throttle(() => {
      if (!scrollContainerElementRef.current) {
        return;
      }
      const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();

      if (!scrollContainer) {
        return;
      }

      setScrollTop(getScrollPos(scrollContainer));
    }),
    [scrollContainerElementRef.current]
  );

  const measureContainerAsync = useCallback(
    debounce(() => {
      measureContainer();
    }, 0),
    [measureContainer]
  );

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

    if (scrollContainerElementRef.current != null) {
      const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();
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

  return {
    width,
    handleRefereceEle,
    containerHeightRef,
    containerOffsetRef,
    scrollTop,
    gridWrapperElementRef,
    scrollContainerElementRef,
    updateScrollPosition,
    measurementStore,
    getPositions,
    fetchMore,
    isFetching,
    hasPendingMeasurements,
    shouldVisible,
    getStoneProps,
    itemsToRender,
    itemsToMeasure,
    positions,
    measuringPositions,
    height,
  };
}
