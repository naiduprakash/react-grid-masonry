## Responsive masonry component for React.js
![demo](https://github.com/naiduprakash/react-grid-masonry/blob/master/public/example.gif?raw=true "Optional Title")

### Install
Install using `npm install react-grid-masonry`

### Usage 

In a React app, use the Masonry component:  
`import Masonry from 'react-grid-masonry'`  
```import React from 'react';
import faker from 'faker';
import Masonry from 'react-grid-masonry';

let styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  input: {
    maxWidth: '100px',
    margin: '15px auto',
    padding: '5px 10px',
    borderRadius: '4px',
    border: '1px solid #dddddd',
  },
  item: {
    padding: '10px',
    borderRadius: '4px',
  },
};

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
    <div style={{ ...styles.item, backgroundColor: data.color }}>
      {itemIdx}:{data.text}
    </div>
  );
}

function App() {
  const [itemsCount, setItemsCount] = React.useState(5);
  const [items, setItems] = React.useState([]);

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (value > 0 && value < 200) {
      setItemsCount(value);
    }
  };

  React.useEffect(() => {
    let data = generateFakeData(itemsCount);
    setItems(data);
  }, [itemsCount]);

  return (
    <div style={styles.container}>
      <input
        style={styles.input}
        type="number"
        min="0"
        max="200"
        step="5"
        value={itemsCount}
        onChange={handleInputChange}
      />
      <Masonry comp={Item} uid="uuid" items={items} columnWidth={250} gutter={15} minCols={1} />
    </div>
  );
}

export default App;
```


#### Masonry props

| Name        | Description      
| ----------- | -----------      
| comp        | React Component
| items       | Array          
| columnWidth | Number         
| minCols     | Number         
| gutter      | Number         