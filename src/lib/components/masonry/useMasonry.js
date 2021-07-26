import React from 'react';

import { getPreferedItemStyle, getPreferedContainerStyle } from './styles';
import usePositions from './usePositions';
import useWindowOnload from './useWindowOnload';
import MeasurementStore from './measurementStore';

export default function useMasonry(props) {
  const { columnWidth = 100, items = [] } = props;
  const [measurementStore] = React.useState(new MeasurementStore());

  const isWindowLoaded = useWindowOnload();
  const { positions, forceUpdate } = usePositions({ ...props, measurementStore });

  const hasPendingMeasurements = items.some((item) => !!item && !measurementStore.has(item));

  const getContainerProps = ({ style = {}, ...props } = {}) => {
    let preferedStyle = getPreferedContainerStyle({ positions });
    return {
      style: { ...preferedStyle, ...style },
      ...props,
    };
  };

  const getStoneProps = (itemIndex, { style = {}, ...props } = {}) => {
    let position = positions[itemIndex] || {};
    let data = { position, columnWidth, isWindowLoaded, hasPendingMeasurements };
    let preferedStyle = getPreferedItemStyle(data);

    return {
      style: { ...preferedStyle, ...style },
      ...props,
    };
  };

  return {
    measurementStore,
    getContainerProps,
    getStoneProps,
    forceUpdate,
  };
}
