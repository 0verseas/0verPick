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
		const src = `${window.getConfig().apiBase}/young-associate/2/students/${this.props.deptID}/${this.props.userID}/admission-files/${this.props.type}/file/${this.props.file}`;

		return (
			<div class="img-thumbnail non-img-file-thumbnail" style={{display: 'inline-block'}}>
				<a href={src} target="_blank">
					<i className={`fa fa-file-${this.props.fileType}-o`} aria-hidden="true"></i>
				</a>
			</div>
		);
	}
}

// 備審資料的作品集 component
class WorkFiles extends React.Component {
	constructor(props) {
		super(props);
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

	imgOrFile(file) {
		const fileType = this.getFileType(file.split('.')[1]);

		if (fileType === 'img') {
			return (
				<Image
					img={file}
					system={this.props.system}
					deptID={this.props.deptID}
					userID={this.props.userID}
					type={this.props.type}
					fileType={fileType}
				/>
			);
		} else {
			return (
				<File
					file={file}
					system={this.props.system}
					deptID={this.props.deptID}
					userID={this.props.userID}
					type={this.props.type}
					fileType={fileType}
				/>
			);
		}
	}

	render() {
		return (
			<div>
				<li>作品名稱：{this.props.name}</li>
				<li>個人參與的職位或項目：{this.props.position}</li>
				<li>術科類型：{this.props.work_type}</li>
				<li>備註：{this.props.memo ? this.props.memo : '無'}</li>
				<li>作品連結：
					<ul>
						{
							this.props.work_urls.map(url => {
								return (<li><a href={url} target="_blank">{url}</a></li>);
							})
						}
					</ul>
				</li>

				{/*<Card className="mb-2">*/}
					{/*<CardHeader>作品授權書</CardHeader>*/}
					{/*<CardBody>*/}
						{/*{*/}
							{/*this.props.authorization_files.map(file => {*/}
								{/*return this.imgOrFile(file);*/}
							{/*})*/}
						{/*}*/}
					{/*</CardBody>*/}
				{/*</Card>*/}

				<Card>
					<CardHeader>作品集檔案</CardHeader>
					<CardBody>
						{
							this.props.work_files.map(file => {
								return this.imgOrFile(file);
							})
						}
					</CardBody>
				</Card>
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
		let src = `${window.getConfig().apiBase}/young-associate/2/students/${this.props.deptID}/${this.props.userID}/admission-files/${this.props.type}/file/${this.props.img}`;

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
			remark: '', // 師培生註記
			email: '',
			id: '', // 報名序號
			name: '',
			engName: '',
			birth: '',
			resident: '', // 僑居地
			residentID: '', // 僑居地id
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
			identityDocs: {}, // 身份驗證
			hasIdentityDocs: {},
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

			// console.log(data);
			const student = data.students[0];

			let birthLimitMessage = '無';
			let genderLimitMessage = '無';
			let genderLimit = '';
			if(data.gender_limit != null){

				if(data.gender_limit != student.student_personal_data.gender){
					genderLimit = '不符合，只收';
				}
				genderLimitMessage = (data.gender_limit=='F')?genderLimit+'女性':genderLimit+'男性';
			}

			let birthLimit='';
			if(data.has_birth_limit){
				birthLimitMessage = false;

				let birthAfter =data.birth_limit_after;
				let birthBefore = data.birth_limit_before;

				if(birthAfter != null && Date.parse(birthAfter).valueOf()> Date.parse(student.student_personal_data.birthday)){
					birthLimit = '不符合，學生需';
				}

				if(birthBefore != null && Date.parse(birthBefore).valueOf()< Date.parse(student.student_personal_data.birthday)){
					birthLimit = '不符合，學生需';
				}

				if(birthAfter != null && birthBefore != null){
					birthLimitMessage =birthLimit+ '在 '+birthAfter+' 與 '+birthBefore+' 之間出生';
				} else if(birthAfter !=null){
					birthLimitMessage = birthLimit+'在 '+birthAfter+' 之後出生';
				} else if(birthBefore != null){
					birthLimitMessage = birthLimit+'在 '+birthBefore+' 之前出生';
				} else {
					birthLimitMessage = '無';
				}
			}

			let deptType = '';
			switch(data.is_extended_department){
				case 1:
					deptType = <span class="badge table-warning">重點產業系所</span>
					break;
				case 2:
					deptType = <span class="badge table-primary">國際專修部</span>
					break;
			}

			this.setState({
				no: student.student_data.overseas_student_id, // 僑生編號
				remark: student.student_data.overseas_student_id.toString().substr(0,2) == '06' ||
						student.student_data.overseas_student_id.toString().substr(0,2) == '07' ||
						student.student_data.overseas_student_id.toString().substr(0,2) == '08' ||
						student.student_data.overseas_student_id.toString().substr(0,2) == '09'? '師培計畫' : '', //師培生註記
				email: student.student_data.email,
				id: student.user_id.toString().padStart(6, 0), // 報名序號
				name: student.student_data.name,
				engName: student.student_data.eng_name,
				birth: student.student_data.birthday,
				resident: `${student.student_data.resident_location_data.continent}/${student.student_data.resident_location_data.country}`, // 國籍
				residentID: student.student_data.resident_location, // 僑居地id
				gender: student.student_data.gender === 'F' ? '女' : '男',
				tel: student.student_data.resident_phone,
				phone: student.student_data.resident_cellphone,
				gSchool: student.student_data.school_name, // 畢業學校
				gSchoolCountry: `${student.student_data.school_country_data.continent}/${student.student_data.school_country_data.country}`, // 學校國別
				aSchool: data.school.title, // 申請學校
				dept: data.title,
				deptType: deptType,
				disability: student.student_data.disability_level ? student.student_data.disability_level+student.student_data.disability_category : '無',
				birthLimitMessage:birthLimitMessage,//年齡限制文字訊息
				genderLimitMessage:genderLimitMessage,//性別限制文字訊息
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
			// console.log('this.props', this.props);
		});
	}

	// 判斷是 img 還是 file
	imgOrFile(file, type_name) {

		const fileType = this.getFileType(file.split('.')[1]);

		if (fileType === 'img') {
			return (
				<Image
					img={file}
					system={this.props.system}
					deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
					userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
					type={type_name}
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
					type={type_name}
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
								<th>僑生編號</th>
								<td >{ this.state.no }</td>
								<th>報名序號</th>
								<td>{ this.state.id }</td>
								<th>備註</th>
								<td colSpan={2}>{ this.state.remark}</td>
							</tr>
							<tr>
								<th>中文姓名</th>
								<td colSpan={2}>{ this.state.name }</td>
								<th>英文姓名</th>
								<td colSpan={2}>{ this.state.engName }</td>
							</tr>
							<tr>
								<th>出生日期</th>
								<td>{ this.state.birth }</td>
								<th>性別</th>
								<td>{ this.state.gender }</td>
								<th>僑居地</th>
								<td>{ this.state.resident }</td>
							</tr>
							<tr>
								<th>email</th>
								<td colSpan={2}>{ this.state.email }</td>
								<th>身障程度</th>
								<td colSpan={2}>{ this.state.disability }</td>
							</tr>
							<tr>
								<th>電話</th>
								<td colSpan={2}>{ this.state.tel.replace(/;/g, '-') }</td>
								<th>手機</th>
								<td colSpan={2}>{ this.state.phone.replace(/;/g, '-') }</td>
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
								<td colSpan={2}>{this.state.deptType } { this.state.dept }</td>
							</tr>
							<tr>
								<th>系所規定<br/>性別限制</th>
								<td colSpan={1}>{ this.state.genderLimitMessage}</td>
								<th>系所規定<br/>年齡限制</th>
								<td colSpan={3}>{ this.state.birthLimitMessage}</td>
							</tr>
						</tbody>
					</Table>
					<hr />

					{
						this.state.applicationDocs.map((doc, i) => {
							return (
								<div className="mb-2">
									<Card>
										<CardHeader>{doc.name} {(doc.type != 'proficiency') ? <span class="badge badge-danger">必繳</span> : <span class="badge badge-warning">選繳</span>}</CardHeader>
										<CardBody>
											{
												doc.files.map(file => {
													return this.imgOrFile(file, doc.type);
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
