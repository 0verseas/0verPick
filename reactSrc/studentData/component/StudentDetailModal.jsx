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
import Lightbox from 'react-images';

class UploadImgs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lightboxIsOpen: false,
			currentImage: 0
		};

		this.openLightbox = this.openLightbox.bind(this);
		this.closeLightbox = this.closeLightbox.bind(this);
		this.gotoNext = this.gotoNext.bind(this);
		this.gotoPrevious = this.gotoPrevious.bind(this);
	}

	openLightbox(index) {
		this.setState({
			currentImage: index,
			lightboxIsOpen: true
		});
	}

	closeLightbox() {
		this.setState({
			lightboxIsOpen: false
		})
	}

	gotoNext() {
		this.setState((prevState) => ({
			currentImage: +prevState.currentImage + 1
		}));
	}

	gotoPrevious() {
		this.setState((prevState) => ({
			currentImage: +prevState.currentImage - 1
		}));
	}

	render() {
		if(this.props.type == "diploma" || this.props.type == "transcripts") {
			return (
				<div>
					{
						this.props.imgs.map((val, i) => {
							return (
								<img
									className="ml-2 mr-2 mt-2 mb-2"
									src={`${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/${this.props.type}/${val}`}
									onClick={ () => this.openLightbox(i) }
									height="120"
									alt=""
								/>
							)
						})
					}

					<Lightbox
						images={ this.props.imgs.map((val, i) => ({ src: `${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/${this.props.type}/${val}` })) }
						isOpen={ this.state.lightboxIsOpen }
						onClose={ this.closeLightbox }
						currentImage={ this.state.currentImage }
						onClickNext={ this.gotoNext }
						onClickPrev={ this.gotoPrevious }
					/>
				</div>
			);
		}
		else{
			return (
				<div>
					{
						this.props.imgs.map((data, i) => {
							//console.log("this",data.description);
							return (

								data.files.map((val, i) => {
									return (
										<div>
											<CardHeader>{data.description}</CardHeader>
											<img
												className="ml-2 mr-2 mt-2 mb-2"
												src={`${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/types/${data.type_id}/${this.props.type}/${val}`}
												onClick={() => this.openLightbox(i)}
												height="120"
												alt=""
											/>
											<Lightbox
												images={ data.files.map((val, i) => ({ src: `${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/types/${data.type_id}/${this.props.type}/${val}` })) }
												isOpen={ this.state.lightboxIsOpen }
												onClose={ this.closeLightbox }
												currentImage={ this.state.currentImage }
												onClickNext={ this.gotoNext }
												onClickPrev={ this.gotoPrevious }
											/>
										</div>
									)
								})
							)
						})
					}


				</div>
			);
		}
	}
}

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
			transcripts: [], // 成績單
			applicationDoc: [] // 備審資料
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

			//console.log(data);
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


			this.setState({
				transcripts: data.student_transcripts || []
			});
		});

		window.API.getApplicationDoc({
			system: this.props.system,
			userID,
			deptID
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			//console.log('getApplicationDoc',data);
			this.setState({
				applicationDoc: data || []
			});
			console.log('this.state.applicationDoc1',this.state.applicationDoc)
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
								<UploadImgs
									imgs={this.state.diploma}
									system={this.props.system}
									deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
									userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
									type="diploma"
								/>
							</CardBody>
						</Card>
					</div>
					<div className="mb-2">
						<Card>
							<CardHeader>成績單資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								<UploadImgs
									imgs={this.state.transcripts}
									system={this.props.system}
									deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
									userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
									type="transcripts"
								/>
							</CardBody>
						</Card>
					</div>
					<div className="mb-2">
						<Card>
							<CardHeader>備審資料夾 <small>必審資料</small></CardHeader>
							<CardBody>
								<UploadImgs
									imgs={this.state.applicationDoc}
									system={this.props.system}
									deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
									userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
									type="admission-selection-application-document"
								/>
							</CardBody>
						</Card>
					</div>
				</ModalBody>
			</Modal>
		);
	}
}
