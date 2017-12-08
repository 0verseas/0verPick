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
								<td></td>
								<th>email</th>
								<td colSpan={3}></td>
							</tr>
							<tr>
								<th>報名序號</th>
								<td></td>
								<th>姓名</th>
								<td></td>
								<th>英文姓名</th>
								<td></td>
							</tr>
							<tr>
								<th>出生日期</th>
								<td></td>
								<th>國籍</th>
								<td></td>
								<th>性別</th>
								<td></td>
							</tr>
							<tr>
								<th>電話</th>
								<td colSpan={2}></td>
								<th>手機</th>
								<td colSpan={2}></td>
							</tr>
							<tr>
								<th>畢業學校</th>
								<td colSpan={3}></td>
								<th>學校國別</th>
								<td></td>
							</tr>
							<tr>
								<th>申請學校</th>
								<td colSpan={2}></td>
								<th>系所</th>
								<td colSpan={2}></td>
							</tr>
						</tbody>
					</Table>
					<hr />
					<div className="mb-2">
						<Card>
							<CardHeader>學歷證明資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								<img src="https://fakeimg.pl/250x400/" height="120" alt="" />
							</CardBody>
						</Card>
					</div>
					<div className="mb-2">
						<Card>
							<CardHeader>成績單資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								<img src="https://fakeimg.pl/250x400/" height="120" alt="" />
							</CardBody>
						</Card>
					</div>
				</ModalBody>
			</Modal>
		);
	}
}
