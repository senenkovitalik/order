import React from 'react';
import Resolution from '../Resolution/Resolution.js';
import Sign from '../Sign/Sign.js';
import './OrderChart.css';

class OrderChart extends React.Component {
	
	render() {
		const days = [...Array(30)].map((x,i) => <th key={i+1}>{i+1}</th>);
		const users = {
			1: {
				name: 'Сененко В.',
				position: 'м-р',
				days: [4,8,12,16,20,24,28]
			},
			2: {
				name: 'Возенков С.',
				position: 'к-н',
				days: [2,6,10,14,18,22,26,30]
			},
			3: {
				name: 'Ковтун В.',
				position: 'ст. л-т',
				days: [3,7,11,15,19,23,27]
			},
			4: {
				name: 'Грушенков А.',
				position: 'л-т',
				days: [1,5,9,13,17,21,25,29]
			},
		};
		const s = <tr>
			<td>{1}</td>
			<td className="align-left">{users[1].position}</td>
			<td className="align-left">{users[1].name}</td>
			{
				[...Array(30)].map((x, i) => {
					const day = i + 1;
					return users[1].days.find(e => e === day)
						? <td key={day} className="used"></td>
						: <td key={day}></td>;
				})
			}
		</tr>;

		return (
			<div className="order-chart landscape">
				<Resolution />

				<br/>
				<br/>
				<br/>
				<br/>

				<div className="row row_centered">
					<p>ГРАФІК ЧЕРГУВАННЯ</p>
					<p>старших помічників начальника пункту управління системою зв'язку</p>
					<p>на червень 2019 року</p>
				</div>

				<br/>

				<table className="table">
					<thead>
						<tr>
							<th rowSpan="2" style={{width: 3+'%'}}>#</th>
							<th rowSpan="2" style={{width: 7+'%'}}>Військове звання</th>
							<th rowSpan="2" style={{width: 10+'%'}}>ПІБ</th>
							<th colSpan="30">Дата</th>
						</tr>
						<tr>
							{ days }
						</tr>
					</thead>
					<tbody>
						{s}

						<tr>
							<td>2</td>
							<td className="align-left">к-н</td>
							<td className="align-left">Возенков С.</td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
						</tr>

						<tr>
							<td>3</td>
							<td className="align-left">ст. л-т</td>
							<td className="align-left">Ковтун В.</td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td colSpan="7">відпустка</td>
						</tr>

						<tr>
							<td>4</td>
							<td className="align-left">л-т</td>
							<td className="align-left">Грушенков А.</td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
							<td className="used"></td>
							<td></td>
							<td></td>
						</tr>
					</tbody>
				</table>

				<br/>
				<br/>

				<Sign />
			</div>
		);
	};
}

export default OrderChart;