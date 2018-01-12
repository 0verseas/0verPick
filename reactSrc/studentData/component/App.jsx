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
					order: '1',
					email: '',
					school
				}*/
			],
			studentDetailModalOpen: false,
			filter: {
				no: '',
				name: '',
				email: '',
				resident: '',
				order: '',
				school: '',
				dept: ''
			},
			selectedStudent: null
		};

		this.handleToggleStudentDetailModal = this.handleToggleStudentDetailModal.bind(this);
		this.handleShowDetail = this.handleShowDetail.bind(this);
		this.updateStudentData = this.updateStudentData.bind(this);
		this.handleFilter = this.handleFilter.bind(this);
		this.handleDownload = this.handleDownload.bind(this);
		this.parseList = this.parseList.bind(this);
	}

	componentDidMount() {
		this.updateStudentData();
	}

	handleShowDetail(userID, deptID) {
		this.setState({
			studentDetailModalOpen: true,
			selectedStudent: {
				userID,
				deptID
			}
		});
	}

	handleToggleStudentDetailModal() {
		this.setState((prevState) => {
			const s = {
				studentDetailModalOpen: !prevState.studentDetailModalOpen
			};

			if (!!prevState.studentDetailModalOpen) {
				s.selectedStudent = null;
			}

			return s;
		});
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
						no: student.student_misc_data.overseas_student_id,
						name: student.student_data.name,
						identity: this.identityMap[student.student_qualification_verify.identity],
						resident: student.student_personal_data.resident_location_data.country,
						order: student.order,
						email: student.student_data.email,
						school: student.student_personal_data.school_name,
						userID: student.user_id,
						deptID: student.dept_id
					});
				});
			});

			this.setState({
				studentList
			});
		});
	}

	handleFilter(filter) {
		this.setState({
			filter
		});
	}

	handleDownload() {
		window.location.href = `${window.getConfig().apiBase}/reviewers/${this.systemKeyMap[this.systemID]}/students?type=file`;
	}

	parseList() {
		if (!this.state.filter.no &&
			!this.state.filter.name &&
			!this.state.filter.email &&
			!this.state.filter.resident &&
			!this.state.filter.order &&
			!this.state.filter.school &&
			!this.state.filter.dept) {
			return this.state.studentList;
		}

		return this.state.studentList.filter((val, i) => {
			return Object.keys(this.state.filter).some((filterKey, i) => {
				if (!!this.state.filter[filterKey]) {
					if ((val[filterKey]+'').includes(this.state.filter[filterKey])) return true;
				}
			});
		});
	}

	render() {
		const systemName = ['', '學士班', '港二技', '碩士班', '博士班'];
		const parsedStudentList = this.parseList();
		return (
			<div>
				<Row className="mb-2">
					<Col>
						<h4 className="d-inline">{ `${systemName[this.systemID]}學生資料` }</h4>
						{!!this.state.studentList.length &&
							<Button className="aligb-top float-right" color="primary" size="sm" onClick={this.handleDownload}>下載學生基本資料(Excel)</Button>
						}
					</Col>
				</Row>
				{!!this.state.studentList.length ? (
					<div>
						<Row className="mb-2">
							<Col>
								<StudentDataFilter
									onFilter={this.handleFilter}
								/>
							</Col>
						</Row>
						<Row>
							<Col>
								<StudentDataTable
									studentList={parsedStudentList}
									onDetail={this.handleShowDetail}
								/>
							</Col>
						</Row>
						{!!this.state.selectedStudent &&
							<StudentDetailModal
								open={this.state.studentDetailModalOpen}
								toggle={this.handleToggleStudentDetailModal}
								selectedStudent={this.state.selectedStudent}
								system={this.systemKeyMap[this.systemID]}
							/>
						}
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
