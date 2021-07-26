const styles = {
  masonryContainer: { position: 'relative' },
  masonryItem: {
    position: 'absolute',
    transitionProperty: 'transform opacity width ',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    border:"1px solid #dddddd"
  },
};

export function getPreferedItemStyle(props) {
  const { position, columnWidth, isWindowLoaded, hasPendingMeasurements } = props;

  let { top = 0, left = 0, width = columnWidth, height } = position || {};

  let preferedStyle = {
    ...styles.masonryItem,
    top: 0,
    left: 0,
    transform: `translateX(0px) translateY(0px)`,
    width: width,
    opacity: 0,
  };
  if (isWindowLoaded && height && !hasPendingMeasurements) {
    preferedStyle = {
      ...preferedStyle,
      transform: `translateX(${left}px) translateY(${top}px)`,
      opacity: 1,
    };
  }
  return preferedStyle;
}
export function getPreferedContainerStyle(props) {
  const { positions } = props;
  const height = positions.length ? Math.max(...positions.map((pos) => pos.top + pos.height)) : 0;

  return { ...styles.masonryContainer, height, width: '100%' };
}

export default styles;
