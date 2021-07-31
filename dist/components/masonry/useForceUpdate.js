"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useForceUpdate;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = require("react");

// Returning a new object reference guarantees that a before-and-after
//   equivalence check will always be false, resulting in a re-render, even
//   when multiple calls to forceUpdate are batched.
function useForceUpdate() {
  const [state, dispatch] = (0, _react.useState)(Object.create(null));
  const memoizedDispatch = (0, _react.useCallback)(() => {
    dispatch(Object.create(null));
  }, [dispatch]);
  return [state, memoizedDispatch];
}