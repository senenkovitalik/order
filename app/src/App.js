import React from 'react';
import { Link, Route } from 'react-router-dom';
import OrderChart from './components/OrderChart/OrderChart.js';
import Order from './components/Order/Order';
import './App.css';

function App() {
  return (
    <div className="App">
      <ul className={'hide-on-print'}>
        <li>
          <Link to='/order'>Order</Link>
        </li>
        <li>
          <Link to='/order_chart'>Order chart</Link>
        </li>
      </ul>

      <hr className={'hide-on-print'} />

      <Route path='/order' component={Order} />
      <Route path='/order_chart' component={OrderChart} />
    </div>
  );
}

export default App;
