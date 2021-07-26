import React from 'react';

export default function useForceUpdate() {
  const [updateData, updateState] = React.useReducer((i) => i + 1, 0);
  const forceUpdate = React.useCallback(() => updateState(), []);
  return [updateData, forceUpdate];
}
