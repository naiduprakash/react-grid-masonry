"use strict";

require("core-js/modules/es.object.assign.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _useMasonry = _interopRequireDefault(require("./useMasonry"));

var _masonryItem = _interopRequireDefault(require("./masonryItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/**
 * TODO: use context and compound component pattern
 */
function Masonry(_ref) {
  let {
    children
  } = _ref,
      props = _objectWithoutProperties(_ref, ["children"]);

  const {
    comp: Component,
    items = [],
    columnWidth,
    minCols,
    gutter
  } = props;

  let containerRef = _react.default.useRef();

  const {
    measurementStore,
    getContainerProps,
    getStoneProps,
    forceUpdate
  } = (0, _useMasonry.default)({
    containerRef,
    gutter,
    minCols,
    columnWidth,
    items
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

  return /*#__PURE__*/_react.default.createElement("div", _extends({
    className: "grid-container",
    ref: containerRef
  }, getContainerProps()), items.map((item, itemIndex) => {
    return /*#__PURE__*/_react.default.createElement(_masonryItem.default, _extends({
      key: item.uuid,
      updateSize: height => updateStoneSize(height, item, itemIndex)
    }, getStoneProps(itemIndex)), /*#__PURE__*/_react.default.createElement(Component, {
      data: item,
      itemIdx: itemIndex,
      isMeasuring: false
    }));
  }));
}

var _default = /*#__PURE__*/_react.default.memo(Masonry);

exports.default = _default;