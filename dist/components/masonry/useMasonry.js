"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useMasonry;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

var _styles = require("./styles");

var _usePositions = _interopRequireDefault(require("./usePositions"));

var _useWindowOnload = _interopRequireDefault(require("./useWindowOnload"));

var _measurementStore = _interopRequireDefault(require("./measurementStore"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function useMasonry(props) {
  const {
    columnWidth = 100,
    items = []
  } = props;

  const [measurementStore] = _react.default.useState(new _measurementStore.default());

  const isWindowLoaded = (0, _useWindowOnload.default)();
  const {
    positions,
    forceUpdate
  } = (0, _usePositions.default)(_objectSpread(_objectSpread({}, props), {}, {
    measurementStore
  }));
  const hasPendingMeasurements = items.some(item => !!item && !measurementStore.has(item));

  const getContainerProps = function getContainerProps() {
    let _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        {
      style = {}
    } = _ref,
        props = _objectWithoutProperties(_ref, ["style"]);

    let preferedStyle = (0, _styles.getPreferedContainerStyle)({
      positions
    });
    return _objectSpread({
      style: _objectSpread(_objectSpread({}, preferedStyle), style)
    }, props);
  };

  const getStoneProps = function getStoneProps(itemIndex) {
    let _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        {
      style = {}
    } = _ref2,
        props = _objectWithoutProperties(_ref2, ["style"]);

    let position = positions[itemIndex] || {};
    let data = {
      position,
      columnWidth,
      isWindowLoaded,
      hasPendingMeasurements
    };
    let preferedStyle = (0, _styles.getPreferedItemStyle)(data);
    return _objectSpread({
      style: _objectSpread(_objectSpread({}, preferedStyle), style)
    }, props);
  };

  return {
    measurementStore,
    getContainerProps,
    getStoneProps,
    forceUpdate
  };
}