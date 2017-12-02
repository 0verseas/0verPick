(async () => {
	/**
	 * priveate variable
	 */
	let _csvFile;
	let _userList;
	let _deptList = null;

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

	/**
	 * init
	 */
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
	$AccountList.on('click.delAccount', '.AccountItem__btn-del', _handleDelAccount);
	$DeptList.on('click.select', '.DeptList__item .btn-select', _handleSelectDept);
	$SelectedDeptList.on('click.remove', '.SelectedDeptList__item .btn-remove', _handleremoveDept);
	$importAccountBtn.on('click', _handleUpload);
	$fileInput.on('change', _handleFileChange);
	$CSVModal.on('click.submit', '.CSVModal__btn-submit', _handleSubmitCSV);
	$CSVModal.on('hide.bs.modal', _handleCancelCSV);

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
			$AccountModal.find('.AccountModal__input-password').attr('placeholder', '');
			_renderDeptList(_deptList);
			return;
		}

		// set old value
		$AccountModal.find('.AccountModal__input-password').attr('placeholder', '不更改則無須填寫');
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
				phone: userData.phone
			},
			status: !userData.editorOnly && !userData.deleted_at,
			department_permissions: userData.editorOnly ? [] : userData.school_reviewer.department_permissions,
			master_permissions: userData.editorOnly ? [] : userData.school_reviewer.master_permissions,
			phd_permissions: userData.editorOnly ? [] : userData.school_reviewer.phd_permissions,
			two_year_tech_department_permissions: userData.editorOnly ? [] : userData.school_reviewer.two_year_tech_department_permissions
		});
	}

	function _handleDelAccount() {
		alert();
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

	function _handleUpload() {
		$fileInput.trigger('click');
	}

	function _handleFileChange() {
		const file = _csvFile = this.files[0];
		if (file.type !== 'text/csv') {
			alert('請匯入 .csv 檔');
			return;
		}

		const fileName = file.name;
		const fr = new FileReader();
		fr.onload = function () {
			_renderCSVTable(fileName, fr.result);
		};

		fr.readAsText(file);
	}

	function _handleSubmitCSV() {
		console.log(_csvFile);
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
		if (!username) return alert('帳號不得為空');
		if (!name) return alert('用戶名稱不得為空');
		if (type === 'C' && !password) return alert('密碼不得為空');
		if (!organization) return alert('單位不得為空');
		if (!job_title) return alert('職稱不得為空');
		if (!email) return alert('MAIL 不得為空');
		if (!phone) return alert('TEL 不得為空');

		const data = {
			username,
			name,
			password,
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

		type === 'U' && window.API.editUser(data, (err, data) => {
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
			const status = val.editorOnly ? '無審核權限' : (val.deleted_at ? '停用' : '啟用');
			let org = '';
			let accountPermission = '';
			let deptPermission = '';
			if (!val.editorOnly) {
				org = val.school_reviewer.organization;
				accountPermission = val.school_reviewer.has_admin ? '管理員' : '一般使用者';;
				deptPermission = [];
				!!val.school_reviewer.department_permissions.length && deptPermission.push('學士班');
				!!val.school_reviewer.master_permissions.length && deptPermission.push('碩士班');
				!!val.school_reviewer.phd_permissions.length && deptPermission.push('博士班');
				!!val.school_reviewer.two_year_tech_department_permissions.length && deptPermission.push('港二技');
				deptPermission = deptPermission.join(', ') || val.school_reviewer.has_admin ? '全部' : '無';
			}

			$AccountList.find('tbody').append(`
				<tr class="AccountItem" data-id="${val.id}">
					<td class="text-warning clickable" data-toggle="modal" data-target=".AccountModal" data-type="U">
						<i class="fa fa-pencil" aria-hidden="true"></i>
					</td>
					<td class="text-danger clickable AccountItem__btn-del">
						<i class="fa fa-times" aria-hidden="true"></i>
					</td>
					<td class="AccountItem__username">${val.username}</td>
					<td class="AccountItem__organization">${org}</td>
					<td class="AccountItem__name">${val.name}</td>
					<td class="AccountItem__accountPermission">${accountPermission}</td>
					<td class="AccountItem__deptPermission">${deptPermission}</td>
					<td class="AccountItem__status">${status}</td>
				</tr>
			`);
		});
	}

	function _renderCSVTable(fileName, data) {
		$CSVModal.find('.CSVModal__title').text(`預覽匯入清單 ${fileName}`);
		$CSVModal.find('.CSVModal__body').empty();
		const rows = window.API.CSVToArray(data);
		const header = rows.shift();
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
						rows.map((r, i) => {
							return `
								<tr>
									${
										rows[i].map((val, j) => `<td>${val}</td>`).join().replace(/,/g, '')
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
				if (permissions[s[2]] && permissions[s[2]].some((v) => +val.id === +v.dept_id)) {
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

	// 有 editor 權限，沒有 reviewer 全線的使用者
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

	async function _updateUserList() {
		_userList = [...(await _getReviewers()), ...(await _getUserList())];
		_renderAccount(_userList);
	}
})();
