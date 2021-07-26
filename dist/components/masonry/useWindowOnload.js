"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useWindowOnload;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useWindowOnload() {
  const [onLoad, setOnLoad] = _react.default.useState(false);

  _react.default.useEffect(() => {
    function handler() {
      setOnLoad(true);
    }

    window.addEventListener('load', handler);
    return () => {
      window.removeEventListener('load', handler);
    };
  });

  return onLoad;
}