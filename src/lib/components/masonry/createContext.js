import React from "react";

export default function createContext(options = {}) {
  const {
    strict = true,
    errorMessage = "useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",
    name
  } = options;

  const Context = React.createContext(undefined);

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);

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
