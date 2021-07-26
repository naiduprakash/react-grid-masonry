"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useForceUpdate;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function useForceUpdate() {
  const [updateData, updateState] = _react.default.useReducer(i => i + 1, 0);

  const forceUpdate = _react.default.useCallback(() => updateState(), []);

  return [updateData, forceUpdate];
}