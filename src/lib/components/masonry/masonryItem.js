import React from 'react';

export default function MasonryItem(props) {
  const { children, updateSize, ...restProps } = props;
  const stoneRef = React.useRef();

  React.useLayoutEffect(() => {
    let element = stoneRef.current;
    if (!element) {
      return;
    }

    function handler() {
      updateSize(element?.getBoundingClientRect?.()?.height);
    }
    handler();
    element.addEventListener('transitionend', handler);
    return () => {
      element && element.removeEventListener('transitionend', handler);
    };
  }, [updateSize]);

  return (
    <div
      dataheight={stoneRef?.current?.getBoundingClientRect?.()?.height}
      ref={stoneRef}
      {...restProps}
    >
      {children}
    </div>
  );
}
