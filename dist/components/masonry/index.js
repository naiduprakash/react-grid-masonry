"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Masonry;

require("core-js/modules/es.object.assign.js");

var _react = _interopRequireDefault(require("react"));

var _styles = _interopRequireDefault(require("./styles.js"));

var _FetchItems = _interopRequireDefault(require("./FetchItems.js"));

var _ScrollContainer = _interopRequireDefault(require("./ScrollContainer.js"));

var _useMasonry = _interopRequireDefault(require("./useMasonry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function Masonry(props) {
  const {
    comp: Component,
    scrollContainer,
    virtualize = false
  } = props;
  const {
    width,
    height,
    positions,
    scrollTop,
    fetchMore,
    isFetching,
    shouldVisible,
    getStoneProps,
    itemsToRender,
    itemsToMeasure,
    containerHeightRef,
    containerOffsetRef,
    gridWrapperElementRef,
    scrollContainerElementRef,
    measuringPositions,
    updateScrollPosition,
    hasPendingMeasurements
  } = (0, _useMasonry.default)(props);

  const renderItems = (item, i) => {
    const position = positions[i];
    const isVisible = shouldVisible(position);

    const itemComponent = /*#__PURE__*/_react.default.createElement("div", _extends({
      key: "item-".concat(i)
    }, getStoneProps(item, i, position)), /*#__PURE__*/_react.default.createElement(Component, {
      data: item,
      itemIdx: i,
      isMeasuring: false
    }));

    return virtualize ? isVisible && itemComponent || null : itemComponent;
  };

  const renderMeasuringItem = (item, i) => {
    const refinedIndex = itemsToRender.length + i;
    let isMeasuring = true;
    return /*#__PURE__*/_react.default.createElement("div", _extends({
      key: "measuring-".concat(refinedIndex)
    }, getStoneProps(item, refinedIndex, measuringPositions[i], isMeasuring)), /*#__PURE__*/_react.default.createElement(Component, {
      data: item,
      itemIdx: refinedIndex,
      isMeasuring: isMeasuring
    }));
  };

  let gridBody;

  if (!width) {
    // When the width is empty (usually after a re-mount) render an empty
    // div to collect the width for layout
    gridBody = /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%'
      },
      ref: gridWrapperElementRef
    });
  } else {
    gridBody = /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: '100%'
      },
      ref: gridWrapperElementRef
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "masonry",
      style: _objectSpread(_objectSpread({}, _styles.default.Masonry), {}, {
        height,
        width
      })
    }, itemsToRender.map(renderItems)), /*#__PURE__*/_react.default.createElement("div", {
      className: "masonry",
      style: _objectSpread(_objectSpread({}, _styles.default.Masonry), {}, {
        width
      })
    }, itemsToMeasure.map(renderMeasuringItem)), scrollContainer && /*#__PURE__*/_react.default.createElement(_FetchItems.default, {
      containerHeight: containerHeightRef.current,
      fetchMore: fetchMore,
      isFetching: isFetching || hasPendingMeasurements,
      scrollHeight: height + containerOffsetRef.current,
      scrollTop: scrollTop
    }));
  }

  return scrollContainer ? /*#__PURE__*/_react.default.createElement(_ScrollContainer.default, {
    ref: scrollContainerElementRef,
    onScroll: updateScrollPosition,
    scrollContainer: scrollContainer
  }, gridBody) : gridBody;
}