import React from 'react';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Table,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	CardText,
	Row,
	Col,
	Input
} from 'reactstrap';

export default class StudentDetailModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			no: '', // 僑生編號
			email: '',
			id: '', // 報名序號
			name: '',
			engName: '',
			birth: '',
			resident: '', // 僑居地
			gender: '',
			tel: '',
			phone: '',
			gSchool: '', // 畢業學校
			gSchoolCountry: '', // 學校國別
			aSchool: '', // 申請學校
			dept: '',
			diploma: [], // 學歷證明
			transcripts: [] // 成績單
		};

		this.renderStudentData = this.renderStudentData.bind(this);
		this.getStudentData = this.getStudentData.bind(this);
	}

	componentDidMount() {
		if (!!this.props.selectedStudent) {
			this.renderStudentData(this.props.selectedStudent.userID, this.props.selectedStudent.deptID);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.selectedStudent ||
			nextProps.selectedStudent.userID !== this.props.selectedStudent.userID ||
			nextProps.selectedStudent.deptID !== this.props.selectedStudent.deptID) {
			this.renderStudentData(nextProps.selectedStudent.userID, nextProps.selectedStudent.deptID);
		}
	}

	renderStudentData(userID, deptID) {
		console.log(userID, deptID);
		this.getStudentData(userID, deptID);
	}

	getStudentData(userID, deptID) {
		window.API.getOneStudent({
			system: this.props.system,
			userID,
			deptID
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);
			const student = data.students[0];
			this.setState({
				no: student.student_misc_data.overseas_student_id, // 僑生編號
				email: student.student_data.email,
				id: student.user_id.toString().padStart(6, 0), // 報名序號
				name: student.student_data.name,
				engName: student.student_data.eng_name,
				birth: student.student_personal_data.birthday,
				resident: `${student.student_personal_data.resident_location_data.continent}/${student.student_personal_data.resident_location_data.country}`, // 國籍
				gender: student.student_personal_data.gender === 'f' ? '女' : '男',
				tel: student.student_personal_data.resident_phone,
				phone: student.student_personal_data.resident_cellphone,
				gSchool: student.student_personal_data.school_name, // 畢業學校
				gSchoolCountry: `${student.student_personal_data.school_country_data.continent}/${student.student_personal_data.school_country_data.country}`, // 學校國別
				aSchool: data.school.title, // 申請學校
				dept: data.title
			});
		});

		window.API.getStudentDiploma({
			system: this.props.system,
			userID,
			deptID
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);
			this.setState({
				diploma: data.student_diploma || []
			});
		});

		window.API.getStudentTranscripts({
			system: this.props.system,
			userID,
			deptID
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);
			this.setState({
				transcripts: data.student_transcripts || []
			});
		});
	}

	render() {
		return (
			<Modal isOpen={this.props.open} toggle={this.props.toggle} size="lg">
				<ModalHeader toggle={this.props.toggle}>學生詳細資料</ModalHeader>
				<ModalBody>
					<Table className="StudentDetailTable" bordered>
						<tbody>
							<tr>
								<th>港澳生編號</th>
								<td>{ this.state.no }</td>
								<th>email</th>
								<td colSpan={3}>{ this.state.email }</td>
							</tr>
							<tr>
								<th>報名序號</th>
								<td>{ this.state.id }</td>
								<th>姓名</th>
								<td>{ this.state.name }</td>
								<th>英文姓名</th>
								<td>{ this.state.engName }</td>
							</tr>
							<tr>
								<th>出生日期</th>
								<td>{ this.state.birth }</td>
								<th>僑居地</th>
								<td>{ this.state.resident }</td>
								<th>性別</th>
								<td>{ this.state.gender }</td>
							</tr>
							<tr>
								<th>電話</th>
								<td colSpan={2}>{ this.state.tel }</td>
								<th>手機</th>
								<td colSpan={2}>{ this.state.phone }</td>
							</tr>
							<tr>
								<th>畢業學校</th>
								<td colSpan={3}>{ this.state.gSchool }</td>
								<th>學校國別</th>
								<td>{ this.state.gSchoolCountry }</td>
							</tr>
							<tr>
								<th>申請學校</th>
								<td colSpan={2}>{ this.state.aSchool }</td>
								<th>系所</th>
								<td colSpan={2}>{ this.state.dept }</td>
							</tr>
						</tbody>
					</Table>
					<hr />
					<div className="mb-2">
						<Card>
							<CardHeader>學歷證明資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								{
									this.state.diploma.map((val, i) => {
										return (
											<img src={`${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.selectedStudent.deptID}/${this.props.selectedStudent.userID}/diploma/${val}`} height="120" alt="" />
										)
									})
								}
							</CardBody>
						</Card>
					</div>
					<div className="mb-2">
						<Card>
							<CardHeader>成績單資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								{
									this.state.transcripts.map((val, i) => {
										return (
											<img src={`${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.selectedStudent.deptID}/${this.props.selectedStudent.userID}/transcripts/${val}`} height="120" alt="" />
										)
									})
								}
							</CardBody>
						</Card>
					</div>
				</ModalBody>
			</Modal>
		);
	}
}
