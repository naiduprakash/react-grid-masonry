"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMasonry;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _reactResizeDetector = require("react-resize-detector");

var _styles = _interopRequireDefault(require("./styles.js"));

var _debounce = _interopRequireDefault(require("./debounce.js"));

var _throttle = _interopRequireDefault(require("./throttle.js"));

var _useForceUpdate = _interopRequireDefault(require("./useForceUpdate"));

var _defaultLayout = _interopRequireDefault(require("./defaultLayout.js"));

var _fullWidthLayout = _interopRequireDefault(require("./fullWidthLayout.js"));

var _MeasurementStore = _interopRequireDefault(require("./MeasurementStore.js"));

var _scrollUtils = require("./scrollUtils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Multiplied against container height.
// The amount of extra buffer space for populating visible items.
const VIRTUAL_BUFFER_FACTOR = 0.7;

const layoutNumberToCssDimension = n => n !== Infinity ? n : undefined;

function createMeasurementStore() {
  return new _MeasurementStore.default();
}

function emptyFn() {}

function useMasonry(props) {
  const {
    columnWidth = 236,
    flexible = false,
    gutterWidth,
    items,
    loadItems = emptyFn,
    minCols = 3,
    scrollContainer,
    virtualBoundsTop,
    virtualBoundsBottom
  } = props;
  const gutter = Number(gutterWidth);
  const containerHeightRef = (0, _react.useRef)(0);
  const containerOffsetRef = (0, _react.useRef)(0);
  const insertAnimationFrameRef = (0, _react.useRef)();
  const gridWrapperElementRef = (0, _react.useRef)();
  const scrollContainerElementRef = (0, _react.useRef)();
  const [scrollTop, setScrollTop] = (0, _react.useState)(0);
  const [isFetching, setIsFetching] = (0, _react.useState)(false);
  const {
    width
  } = (0, _reactResizeDetector.useResizeDetector)({
    targetRef: gridWrapperElementRef,
    refreshMode: 'throttle'
  });
  const [forceUpdateValue, forceUpdate] = (0, _useForceUpdate.default)();
  const [measurementStore] = (0, _react.useState)(createMeasurementStore());
  const [hasPendingMeasurements, setHasPendingMeasurements] = (0, _react.useState)(props.items.some(item => !!item && !measurementStore.has(item)));
  let getPositions;

  if (flexible && width !== null) {
    getPositions = (0, _fullWidthLayout.default)({
      gutter,
      cache: measurementStore,
      minCols,
      idealColumnWidth: columnWidth,
      width
    });
  } else {
    getPositions = (0, _defaultLayout.default)({
      cache: measurementStore,
      columnWidth,
      gutter,
      justify: 'center',
      minCols,
      rawItemCount: items.length,
      width
    });
  }

  const itemsToRender = items.filter(item => item && measurementStore.has(item));
  const itemsToMeasure = items.filter(item => item && !measurementStore.has(item)).slice(0, minCols);
  const positions = getPositions(itemsToRender);
  const measuringPositions = getPositions(itemsToMeasure);
  const height = positions.length ? Math.max(...positions.map(pos => pos.top + pos.height)) : 0;
  const measureContainer = (0, _react.useCallback)(() => {
    if (scrollContainerElementRef.current) {
      const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();

      if (scrollContainer) {
        containerHeightRef.current = (0, _scrollUtils.getElementHeight)(scrollContainer);
        const el = gridWrapperElementRef.current;

        if (el instanceof HTMLElement) {
          const relativeScrollTop = (0, _scrollUtils.getRelativeScrollTop)(scrollContainer);
          containerOffsetRef.current = el.getBoundingClientRect().top + relativeScrollTop;
        }
      }
    }
  }, [scrollContainerElementRef, gridWrapperElementRef]);

  const fetchMore = () => {
    if (loadItems && typeof loadItems === 'function') {
      setIsFetching(true);
      loadItems({
        from: items.length
      });
    }
  };

  const getStoneProps = (item, i, position, isMeasuring) => {
    let stoneProps = {};
    const {
      top,
      left,
      width
    } = position;
    const className = 'masonry-item';

    let style = _objectSpread({}, _styles.default.Masonry__Item);

    if (isMeasuring) {
      stoneProps.className = className + ' masonry-item-measuring';
      stoneProps.style = _objectSpread(_objectSpread(_objectSpread({}, style), _styles.default.Masonry__Item__Measuring), {}, {
        top: layoutNumberToCssDimension(top),
        left: layoutNumberToCssDimension(left),
        width: layoutNumberToCssDimension(width)
      });
    } else {
      stoneProps.className = className + ' masonry-item-mounted';
      stoneProps.style = _objectSpread(_objectSpread(_objectSpread({}, style), _styles.default.Masonry__Item__Mounted), {}, {
        top: 0,
        left: 0,
        transform: "translateX(".concat(left, "px) translateY(").concat(top, "px)"),
        WebkitTransform: "translateX(".concat(left, "px) translateY(").concat(top, "px)"),
        width: layoutNumberToCssDimension(width)
      });
    }

    stoneProps.ref = el => handleRefereceEle(el, item, isMeasuring);

    stoneProps['data-grid-item'] = i;
    return stoneProps;
  };

  const shouldVisible = position => {
    let isVisible;

    if (scrollContainer) {
      const containerHeight = containerHeightRef.current;
      const containerOffset = containerOffsetRef.current;
      const virtualBuffer = containerHeight * VIRTUAL_BUFFER_FACTOR;
      const offsetScrollPos = scrollTop - containerOffset;
      const viewportTop = virtualBoundsTop ? offsetScrollPos - virtualBoundsTop : offsetScrollPos - virtualBuffer;
      const viewportBottom = virtualBoundsBottom ? offsetScrollPos + containerHeight + virtualBoundsBottom : offsetScrollPos + containerHeight + virtualBuffer;
      isVisible = !(position.top + position.height < viewportTop || position.top > viewportBottom);
    } else {
      // if no scroll container is passed in, items should always be visible
      isVisible = true;
    }

    return isVisible;
  };

  const forceUpdateAsync = (0, _react.useCallback)((0, _throttle.default)(() => {
    forceUpdate();
  }), [forceUpdate]);
  const updateScrollPosition = (0, _react.useCallback)((0, _throttle.default)(() => {
    if (!scrollContainerElementRef.current) {
      return;
    }

    const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();

    if (!scrollContainer) {
      return;
    }

    setScrollTop((0, _scrollUtils.getScrollPos)(scrollContainer));
  }), [scrollContainerElementRef.current]);
  const measureContainerAsync = (0, _react.useCallback)((0, _debounce.default)(() => {
    measureContainer();
  }, 0), [measureContainer]);

  const handleRefereceEle = function handleRefereceEle(el, item) {
    let isMeasuring = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

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

  (0, _react.useEffect)(() => {
    measureContainer();
  }, [measureContainer]);
  (0, _react.useEffect)(() => {
    setIsFetching(false);
  }, [items]);
  (0, _react.useEffect)(() => {
    const hasPendingMeasurementsUpdated = items.some(item => !!item && !measurementStore.has(item));

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
  (0, _react.useEffect)(() => {
    measureContainerAsync();

    if (scrollContainerElementRef.current != null) {
      const scrollContainer = scrollContainerElementRef.current.getScrollContainerRef();

      if (scrollContainer) {
        setScrollTop((0, _scrollUtils.getScrollPos)(scrollContainer));
      }
    }
  }, [measureContainerAsync, width]);
  (0, _react.useEffect)(() => {
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
    height
  };
}