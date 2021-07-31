import styles from './styles.js';
import FetchItems from './FetchItems.js';
import ScrollContainer from './ScrollContainer.js';
import useMasonry from './useMasonry';

export default function Masonry(props) {
  const { comp: Component, scrollContainer, virtualize = false } = props;
  const {
    width,
    height,
    positions,
    scrollTop,
    fetchMore,
    isFetching,
    shouldVisible,
    getStoneProps,
    itemsToRender,
    itemsToMeasure,
    gridWrapperRef,
    containerHeightRef,
    containerOffsetRef,
    scrollContainerRef,
    measuringPositions,
    updateScrollPosition,
    hasPendingMeasurements,
  } = useMasonry(props);

  let gridBody;
  if (width == null) {
    // When the width is empty (usually after a re-mount) render an empty
    // div to collect the width for layout
    gridBody = <div style={{ width: '100%' }} ref={gridWrapperRef} />;
  } else {
    // Full layout is possible
    gridBody = (
      <div style={{ width: '100%' }} ref={gridWrapperRef}>
        <div className="masonry" style={{ ...styles.Masonry, height, width }}>
          {itemsToRender.map((item, i) => {
            const position = positions[i];
            const isVisible = shouldVisible(position);

            const itemComponent = (
              <div key={`item-${i}`} {...getStoneProps(item, i, position)}>
                <Component data={item} itemIdx={i} isMeasuring={false} />
              </div>
            );

            return virtualize ? (isVisible && itemComponent) || null : itemComponent;
          })}
        </div>
        <div className="masonry" style={{ ...styles.Masonry, width }}>
          {itemsToMeasure.map((item, i) => {
            const refinedIndex = itemsToRender.length + i;
            let isMeasuring = true;
            return (
              <div
                key={`measuring-${refinedIndex}`}
                {...getStoneProps(item, refinedIndex, measuringPositions[i], isMeasuring)}
              >
                <Component data={item} itemIdx={refinedIndex} isMeasuring={isMeasuring} />
              </div>
            );
          })}
        </div>

        {scrollContainer && (
          <FetchItems
            containerHeight={containerHeightRef.current}
            fetchMore={fetchMore}
            isFetching={isFetching || hasPendingMeasurements}
            scrollHeight={height + containerOffsetRef.current}
            scrollTop={scrollTop}
          />
        )}
      </div>
    );
  }

  return scrollContainer ? (
    <ScrollContainer
      ref={scrollContainerRef}
      onScroll={updateScrollPosition}
      scrollContainer={scrollContainer}
    >
      {gridBody}
    </ScrollContainer>
  ) : (
    gridBody
  );
}
