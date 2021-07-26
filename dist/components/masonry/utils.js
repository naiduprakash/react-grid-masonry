"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
exports.getPosition = getPosition;
exports.getRefinedColumnData = getRefinedColumnData;
exports.mindex = exports.layoutNumberToCssDimension = void 0;

require("core-js/modules/web.dom-collections.iterator.js");

const layoutNumberToCssDimension = n => n !== Infinity ? n : undefined;

exports.layoutNumberToCssDimension = layoutNumberToCssDimension;

const mindex = arr => {
  return arr.indexOf(Math.min(...arr)) || 0;
};

exports.mindex = mindex;

function debounce(fn) {
  let threshhold = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  let deferTimer = null;

  const debounced = function debounced() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (deferTimer) {
      clearTimeout(deferTimer);
    }

    deferTimer = setTimeout(() => {
      deferTimer = null;
      fn(...args);
    }, threshhold);
  };

  debounced.clearTimeout = () => {
    if (deferTimer) {
      clearTimeout(deferTimer);
    }
  };

  return debounced;
}

function getPosition(props) {
  let {
    top = Infinity,
    left = Infinity,
    width = Infinity,
    height = Infinity
  } = props || {};
  return {
    top,
    left,
    width,
    height
  };
}

function getRefinedColumnData(props) {
  let {
    minCols,
    width,
    columnWidth,
    gutter
  } = props;
  const colguess = Math.floor(width / columnWidth);
  const columnCount = Math.max(Math.floor((width - colguess * gutter) / columnWidth), minCols);
  const refinedColumnWidth = Math.floor(width / columnCount);
  return {
    columnCount,
    refinedColumnWidth
  };
}