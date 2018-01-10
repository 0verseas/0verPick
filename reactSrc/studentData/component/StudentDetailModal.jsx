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

// 備審資料：檔案的 component
class File extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// 拿到檔案的連結
		const src = `${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/types/${this.props.type_id}/${this.props.type}/${this.props.file}`;

		return (
			<div class="img-thumbnail non-img-file-thumbnail" style={{display: 'inline-block'}}>
				<a href={src} target="_blank">
					<i className={`fa fa-file-${this.props.fileType}-o`} aria-hidden="true"></i>
				</a>
			</div>
		);
	}
}

// 圖片的 component
// 僅顯示一張圖片的 lightbox
class Image extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			lightboxIsOpen: false,
			currentImage: 0,
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
		// 判斷 src
		let src = `${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/${this.props.type}/${this.props.img}`;

		//  如果是備審資料，src 改成備審資料的
		if (this.props.type == 'admission-selection-application-document') {
			src = `${window.getConfig().apiBase}/reviewers/${this.props.system}/students/${this.props.deptID}/${this.props.userID}/types/${this.props.type_id}/${this.props.type}/${this.props.img}`;
		}
		// console.log(this.props.img);
		return (
			<div className="" style={{display: 'inline-block'}}>
				<img
					className="ml-2 mr-2 mt-2 mb-2 img-thumbnail"
					src={src}
					onClick={ () => this.openLightbox(0) }
					height="120"
					alt=""
				/>

				<Lightbox
					images={[{src: src}]}
					isOpen={ this.state.lightboxIsOpen }
					onClose={ this.closeLightbox }
					currentImage={ this.state.currentImage }
					onClickNext={ this.gotoNext }
					onClickPrev={ this.gotoPrevious }
				/>
			</div>
		);
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
			diplomas: [], // 學歷證明
			transcripts: [], // 成績單
			applicationDocs: [], // 備審資料
			disability: '', // 身障程度
		};

		this.renderStudentData = this.renderStudentData.bind(this);
		this.getStudentData = this.getStudentData.bind(this);
		this.imgOrFile = this.imgOrFile.bind(this);
		this.getFileType = this.getFileType.bind(this);
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
				dept: data.title,
				disability: student.student_personal_data.disability_level ? student.student_personal_data.disability_level+student.student_personal_data.disability_category : '無'
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
				diplomas: data.student_diploma || []
			});
			// console.log(this.state.diplomas);
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

			// console.log('getApplicationDoc',data);
			this.setState({
				applicationDocs: data || []
			});
			console.log('this.state.applicationDoc',this.state.applicationDocs);
			// console.log('this.props', this.props);
		});
	}

	// 判斷是 img 還是 file
	imgOrFile(file, type_id) {
		const fileType = this.getFileType(file.split('.')[1]);
		// console.log(fileType);
		if (fileType === 'img') {
			return (
				<Image
					img={file}
					system={this.props.system}
					deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
					userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
					type="admission-selection-application-document"
					type_id={type_id}
					fileType={fileType}
				/>
			);
		} else {
			return (
				<File
					file={file}
					system={this.props.system}
					deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
					userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
					type="admission-selection-application-document"
					type_id={type_id}
					fileType={fileType}
				/>
			);
		}
	}

	// 判斷是哪一種副檔名
	getFileType(fileNameExtension = '') {
		switch (fileNameExtension) {
			case 'doc':
			case 'docx':
				return 'word';

			case 'mp3':
				return 'audio';

			case 'mp4':
			case 'avi':
				return 'video';

			case 'pdf':
				return 'pdf';

			default:
				return 'img';
		}
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
								<th>email</th>
								<td colSpan={2}>{ this.state.email }</td>
								<th>身障程度</th>
								<td colSpan={2}>{ this.state.disability }</td>
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
									this.state.diplomas.map(diploma => {
										return (
											<Image
												img={diploma}
												system={this.props.system}
												deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
												userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
												type="diploma"
											/>
										);
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
									this.state.transcripts.map(transcript => {
										return (
											<Image
												img={transcript}
												system={this.props.system}
												deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
												userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
												type="transcripts"
											/>
										);
									})
								}
							</CardBody>
						</Card>
					</div>

					{
						this.state.applicationDocs.map((doc, i) => {
							return (
								<div className="mb-2">
									<Card>
										<CardHeader>{doc.description} {doc.required ? <small>必審資料</small> : ''}</CardHeader>
										<CardBody>
											{
												doc.files.map(file => {
													return this.imgOrFile(file, doc.type_id);
												})
											}
										</CardBody>
									</Card>
								</div>
							)
						})
					}

				</ModalBody>
			</Modal>
		);
	}
}
