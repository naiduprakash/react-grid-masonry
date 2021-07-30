const styles = {
  Masonry: {
    position: 'relative',
    height: '100%',
    margin: '0 auto',
  },

  Masonry__Item: {
    position: 'absolute',
  },

  Masonry__Item__Mounted: {
    transition: 'transform 0.2s',
  },
  Masonry__Item__Measuring: {
    visibility: 'hidden',
  },
};
export default styles;
