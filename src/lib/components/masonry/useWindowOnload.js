import React from "react";

export default function useWindowOnload() {
  const [onLoad, setOnLoad] = React.useState(false);
  React.useEffect(() => {
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