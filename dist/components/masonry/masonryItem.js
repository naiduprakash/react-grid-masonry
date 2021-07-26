"use strict";

require("core-js/modules/es.object.assign.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MasonryItem;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function MasonryItem(props) {
  var _stoneRef$current, _stoneRef$current$get, _stoneRef$current$get2;

  const {
    children,
    updateSize
  } = props,
        restProps = _objectWithoutProperties(props, ["children", "updateSize"]);

  const stoneRef = _react.default.useRef();

  _react.default.useLayoutEffect(() => {
    let element = stoneRef.current;

    if (!element) {
      return;
    }

    function handler() {
      var _element$getBoundingC, _element$getBoundingC2;

      updateSize(element === null || element === void 0 ? void 0 : (_element$getBoundingC = element.getBoundingClientRect) === null || _element$getBoundingC === void 0 ? void 0 : (_element$getBoundingC2 = _element$getBoundingC.call(element)) === null || _element$getBoundingC2 === void 0 ? void 0 : _element$getBoundingC2.height);
    }

    handler();
    element.addEventListener('transitionend', handler);
    return () => {
      element && element.removeEventListener('transitionend', handler);
    };
  }, [updateSize]);

  return /*#__PURE__*/_react.default.createElement("div", _extends({
    dataheight: stoneRef === null || stoneRef === void 0 ? void 0 : (_stoneRef$current = stoneRef.current) === null || _stoneRef$current === void 0 ? void 0 : (_stoneRef$current$get = _stoneRef$current.getBoundingClientRect) === null || _stoneRef$current$get === void 0 ? void 0 : (_stoneRef$current$get2 = _stoneRef$current$get.call(_stoneRef$current)) === null || _stoneRef$current$get2 === void 0 ? void 0 : _stoneRef$current$get2.height,
    ref: stoneRef
  }, restProps), children);
}