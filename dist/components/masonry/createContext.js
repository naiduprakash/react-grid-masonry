"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createContext;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createContext() {
  let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  const {
    strict = true,
    errorMessage = "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",
    name
  } = options;

  const Context = /*#__PURE__*/_react.default.createContext(undefined);

  Context.displayName = name;

  function useContext() {
    const context = _react.default.useContext(Context);

    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = "ContextError";
      Error.captureStackTrace && Error.captureStackTrace(error, useContext);
      throw error;
    }

    return context;
  }

  return [Context.Provider, useContext, Context];
}