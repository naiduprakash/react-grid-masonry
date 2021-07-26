import React from 'react';
import Masonry from './lib/components/masonry';
import './App.css';

const initialItems = [
  { text: 'some text to render on the grid some text to render on the grid' },
  {
    text: 'some text to render on the grid some text to render on the grid some text to render on the grid',
  },
  { text: 'some text to render on the grid some text to render on the grid' },
  {
    text: 'some text to render on the grid some text to render on the grid some text to render on the grid some text to render on the grid',
  },
  { text: 'some text to render on the grid some text to render on the grid' },
  { text: 'some text to render on the grid some text to render on the grid' },
  {
    text: 'some text to render on the grid some text to render on the grid some text to render on the grid',
  },
  { text: 'some text to render on the grid some text to render on the grid' },
  {
    text: 'some text to render on the grid some text to render on the grid some text to render on the grid some text to render on the grid',
  },
  { text: 'some text to render on the grid some text to render on the grid' },
];

function Item({ data, itemIdx, isMeasuring }) {
  return <div>{data.text}</div>;
}

function App() {
  const [items, setItems] = React.useState(initialItems);
  return (
    <div>
      <Masonry comp={Item} uid="uuid" items={items} columnWidth={250} gutter={15} minCols={1} />
    </div>
  );
}

export default App;
