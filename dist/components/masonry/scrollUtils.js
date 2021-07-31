"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElementHeight = getElementHeight;
exports.getWindowScrollPos = getWindowScrollPos;
exports.getRelativeScrollTop = getRelativeScrollTop;
exports.getScrollHeight = getScrollHeight;
exports.getScrollPos = getScrollPos;

/**
 * Measuring scroll positions, element heights, etc is different between
 * different browsers and the window object vs other DOM nodes. These
 * utils abstract away these differences.
 */
function getElementHeight(element) {
  return element === window ? window.innerHeight : element.clientHeight;
}

function getWindowScrollPos() {
  if (window.scrollY !== undefined) {
    // Modern browser
    return window.scrollY;
  }

  if (document.documentElement && document.documentElement.scrollTop !== undefined) {
    // IE support.
    return document.documentElement.scrollTop;
  }

  return 0;
}

function getRelativeScrollTop(element) {
  return element === window ? getWindowScrollPos() : element.scrollTop - element.getBoundingClientRect().top;
}

function getScrollHeight(element) {
  return element === window && document.documentElement ? document.documentElement.scrollHeight : element.scrollHeight;
}

function getScrollPos(element) {
  return element === window ? getWindowScrollPos() : element.scrollTop;
}