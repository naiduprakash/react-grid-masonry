"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = throttle;

require("core-js/modules/web.dom-collections.iterator.js");

/**
 * throttle limits the number of times a function can be called to a
 * given threshhold (100ms by default). The function is always called
 * on the leading and trailing edge.
 */
function throttle(fn) {
  let threshhold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  let last;
  let deferTimer;

  const throttled = function throttled() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    const now = Date.now();

    if (last !== undefined && now - last < threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn(...args);
      }, threshhold - (now - last));
    } else {
      last = now;
      fn(...args);
    }
  };

  throttled.clearTimeout = () => {
    if (deferTimer) {
      clearTimeout(deferTimer);
    }
  };

  return throttled;
}