import React from 'react';
import {
	Row,
	Col,
	Button,
	Alert
} from 'reactstrap';

import StudentDataFilter from './StudentDataFilter.jsx';
import StudentDataTable from './StudentDataTable.jsx';
import StudentDetailModal from './StudentDetailModal.jsx';

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.systemID = window.getSystem();
		this.systemKeyMap = ['', 'department', 'two-year-tech', 'master', 'phd'];
		this.identityMap = ['', '港澳生', '港澳具外國國籍之華裔學生', '海外僑生', '在臺港澳生', '在臺僑生', '僑先部結業生'];
		this.state = {
			studentList: [
				/*{
					dept: '1經營管理系',
					no: '2345678',
					name: '林一二',
					identity: '港澳生',
					resident: '澳門',
					order: '1'
				}*/
			],
			studentDetailModalOpen: false
		};

		this.handleToggleStudentDetailModal = this.handleToggleStudentDetailModal.bind(this);
		this.handleShowDetail = this.handleShowDetail.bind(this);
		this.updateStudentData = this.updateStudentData.bind(this);
	}

	componentDidMount() {
		this.updateStudentData();
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

	updateStudentData() {
		window.API.getStudents(this.systemKeyMap[this.systemID],(err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);
			const studentList = [];
			data.forEach((dept) => {
				const deptName = dept.title;
				dept.students.forEach((student) => {
					studentList.push({
						dept: deptName,
						on: student.student_misc_data.overseas_student_id,
						name: student.student_data.name,
						identity: this.identityMap[student.student_qualification_verify.identity],
						resident: student.student_personal_data.resident_location_data.country,
						order: student.order
					});
				});
			});

			this.setState({
				studentList
			});
		});
	}

	render() {
		const systemName = ['', '學士班', '港二技', '碩士班', '博士班'];
		return (
			<div>
				<Row className="mb-2">
					<Col>
						<h4 className="d-inline">{ `${systemName[this.systemID]}學生資料` }</h4>
						{!!this.state.studentList.length &&
							<Button className="aligb-top float-right" color="primary" size="sm">下載學生基本資料(Excel)</Button>
						}
					</Col>
				</Row>
				{!!this.state.studentList.length ? (
					<div>
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
				) : (
					<Alert color="danger">
						無學生資料
					</Alert>
				)}
			</div>
		)
	}
}
