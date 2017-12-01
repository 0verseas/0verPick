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
		
		if (type === 'C') {
			//TODO: reset input fields
			$AccountModal.find('.AccountModal__input-password').attr('placeholder', '');
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
				mail: userData.email,
				phone: userData.phone
			},
			status: !userData.editorOnly && !userData.deleted_at
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
					<td class="AccountItem__orgnization">${org}</td>
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
		const rows = _CSVToArray(data);
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

	function _renderDeptList(list) {
		list.departments.forEach((val, i) => {
			$('.DeptList[data-system="bachelor"]').append(`
				<div class="pb-1 pl-1 pr-1 DeptList__item" data-id="${val.id}">
					<span class="title">${val.title}</span>
					<span class="btn-select">
						<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
						<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
					</span>
				</div>
			`);
		});

		list.master_departments.forEach((val, i) => {
			$('.DeptList[data-system="master"]').append(`
				<div class="pb-1 pl-1 pr-1 DeptList__item" data-id="${val.id}">
					<span class="title">${val.title}</span>
					<span class="btn-select">
						<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
						<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
					</span>
				</div>
			`);
		});

		list.phd_departments.forEach((val, i) => {
			$('.DeptList[data-system="phd"]').append(`
				<div class="pb-1 pl-1 pr-1 DeptList__item" data-id="${val.id}">
					<span class="title">${val.title}</span>
					<span class="btn-select">
						<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
						<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
					</span>
				</div>
			`);
		});

		list.two_year_tech_departments.forEach((val, i) => {
			$('.DeptList[data-system="twoyear"]').append(`
				<div class="pb-1 pl-1 pr-1 DeptList__item" data-id="${val.id}">
					<span class="title">${val.title}</span>
					<span class="btn-select">
						<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
						<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
					</span>
				</div>
			`);
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
	}

	function _CSVToArray(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
		// Delimiters.
		"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
			// Create an array to hold our data. Give the array
			// a default empty first row.
		var arrData = [[]];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[1];
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"), "\"");
			} else {
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}
		// Return the parsed data.
		return (arrData);
	}
})();
