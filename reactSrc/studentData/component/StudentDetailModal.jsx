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
	}

	render() {
		return (
			<Modal isOpen={this.props.open} toggle={this.props.toggle} size="lg">
				<ModalHeader toggle={this.props.toggle}>個人基本資料</ModalHeader>
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
					<Row className="text-center mb-2">
						<Col>
							<Button color="primary" block onClick={this.props.toggle}>通過</Button>
						</Col>
					</Row>
					<Row className="text-center mb-3">
						<Col>
							<Input className="mb-1" type="textarea" name="text" id="exampleText" defaultValue="不通過原因" />
							<Button color="danger" block onClick={this.props.toggle}>不通過</Button>
						</Col>
					</Row>
				</ModalBody>
			</Modal>
		);
	}
}
