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

// 身份驗證資料：檔案的 component
class IdentityFile extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		// 拿到檔案的連結
		const src = `${window.getConfig().apiBase}/reviewers/students/${this.props.userID}/${this.props.type}/item/${this.props.itemID}/file/${this.props.file}`;

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
					type="admission-selection-application-document"
					type_id={this.props.type_id}
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
					type="admission-selection-application-document"
					type_id={this.props.type_id}
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
			remark: '', // 師培生註記
			email: '',
			id: '', // 報名序號
			name: '',
			engName: '',
			birth: '',
			resident: '', // 僑居地
			residentId: '', // 僑居地id
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
			identityDocs: {
				'01' : 'ID-card',
				'02' : 'quit-school',
				'03' : 'overseas-stay-years',
				'04' : 'Taiwan-stay-dates',
				'05' : 'hk-or-mo-guarantee',
				'06' : 'head-shot',
				'07' : 'home-return-permit',
				'08' : 'change-of-name',
				'09' : 'diploma',
				'10' : 'scholl-transcript',
				'11' : 'authorize-check-diploma',
				'12' : 'olympia',
				'13' : 'placement-transcript',
				'14' : 'transcript-reference-table',
				'15' : 'hk-mo-relations-ordinance',
				'16' : 'tech-course-passed-proof',
				'17' : 'foreign-passport'}, // 身份驗證
			hasidentityDocs: {},
			disability: '', // 身障程度
		};

		this.renderStudentData = this.renderStudentData.bind(this);
		this.getStudentData = this.getStudentData.bind(this);
		this.getIdentityDocs = this.getIdentityDocs.bind(this);
		this.imgOrFile = this.imgOrFile.bind(this);
		this.getFileType = this.getFileType.bind(this);
		this.getIdentityFileURL = this.getIdentityFileURL.bind(this);
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
				no: student.student_misc_data.overseas_student_id, // 僑生編號
				remark: student.student_misc_data.overseas_student_id.toString().substr(0,2) == '06' ||
						student.student_misc_data.overseas_student_id.toString().substr(0,2) == '07' ||
						student.student_misc_data.overseas_student_id.toString().substr(0,2) == '08' ||
						student.student_misc_data.overseas_student_id.toString().substr(0,2) == '09'? '師培計畫' : '', //師培生註記
				email: student.student_data.email,
				id: student.user_id.toString().padStart(6, 0), // 報名序號
				name: student.student_data.name,
				engName: student.student_data.eng_name,
				birth: student.student_personal_data.birthday,
				resident: `${student.student_personal_data.resident_location_data.continent}/${student.student_personal_data.resident_location_data.country}`, // 國籍
				residentId: student.student_personal_data.resident_location, // 僑居地id
				gender: student.student_personal_data.gender === 'F' ? '女' : '男',
				tel: student.student_personal_data.resident_phone,
				phone: student.student_personal_data.resident_cellphone,
				gSchool: student.student_personal_data.school_name, // 畢業學校
				gSchoolCountry: `${student.student_personal_data.school_country_data.continent}/${student.student_personal_data.school_country_data.country}`, // 學校國別
				aSchool: data.school.title, // 申請學校
				dept: data.title,
				deptType: deptType,
				disability: student.student_personal_data.disability_level ? student.student_personal_data.disability_level+student.student_personal_data.disability_category : '無',
				// 副學士和高級文憑的調查（只香港 && 學士班有）
				HK_have_associate_degree_or_higher_diploma_graduated: student.student_personal_data.HK_have_associate_degree_or_higher_diploma_graduated===1 ? '是' : student.student_personal_data.HK_have_associate_degree_or_higher_diploma_graduated===0 ? '否' : '',  // 是否取得副學士或高級文憑畢業證書
				HK_have_AD_or_HD: student.student_personal_data.HK_have_AD_or_HD === 1 ? '副學士學位' : student.student_personal_data.HK_have_AD_or_HD === 2 ? '高級文憑' : '無',
				HK_AD_or_HD_class_name: student.student_personal_data.HK_AD_or_HD_class_name,
				HK_AD_or_HD_school_name: student.student_personal_data.HK_AD_or_HD_school_name,
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

		Object.keys(this.state.identityDocs).map((identity_doc_code, i) => {
			const value = this.state.identityDocs[identity_doc_code];
			this.getIdentityDocs(parseInt(userID), identity_doc_code, value);
		});
	}

	// 確認學上是否有相關的身份驗證檔案
	getIdentityDocs(userID, itemID, itemName) {
		window.API.getIdentityDocs({
			userID, // 報名序號
			itemID  // 學生上傳的身份驗證檔案碼
		}, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			data == 'true' ?
			this.setState((prevState) => ({
				hasidentityDocs: {
					...prevState.hasidentityDocs,
					[itemID]: data
				}
			}))
			: ''

			itemID == '08' ? 
			this.setState({
				change_of_name_code: itemID,
				change_of_name_file: itemName
			})
			: ''
		});
	}

	// 判斷是 img 還是 file
	imgOrFile(file, type_id) {
		// 作品集要另外處理
		if ([18, 38, 58, 78].includes(type_id)) {
			return (
				<WorkFiles
					system={this.props.system}
					deptID={this.props.selectedStudent ? this.props.selectedStudent.deptID : ''}
					userID={this.props.selectedStudent ? this.props.selectedStudent.userID : ''}
					type="admission-selection-application-document"
					type_id={type_id}
					name={file.name}
					position={file.position}
					work_type={file.work_type}
					memo={file.memo}
					work_urls={file.work_urls}
					authorization_files={file.authorization_files}
					work_files={file.work_files}
				/>
			);
		}

		const fileType = this.getFileType(file.split('.')[1]);

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

	// 取得學生上傳的身份驗證檔案 URL
	getIdentityFileURL(code, file) {
		return (
			<IdentityFile
				file={parseInt(this.props.selectedStudent.userID) + '_' + file + '.pdf'}
				userID={parseInt(this.props.selectedStudent.userID)}
				type="uploaded-file"
				itemID={code}
				fileType='pdf'
			/>
		);
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
								<td>{ this.state.no }</td>
								<th>備註</th>
								<td>{ this.state.remark}</td>
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
							{/*香港學士班的副學士或高級文憑調查*/}
							<tr>
								<th colSpan={2}>曾經修讀或正在修習<br />副學士或高級文憑？</th>
								<td>{ this.state.HK_have_AD_or_HD}</td>
								<th colSpan={2}>是否已取得副學士或<br />高級文憑畢業證書</th>
								<td>{ this.state.HK_have_associate_degree_or_higher_diploma_graduated}</td>
							</tr>
							<tr>
								<th>副學士或高級文憑學校</th>
								<td colSpan={2}>{ this.state.HK_AD_or_HD_school_name}</td>
								<th>副學士或高級文憑課程</th>
								<td colSpan={2}>{ this.state.HK_AD_or_HD_class_name}</td>
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
						// 判斷是否有改名契的檔案，有就顯示
						(this.state.hasidentityDocs['08'] && (this.state.residentId == '113' || this.state.residentId == '127')) ? 
                            <div className="mb-2">
                            <Card>
                            	<CardHeader>改名契 <small>簡章規定應繳文件</small></CardHeader>
                            	<CardBody>
                            			{
                            				this.getIdentityFileURL(this.state.change_of_name_code, this.state.change_of_name_file)
                            			}
                            	</CardBody>
                            </Card>
                            </div>
						: ''
					}

					{
						this.state.applicationDocs.map((doc, i) => {
							return (
								<div className="mb-2">
									<Card>
										<CardHeader>{doc.type.name} {doc.required ? <small>必審資料</small> : ''}</CardHeader>
										<CardBody>
											{
												(doc.paper != null) ? '以紙本寄送至貴系' :
												// 作品集不只是一堆檔案，要另外處理
												[18, 38, 58, 78].includes(doc.type_id) ? this.imgOrFile(doc.files, doc.type_id) : doc.files.map(file => {
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
