"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

const useStateWithCallback = initialValue => {
  const callbackRef = (0, _react.useRef)(null);
  const [value, setValue] = (0, _react.useState)(initialValue);
  (0, _react.useEffect)(() => {
    if (callbackRef.current) {
      callbackRef.current(value);
      callbackRef.current = null;
    }
  }, [value]);

  const setValueWithCallback = (newValue, callback) => {
    callbackRef.current = callback;
    return setValue(newValue);
  };

  return [value, setValueWithCallback];
};

var _default = useStateWithCallback;
exports.default = _default;