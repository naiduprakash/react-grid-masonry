import React from 'react';
import faker from 'faker';
import './App.css';
// import Masonry from './lib/components/masonry-new';
import Masonry from './lib';

const colors = ['#D2B4DE', '#A9CCE3', '#AED6F1', '#A3E4D7', '#A2D9CE', '#A9DFBF', '#ABEBC6'];

function generateFakeData(num) {
  return Array.from({ length: num }).map(() => {
    let wordCount = faker.datatype.number(50);
    return {
      text: faker.random.words(wordCount),
      color: colors[faker.datatype.number(colors?.length - 1)],
    };
  });
}

function Item({ data, itemIdx }) {
  return (
    <div className="item" style={{ backgroundColor: data.color }}>
      {itemIdx}:{data.text}
    </div>
  );
}

function fetchBreakpoints() {
  return [
    { label: 'Auto(100%)', value: '100%' },
    { label: 'Mobile(small)', value: '320px' },
    { label: 'Mobile(medium)', value: '375px' },
    { label: 'Mobile(large)', value: '425px' },
    { label: 'Tablet', value: '768px' },
    { label: 'Laptop', value: '1024px' },
    { label: 'Laptop(large)', value: '1440px' },
    { label: 'Desktop/4k', value: '2560px' },
  ];
}

function App() {
  const masonryContainerRef = React.useRef();
  const [containerWidth, setContainerWidth] = React.useState('100%');
  const [items, setItems] = React.useState([]);
  const [gutterWidth, setGutterWidth] = React.useState(5);
  const [virtualBoundTop, setVirtualBoundTop] = React.useState(50);
  const [virtualBoundBottom, setVirtualBoundBottom] = React.useState(50);
  const [flexible, setFlexible] = React.useState(true);
  const [virtualize, setVirtualize] = React.useState(true);
  const [breakPoints, setBreakPoints] = React.useState([]);

  const handleIncrementItems = (count) => {
    let newItems = generateFakeData(count);
    setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const handleGutterWidthChange = (e) => {
    let value = e.target.value;
    if (value > 0 && value < 50) {
      setGutterWidth(e.target.value);
    }
  };

  const handleReset = () => {
    const resetItems = items.slice(0, 100);
    setItems(resetItems);
    setFlexible(true);
    setVirtualize(true);
    setGutterWidth(5);
    setContainerWidth('100%');
    setVirtualBoundTop(50);
    setVirtualBoundBottom(50);
    masonryContainerRef.current.scrollTop = 0;
  };

  React.useEffect(() => {
    handleIncrementItems(100);
    setBreakPoints(fetchBreakpoints());
  }, []);

  return (
    <div className="container">
      <div className="toolbar">
        <div className="section">
          Breakpoints:
          <div className="btn-group">
            <select value={containerWidth} onChange={(e) => setContainerWidth(e.target.value)}>
              {breakPoints.map((breakpoint) => {
                return <option value={breakpoint.value}>{breakpoint.label}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="section">Total Items: {items.length}</div>
        <div className="section">
          Gutter Width:
          <input type="number" min="0" value={gutterWidth} onChange={handleGutterWidthChange} />
        </div>
        <div className="section">
          Flexible:
          <input
            type="checkbox"
            name="flexible"
            value="flexible"
            checked={flexible}
            onChange={(e) => {
              setFlexible((prevState) => !prevState);
            }}
          />
        </div>
        <div className="section">
          Virtualize:
          <input
            type="checkbox"
            name="virtualize"
            value="virtualize"
            checked={virtualize}
            onChange={(e) => {
              setVirtualize((prevState) => !prevState);
            }}
          />
        </div>
        <div className="section">
          VirtualBound:
          <label htmlFor="">
            top
            <input
              type="number"
              name="virtualboundtop"
              value={virtualBoundTop}
              onChange={(e) => {
                setVirtualBoundTop(Number(e.target.value));
              }}
            />
          </label>
          <label htmlFor="">
            bottom
            <input
              type="number"
              name="virtualBoundBottom"
              value={virtualBoundBottom}
              onChange={(e) => {
                setVirtualBoundBottom(Number(e.target.value));
              }}
            />
          </label>
        </div>
        <button className="btn" onClick={handleReset}>
          Reset
        </button>
      </div>
      <div
        className="masonry-container"
        ref={masonryContainerRef}
        style={{ width: containerWidth }}
      >
        <Masonry
          comp={Item}
          items={items}
          columnWidth={250}
          gutterWidth={gutterWidth}
          minCols={1}
          flexible={flexible}
          virtualize={virtualize}
          virtualBoundsTop={virtualBoundTop}
          virtualBoundsBottom={virtualBoundBottom}
          scrollContainer={() => masonryContainerRef.current}
          loadItems={({ from }) => {
            handleIncrementItems(50);
          }}
        />
      </div>
    </div>
  );
}

export default App;
