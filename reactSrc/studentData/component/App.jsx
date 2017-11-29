import React from 'react';
import {
	Row,
	Col,
	Button
} from 'reactstrap';

import StudentDataFilter from './StudentDataFilter.jsx';
import StudentDataTable from './StudentDataTable.jsx';
import StudentDetailModal from './StudentDetailModal.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this._systemID = window.getSystem();
		this.state = {
			studentList: [],
			studentDetailModalOpen: false
		};

		this.handleToggleStudentDetailModal = this.handleToggleStudentDetailModal.bind(this);
		this.handleShowDetail = this.handleShowDetail.bind(this);
	}

	componentDidMount() {
		// TODO: get student data
		this.setState({
			studentList: [
				{
					dept: '1經營管理系',
					no: '2345678',
					name: '林一二',
					identity: '港澳生',
					resident: '澳門',
					order: '1'
				},
				{dept: '2經營管2理系', no: '2345678', name: '林4一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '3經營管2理系', no: '2345678', name: '林5一二', identity: '港澳生', resident: '澳門', order: '1'},
				{dept: '4經營管2理系', no: '2345678', name: '林一二', identity: '港澳生', resident: '澳門', order: '4'},
				{dept: '5經營e管2理系', no: '2345678', name: '林64一二', identity: '港澳生', resident: '澳門', order: '3'},
				{dept: '6經營管w2理系', no: '2345678', name: '林7一二', identity: '港澳生', resident: '澳門', order: '7'},
				{dept: '7經營2管2理系', no: '2345678', name: '林8一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '8經營t管2理系', no: '2345678', name: '林3一二', identity: '港澳生', resident: '澳門', order: '3'},
				{dept: '9經營g管2理系', no: '2345678', name: '林2一二', identity: '港澳生', resident: '澳門', order: '4'},
				{dept: '10經營sd管2理系', no: '2345678', name: '林7一二', identity: '港澳生', resident: '澳門', order: '1'},
				{dept: '11經營管n2理系', no: '2345678', name: '林4一二', identity: '港澳生', resident: '澳門', order: '2'},
				{dept: '12經營f管2理系', no: '2345678', name: '林8一二', identity: '港澳生', resident: '澳門', order: '2'}
			]
		});
	}

	handleShowDetail() {
		// TODO: get student detail data
		this.setState({
			studentDetailModalOpen: true
		});
	}

	handleToggleStudentDetailModal() {
		this.setState((prevState) => ({
			studentDetailModalOpen: !prevState.studentDetailModalOpen
		}));
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
						<StudentDataTable
							studentList={this.state.studentList}
							onDetail={this.handleShowDetail}
						/>
					</Col>
				</Row>
				<StudentDetailModal
					open={this.state.studentDetailModalOpen}
					toggle={this.handleToggleStudentDetailModal}
				/>
			</div>
		)
	}
}
