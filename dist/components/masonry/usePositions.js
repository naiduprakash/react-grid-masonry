"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePositions;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireDefault(require("react"));

var _reactResizeDetector = require("react-resize-detector");

var _useForceUpdate = _interopRequireDefault(require("./useForceUpdate"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usePositions(props) {
  const {
    items,
    columnWidth,
    minCols,
    gutter,
    measurementStore,
    containerRef
  } = props;

  const [positions, setPositions] = _react.default.useState([]);

  const [updatedData, forceUpdate] = (0, _useForceUpdate.default)();
  const {
    width
  } = (0, _reactResizeDetector.useResizeDetector)({
    targetRef: containerRef
  });

  const calculatePositions = () => {
    let positions = [];

    if (!width) {
      positions = items.map(() => (0, _utils.getPosition)());
    } else {
      let {
        columnCount,
        refinedColumnWidth
      } = (0, _utils.getRefinedColumnData)({
        width,
        columnWidth,
        minCols,
        gutter
      });
      let heights = new Array(columnCount).fill(0);
      positions = items.map((item, itemIndex) => {
        let height = measurementStore.get(item);

        if (height == null) {
          return (0, _utils.getPosition)({
            width: refinedColumnWidth
          });
        }

        let heightWithGutter = height + gutter;
        let col = (0, _utils.mindex)(heights);
        let top = heights[col];
        let left = col * refinedColumnWidth + gutter / 2;
        let width = refinedColumnWidth - gutter;
        heights[col] += heightWithGutter;
        return (0, _utils.getPosition)({
          top,
          left,
          width,
          height
        });
      });
    }

    setPositions(positions);
  };

  _react.default.useEffect(() => {
    calculatePositions();
  }, [updatedData, items, width]);

  return {
    positions,
    forceUpdate
  };
}