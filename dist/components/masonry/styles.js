"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPreferedItemStyle = getPreferedItemStyle;
exports.getPreferedContainerStyle = getPreferedContainerStyle;
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const styles = {
  masonryContainer: {
    position: 'relative'
  },
  masonryItem: {
    position: 'absolute',
    transitionProperty: 'transform opacity width ',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    border: "1px solid #dddddd"
  }
};

function getPreferedItemStyle(props) {
  const {
    position,
    columnWidth,
    isWindowLoaded,
    hasPendingMeasurements
  } = props;
  let {
    top = 0,
    left = 0,
    width = columnWidth,
    height
  } = position || {};

  let preferedStyle = _objectSpread(_objectSpread({}, styles.masonryItem), {}, {
    top: 0,
    left: 0,
    transform: "translateX(0px) translateY(0px)",
    width: width,
    opacity: 0
  });

  if (isWindowLoaded && height && !hasPendingMeasurements) {
    preferedStyle = _objectSpread(_objectSpread({}, preferedStyle), {}, {
      transform: "translateX(".concat(left, "px) translateY(").concat(top, "px)"),
      opacity: 1
    });
  }

  return preferedStyle;
}

function getPreferedContainerStyle(props) {
  const {
    positions
  } = props;
  const height = positions.length ? Math.max(...positions.map(pos => pos.top + pos.height)) : 0;
  return _objectSpread(_objectSpread({}, styles.masonryContainer), {}, {
    height,
    width: '100%'
  });
}

var _default = styles;
exports.default = _default;