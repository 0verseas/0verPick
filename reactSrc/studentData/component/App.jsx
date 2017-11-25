import React from 'react';
import {
	Row,
	Col,
	Button
} from 'reactstrap';

import StudentDataFilter from './StudentDataFilter.jsx';
import StudentDataTable from './StudentDataTable.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this._systemID = window.getSystem();
		this.state = {
			studentList: []
		};
	}

	componentDidMount() {
		// TODO: get student data
	}

	render() {
		const systemName = ['', '學士班', '港二技', '碩士班', '博士班'];
		return (
			<div>
				<Row>
					<Col>
						<h4 className="d-inline">{ `${systemName[this._systemID]}學生資料` }</h4>
						<Button className="aligb-top float-right" color="primary" size="sm">下載學生基本資料(Excel)</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<StudentDataFilter />
					</Col>
				</Row>
				<Row>
					<Col>
						<StudentDataTable />
					</Col>
				</Row>
			</div>
		)
	}
}
