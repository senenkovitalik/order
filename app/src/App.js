import React from 'react';
import { Link, Route } from 'react-router-dom';
import OrderChart from './components/OrderChart/OrderChart.js';
import Order from './components/Order/Order';
import Unit from './components/Unit/Unit';
import './App.css';

function App() {
  const users = [
    {
      id: 'a43c',
      name: 'Сененко В.',
      rank: 12,
      duties: [
        { day: 5, duty: '011' },
        // { day: 8, duty: '101' },
        // { day: 11, duty: '111' },
      ]
    },
    {
      id: 'g234',
      name: 'Возенков С.',
      rank: 11,
      duties: []
    },
    {
      id: 'p04r',
      name: 'Ковтун В.',
      rank: 10,
      duties: [
        // { day: 1, duty: '111' },
        { day: 4, duty: '111' },
        { day: 7, duty: '111' },
      ]
    },
    {
      id: 'fgh6',
      name: 'Грушенков А.',
      rank: 9,
      duties: []
    }
  ];
  const unitName = 'Відділ автоматизованої системи передачі даних';

  return (
    <div className="App">
      <ul className={'hide-on-print'}>
        <li>
          <Link to='/unit'>Підрозіл</Link>
        </li>
        <li>
          <Link to='/order'>Витяг чергової зміни</Link>
        </li>
      </ul>

      <hr className={'hide-on-print'} />

      <Route path='/unit' render={() => <Unit unitName={unitName} users={users} />} />
      <Route path='/order' component={Order} />
      <Route path='/order_chart' component={OrderChart} />
    </div>
  );
}

export default App;
