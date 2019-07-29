import React from 'react';
import { Route, Link } from 'react-router-dom';
import OrderChart from './components/OrderChart/OrderChart.js';
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

function Order() {
  return 'Order';
}

export default App;
