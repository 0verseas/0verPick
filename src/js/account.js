(async () => {
	/**
	 * priveate variable
	 */
	const _csvFieldMap = [
		'username',
		'password',
		'name',
		'email',
		'phone',
		'organization',
		'job_title',
		'status',
		'department_permissions',
		'two_year_tech_department_permissions',
		'master_permissions',
		'phd_permissions'
	];
	let _csvFile;
	let _csvAccounts = [];
	let _userList;
	let _deptList = null;
	var flag = 0;

	/**
	 * cache DOM
	 */
	const $AccountModal = $('.AccountModal');
	const $AccountList = $('.AccountList');
	const $DeptList = $('.DeptList');
	const $SelectedDeptList = $('.SelectedDeptList');
	const $importAccountBtn = $('.btn-importAccount');
	const $fileInput = $('.input-file');
	const $CSVModal = $('.CSVModal');
	const $importAccount = $('.importAccount');
	const $exportAccount = $('.exportAccount');

	/**
	 * init
	 */
	// check permission
	PubSub.on('user', (data) => {
		!data.school_reviewer.has_admin && window.history.back();
	});

	_userList = [...(await _getReviewers()), ...(await _getUserList())];
	_deptList = await _getDeptList();
	console.log(_userList);
	console.log(_deptList);
	_renderAccount(_userList);
	_renderDeptList(_deptList);


	/**
	 * bind event
	 */
	$AccountModal.on('show.bs.modal', _handleShowAccountModal);
	$AccountModal.on('click.submit', '.AccountModal__btn-submit', _handleAddUser);
	$AccountModal.on('click.selectAll', '.btn-selectAll', _handleSelectAll);
	$AccountModal.on('click.removeAll', '.btn-removeAll', _handleRemoveAll);
	$AccountList.on('click.delAccount', '.AccountItem__btn-del', _handleDelAccount);
	$DeptList.on('click.select', '.DeptList__item .btn-select', _handleSelectDept);
	$SelectedDeptList.on('click.remove', '.SelectedDeptList__item .btn-remove', _handleremoveDept);
	$importAccountBtn.on('click', _handleUpload);
	$fileInput.on('change', _handleFileChange);
	$CSVModal.on('click.submit', '.CSVModal__btn-submit', _handleSubmitSwitch);
	$CSVModal.on('hide.bs.modal', _handleCancelCSV);
	$exportAccount.on('click',_downloadList);
	$importAccount.on('click',_uploadList);
	/**
	 * event handler
	 */
	function _handleShowAccountModal(e) {
		// 判斷這個 modal 是要新增帳號還是編輯帳號
		const type = $(e.relatedTarget).data('type');
		$AccountModal.find('.AccountModal__input-modalType').val(type);
		$AccountModal.find('.AccountModal__title').text(type === 'C' ? '新增帳號' : '編輯帳號');
		$AccountModal.find('.AccountModal__btn-submit').text(type === 'C' ? '新增' : '更新');

		//TODO: reset input fields
		$AccountModal.find('.AccountModal__input-username').val('');
		$AccountModal.find('.AccountModal__input-name').val('');
		$AccountModal.find('.AccountModal__input-password').val('');
		$AccountModal.find('.AccountModal__input-organization').val('');
		$AccountModal.find('.AccountModal__input-jobTitle').val('');
		$AccountModal.find('.AccountModal__input-email').val('');
		$AccountModal.find('.AccountModal__input-phone').val('');
		$AccountModal.find('.AccountModal__input-status[value=1]').prop('checked', true);

		if (type === 'C') {
			//讓帳號欄位能輸入
			document.getElementById('AccountModal__input-username').disabled = false ;
			$AccountModal.find('.AccountModal__input-password').attr('placeholder', '密碼需至少8碼且大寫、小寫、數字或特殊符號至少兩種');
			_renderDeptList(_deptList);
			return;
		}

		// set old value
		$AccountModal.find('.AccountModal__input-password').attr('placeholder', '不更改則無須填寫，密碼需至少8碼且大寫、小寫、數字或特殊符號至少兩種');
		const id = $(e.relatedTarget).parents('.AccountItem').data('id');
		const userData = _userList.filter((val) => val.id === id)[0];
		console.log(userData);
		const userType = userData.editorOnly ? 'school_editor' : 'school_reviewer';
		_setUserData({
			inputText: {
				username: userData.username,
				name: userData.name,
				organization: userData[userType].organization,
				jobTitle: userData[userType].job_title,
				email: userData.email,
				phone: userData.phone,
				id: userData.id
			},
			status: !userData.editorOnly && !userData.school_reviewer.deleted_at,
			department_permissions: userData.editorOnly ? [] : userData.school_reviewer.department_permissions,
			master_permissions: userData.editorOnly ? [] : userData.school_reviewer.master_permissions,
			phd_permissions: userData.editorOnly ? [] : userData.school_reviewer.phd_permissions,
			two_year_tech_department_permissions: userData.editorOnly ? [] : userData.school_reviewer.two_year_tech_department_permissions
		});
	}

	function _handleDelAccount() {
		if (confirm('確定停用？')) {
			const userID = $(this).parents('.AccountItem').data('id');
			console.log(userID);
			window.API.disableUser(userID, (data) => {
				console.log(data);
				_updateUserList();
			});
		}
	}

	function _handleSelectDept() {
		const $oriItem = $(this).parents('.DeptList__item');
		const system = $(this).parents('.DeptList').data('system');
		const deptID = $oriItem.data('id');
		const title = $oriItem.find('.title').text();
		const $newItem = $(`
			<div class="pb-1 pl-1 pr-1 SelectedDeptList__item" data-id=${deptID}>
				<span class="title">${title}</span>
				<span class="btn-remove">
					<i class="fa fa-arrow-left d-none d-lg-inline" aria-hidden="true"></i>
					<i class="fa fa-arrow-up d-inline d-lg-none" aria-hidden="true"></i>
				</span>
			</div>
		`);

		$oriItem.remove();
		$(`.SelectedDeptList[data-system="${system}"]`).append($newItem);
	}

	function _handleremoveDept() {
		const $oriItem = $(this).parents('.SelectedDeptList__item');
		const system = $(this).parents('.SelectedDeptList').data('system');
		const deptID = $oriItem.data('id');
		const title = $oriItem.find('.title').text();
		const $newItem = $(`
			<div class="pb-1 pl-1 pr-1 DeptList__item" data-id=${deptID}>
				<span class="title">${title}</span>
				<span class="btn-select">
					<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
					<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
				</span>
			</div>
		`);

		$oriItem.remove();
		$(`.DeptList[data-system="${system}"]`).append($newItem);
	}

	function _handleSelectAll() {
		const system = $(this).data('system');
		$AccountModal.find(`.DeptList[data-system="${system}"] .DeptList__item .btn-select`).toArray().forEach((ele) => {
			_handleSelectDept.call(ele);
		});
	}

	function _handleRemoveAll() {
		const system = $(this).data('system');
		$AccountModal.find(`.SelectedDeptList[data-system="${system}"] .SelectedDeptList__item .btn-remove`).toArray().forEach((ele) => {
			_handleremoveDept.call(ele);
		});
	}

	function _handleUpload() {
		flag = 0;
		$fileInput.trigger('click');
	}

	function _handleFileChange() {
		const file = _csvFile = this.files[0];
		$fileInput.val('');
		const fileName = file.name;
		if (fileName.split('.').pop() !== 'csv') {
			alert('請匯入 .csv 檔');
			return;
		}

		// 需先讀成 binary string 以判斷編碼
		const fileReaderAsBinaryString = new FileReader();
		const fileReaderAsText = new FileReader();

		fileReaderAsBinaryString.onload = function (e) {
			// 偵測檔案編碼
			const encoding = window.jschardet.detect(e.target.result).encoding;
			// 使用偵測的編碼來讀取檔案成文字
			fileReaderAsText.readAsText(file, encoding);
		};

		fileReaderAsText.onload = function (e) {
			_renderCSVTable(fileName, e.target.result);
		};

		// 讀入檔案判斷編碼
		fileReaderAsBinaryString.readAsBinaryString(file);
	}

	//依據flag 數值做判斷要去呼叫哪個函式 0 ： 新增   1：覆蓋
	function _handleSubmitSwitch(){
		if(flag){
			_handleImportSubmit();
		} else {
			_handleSubmitCSV();
		}
	}

	function _handleSubmitCSV() {
		_csvAccounts.forEach((user, i) => {
			const data = {};
			user.forEach((val, fieldIndex) => {
				if (fieldIndex === 1) {
					// 密碼加密
					data[_csvFieldMap[fieldIndex]] = sha256(val);

					return;
				}

				if (fieldIndex === 7) {
					// 狀態
					if (val === '啟用') {
						data[_csvFieldMap[fieldIndex]] = true;
					} else {
						data[_csvFieldMap[fieldIndex]] = false;
					}

					return;
				}

				if (fieldIndex > 7 ) {
					// "學士班權限","二技班權限","碩士班權限","博士班權限"
					if (val.toLowerCase() === 'all') {
						data[_csvFieldMap[fieldIndex]] = 'all';
					} else {
						data[_csvFieldMap[fieldIndex]] = val === '' ? [] : val.split('#');
					}

					return;
				}

				data[_csvFieldMap[fieldIndex]] = val;
			});

			window.API.addUser(data, (err, data) => {
				if (err) {
					console.error(err);
					return;
				}

				_updateUserList();
				console.log(data);
			});
		});

		$CSVModal.modal('hide');
	}

	function _handleCancelCSV() {
		$fileInput.val('');
		_csvFile = '';
	}

	function _handleAddUser() {
		const type = $AccountModal.find('.AccountModal__input-modalType').val();
		const username = $AccountModal.find('.AccountModal__input-username').val();
		const name = $AccountModal.find('.AccountModal__input-name').val();
		const password = $AccountModal.find('.AccountModal__input-password').val();
		const organization = $AccountModal.find('.AccountModal__input-organization').val();
		const job_title = $AccountModal.find('.AccountModal__input-jobTitle').val();
		const email = $AccountModal.find('.AccountModal__input-email').val();
		const phone = $AccountModal.find('.AccountModal__input-phone').val();
		const status = $AccountModal.find('.AccountModal__input-status[value=1]').is(':checked');
		const department_permissions = $('.SelectedDeptList[data-system="bachelor"] .SelectedDeptList__item').toArray().map((ele) => $(ele).data('id'));
		const master_permissions = $('.SelectedDeptList[data-system="master"] .SelectedDeptList__item').toArray().map((ele) => $(ele).data('id'));
		const phd_permissions = $('.SelectedDeptList[data-system="phd"] .SelectedDeptList__item').toArray().map((ele) => $(ele).data('id'));
		const two_year_tech_department_permissions = $('.SelectedDeptList[data-system="twoyear"] .SelectedDeptList__item').toArray().map((ele) => $(ele).data('id'));
		const userID = $AccountModal.find('.AccountModal__input-id').val();
		if (!username) return alert('帳號不得為空');
		if (!name) return alert('用戶名稱不得為空');
		if (type === 'C' && !password) return alert('密碼不得為空');
		if (!organization) return alert('單位不得為空');
		if (!job_title) return alert('職稱不得為空');
		if (!email) return alert('MAIL 不得為空');
		if (!phone) return alert('TEL 不得為空');
		if (!checkPasswordComplex(password)) return alert('密碼複雜度不足');

		const data = {
			password: password === '' ? '' : sha256(password),
			username,
			name,
			organization,
			job_title,
			email,
			phone,
			status,
			department_permissions,
			master_permissions,
			phd_permissions,
			two_year_tech_department_permissions
		};

		type === 'C' && window.API.addUser(data, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			$AccountModal.modal('hide');
			_updateUserList();
			console.log(data);
		});

		type === 'U' && window.API.editUser({ ...data, userID }, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);
			$AccountModal.modal('hide');
			_updateUserList();
		});
	}

	/**
	 * private method
	 */
	function _renderAccount(list) {
		$AccountList.find('tbody').empty();
		list.forEach((val, i) => {
			const status = val.editorOnly ? '無審核權限' : (val.school_reviewer.deleted_at ? '停用' : '啟用');
			let org = '';
			let accountPermission = '';
			let deptPermission = '';
			if (!val.editorOnly) {
				org = encodeHtmlCharacters(val.school_reviewer.organization);  // 單位
				accountPermission = val.school_reviewer.has_admin ? '管理員' : '一般使用者';;
				deptPermission = [];
				!!val.school_reviewer.department_permissions.length && deptPermission.push('學士班');
				!!val.school_reviewer.master_permissions.length && deptPermission.push('碩士班');
				!!val.school_reviewer.phd_permissions.length && deptPermission.push('博士班');
				!!val.school_reviewer.two_year_tech_department_permissions.length && deptPermission.push('港二技');
				deptPermission = val.school_reviewer.has_admin ? '全部' : (!!deptPermission.length ? deptPermission.join(', ') : '無');
			}
			const encodedName = encodeHtmlCharacters(val.name);  // 用戶名稱（轉換過的）
			const encodeUsername = encodeHtmlCharacters(val.username); //帳號（轉換過得）

			$AccountList.find('tbody').append(`
				<tr class="AccountItem" data-id="${val.id}">
					<td class="text-warning clickable" data-toggle="modal" data-target=".AccountModal" data-type="U">
						<i class="fa fa-pencil" aria-hidden="true"></i>
					</td>
					<td class="text-danger clickable AccountItem__btn-del">
						<i class="fa fa-times" aria-hidden="true"></i>
					</td>
					<td class="AccountItem__username">${encodeUsername}</td>
					<td class="AccountItem__organization">${org}</td>
					<td class="AccountItem__name">${encodedName}</td>
					<td class="AccountItem__accountPermission">${accountPermission}</td>
					<td class="AccountItem__deptPermission">${deptPermission}</td>
					<td class="AccountItem__status ${status === '啟用' ? 'table-success' : 'table-danger'}">${status}</td>
				</tr>
			`);
		});
	}

	function _renderCSVTable(fileName, data) {
		$CSVModal.find('.CSVModal__title').text(`預覽匯入清單 ${fileName}`);
		$CSVModal.find('.CSVModal__body').empty();
		const rows = window.API.CSVToArray(data);
		const header = rows.shift();
		const fieldLength = header.length;
		if (fieldLength !== 12) {
			alert ('匯入之 csv 欄位數量有誤');
			return;
		}

		_csvAccounts = rows.filter((val, i) => {
			return val.length === fieldLength && !!val[0] && !!val[1] && !!val[2];
		});

		//匯入前檢查密碼複雜度
		for(let i = 0; i<_csvAccounts.length;i++){
			if(!checkPasswordComplex(_csvAccounts[i][1])){
				alert(' 密碼需至少8碼且大寫、小寫、數字或特殊符號至少兩種！！');
				return;
			}
		}
		console.log(_csvAccounts);

		// 渲染時要防止 XSS，但儲存的時候還是要依照使用者輸入的去儲存
		let new_csvAccounts = _csvAccounts.slice();  // 轉換過的資料
		for(let i = 0 ; i < _csvAccounts.length; i++){
			new_csvAccounts[i] = _csvAccounts[i].map(x => encodeHtmlCharacters(x));
		}

		let valueEmpty = 0;
		for(let i = 0;i<rows.length;i++){
			if(rows[i].length!=12){break;}
			if(!rows[i][0]||!rows[i][1]||!rows[i][2]){
				valueEmpty = 1;
				break;
			}
		}
		if(valueEmpty){
			alert('請確認是否有帳號、密碼、姓名欄位未填寫');
			window.location.reload();
			return;
		}

		$CSVModal.find('.CSVModal__body').html(`
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						${
							header.map((val, i) => `<th>${val}</th>`).join().replace(/,/g, '')
						}
					</tr>
				</thead>
				<tbody>
					${
						_csvAccounts.map((r, i) => {
							return `
								<tr>
									${
										new_csvAccounts[i].map((val, j) => `<td>${val}</td>`).join().replace(/,/g, '')
									}
								</tr>
							`;
						}).join().replace(/,/g, '')
					}
				</tbody>
			</table>
		`);

		$CSVModal.modal();
	}

	function _renderDeptList(list, permissions = {}) {
		$DeptList.empty();
		$SelectedDeptList.empty();
		const systems = [
			['departments', 'bachelor', 'department_permissions'],
			['master_departments', 'master', 'master_permissions'],
			['phd_departments', 'phd', 'phd_permissions'],
			['two_year_tech_departments', 'twoyear', 'two_year_tech_department_permissions']
		];

		systems.forEach((s) => {
			list[s[0]].forEach((val) => {
				if (permissions[s[2]] && permissions[s[2]].some((v) => (val.id + '') === (v.dept_id + ''))) {
					// 已被選取的系所
					$(`.SelectedDeptList[data-system="${s[1]}"]`).append(`
						<div class="pb-1 pl-1 pr-1 SelectedDeptList__item" data-id=${val.id}>
							<span class="title">${val.title}</span>
							<span class="btn-remove">
								<i class="fa fa-arrow-left d-none d-lg-inline" aria-hidden="true"></i>
								<i class="fa fa-arrow-up d-inline d-lg-none" aria-hidden="true"></i>
							</span>
						</div>
					`)
				} else {
					$(`.DeptList[data-system="${s[1]}"]`).append(`
						<div class="pb-1 pl-1 pr-1 DeptList__item" data-id="${val.id}">
							<span class="title">${val.title}</span>
							<span class="btn-select">
								<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
								<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
							</span>
						</div>
					`);
				}
			});
		});
	}

	// 有 editor 權限，沒有 reviewer 權限的使用者
	function _getUserList() {
		return new Promise((resolve, reject) => {
			window.API.getAvailableUsers((err, data) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				resolve(data.map((val, i) => {
					return Object.assign({}, val, { editorOnly: true });
				}));
			});
		})
	}

	// 有 reviewer 權限的使用者
	function _getReviewers() {
		return new Promise((resolve, reject) => {
			window.API.getReviewers((err, data) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				resolve(data);
			});
		})
	}

	function _getDeptList() {
		return new Promise((resolve, reject) => {
			window.API.getDepts((err, data) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				resolve(data);
			})
		});
	}

	// 編輯使用者的 modal，帶入現有資料
	function _setUserData(data) {

		//讓帳號欄位不能輸入
		document.getElementById('AccountModal__input-username').disabled = true ;

		// set basic info
		Object.keys(data.inputText).forEach((key, i) => {
			$AccountModal.find(`.AccountModal__input-${key}`).val(data.inputText[key]);
		});

		// set account status
		$AccountModal.find(`.AccountModal__input-status[value="${+data.status}"]`).prop('checked', true);

		// 可查看系所
		_renderDeptList(_deptList, {
			department_permissions: data.department_permissions,
			master_permissions: data.master_permissions,
			phd_permissions: data.phd_permissions,
			two_year_tech_department_permissions: data.two_year_tech_department_permissions
		});
	}

	//匯出reviewer_list_csv funciotn
	function _downloadList(){
		const baseUrl = window.getConfig().apiBase;
		window.location.href = `${baseUrl}/reviewers/user-list`;
	}

	//匯入reviewer_list_excel funciotn
	function _uploadList(){
		flag = 1;
		$fileInput.trigger('click');
	}

	//按下匯入後 將reviewer_list_csv資料處理後傳送至後端 function
	function _handleImportSubmit() {
		let data = {};
		//將reviewer_list_csv 轉換成二維陣列
		_csvAccounts.forEach((user, i) => {
			data[i] = {}; //宣告第二維陣列
			user.forEach((val, fieldIndex) => {
				//將資料按照key匯入
				if (fieldIndex === 1) {
					// 密碼加密
					data[i][_csvFieldMap[fieldIndex]] = sha256(val);

					return;
				}

				if (fieldIndex === 7) {
					// 狀態
					if (val === '啟用') {
						data[i][_csvFieldMap[fieldIndex]] = true;
					} else {
						data[i][_csvFieldMap[fieldIndex]] = false;
					}

					return;
				}

				if (fieldIndex > 7 ) {
					// "學士班權限","二技班權限","碩士班權限","博士班權限"
					if (val.toLowerCase() === 'all') {
						data[i][_csvFieldMap[fieldIndex]] = 'all';
					} else {
						data[i][_csvFieldMap[fieldIndex]] = val === '' ? [] : val.split('#');
					}

					return;
				}

				data[i][_csvFieldMap[fieldIndex]] = val;
			});
		});

		//呼叫API function 傳送資料到後端
		window.API.importUserList(data, (err, data) => {
			if (err) {
				console.error(err);
				return;
			} else {
				alert(data.messages[0]);
			}

			_updateUserList();
		});

		$CSVModal.modal('hide');
	}

	async function _updateUserList() {
		_userList = [...(await _getReviewers()), ...(await _getUserList())];
		_renderAccount(_userList);
	}

	// 轉換一些敏感字元避免 XSS
	function encodeHtmlCharacters(bareString) {
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;")
			;
	}

	// 確認密碼複雜度
	function checkPasswordComplex(input) {
		// 至少8碼且大寫、小寫、數字或特殊符號（數字那一排不含反斜線和豎線）至少兩種
		// ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=]).{8,}$
		const reg = /^((?=.*\d)(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)(?=.*[a-z])|(?=.*\d)(?=.*[~!@#$%^&*()_+\-=])|(?=.*[a-z])(?=.*[~!@#$%^&*()_+\-=])|(?=.*[A-Z])(?=.*[~!@#$%^&*()_+\-=])).{8,}$/;
		return !!reg.test(input);
	}

})();
