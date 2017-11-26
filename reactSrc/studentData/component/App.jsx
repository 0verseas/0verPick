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
		this.setState({
			studentList: [
				{
					dept: '經營管理系',
					no: '2345678',
					name: '林一二',
					identity: '港澳生',
					resident: '澳門',
					order: '1'
				},
				{dept: '經營管2理系', no: '2345678', name: '林4一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '經營管2理系', no: '2345678', name: '林5一二', identity: '港澳生', resident: '澳門', order: '1'},
				{dept: '經營管2理系', no: '2345678', name: '林一二', identity: '港澳生', resident: '澳門', order: '4'},
				{dept: '經營e管2理系', no: '2345678', name: '林64一二', identity: '港澳生', resident: '澳門', order: '3'},
				{dept: '經營管w2理系', no: '2345678', name: '林7一二', identity: '港澳生', resident: '澳門', order: '7'},
				{dept: '經營2管2理系', no: '2345678', name: '林8一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '經營t管2理系', no: '2345678', name: '林3一二', identity: '港澳生', resident: '澳門', order: '3'},
				{dept: '經營g管2理系', no: '2345678', name: '林2一二', identity: '港澳生', resident: '澳門', order: '4'},
				{dept: '經營sd管2理系', no: '2345678', name: '林7一二', identity: '港澳生', resident: '澳門', order: '1'},
				{dept: '經營管n2理系', no: '2345678', name: '林4一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '經營f管2理系', no: '2345678', name: '林8一二', identity: '港澳生', resident: '澳門', order: '2'}
			]
		});
	}

	render() {
		const systemName = ['', '學士班', '港二技', '碩士班', '博士班'];
		return (
			<div>
				<Row className="mb-2">
					<Col>
						<h4 className="d-inline">{ `${systemName[this._systemID]}學生資料` }</h4>
						<Button className="aligb-top float-right" color="primary" size="sm">下載學生基本資料(Excel)</Button>
					</Col>
				</Row>
				<Row className="mb-2">
					<Col>
						<StudentDataFilter />
					</Col>
				</Row>
				<Row>
					<Col>
						<StudentDataTable studentList={this.state.studentList} />
					</Col>
				</Row>
			</div>
		)
	}
}
