(async () => {
	/**
	 * priveate variable
	 */
	let _csvFile;
	let _userList;

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
	_userList = await _getUserList();
	_renderAccount(_userList);
	

	/**
	 * bind event
	 */
	$AccountModal.on('show.bs.modal', _handleShowAccountModal);
	$AccountList.on('click.delAccount', '.AccountItem__btn-del', _handleDelAccount);
	$DeptList.on('click.select', '.DeptList__item .btn-select', _handleSelectDept);
	$SelectedDeptList.on('click.select', '.SelectedDeptList__item .btn-remove', _handleremoveDept);
	$importAccountBtn.on('click', _handleUpload);
	$fileInput.on('change', _handleFileChange);
	$CSVModal.on('click.submit', '.CSVModal__btn-submit', _handleSubmitCSV);
	$CSVModal.on('hide.bs.modal', _handleCancelCSV);
	/**
	 * event handler
	 */
	function _handleShowAccountModal(e) {
		const type = $(e.relatedTarget).data('type');
		$AccountModal.find('.AccountModal__input-modalType').val(type);
		$AccountModal.find('.AccountModal__title').text(type === 'C' ? '新增帳號' : '編輯帳號');
		$AccountModal.find('.AccountModal__btn-submit').text(type === 'C' ? '新增' : '更新');

		// TODO: set old value
	}

	function _handleDelAccount() {
		alert();
	}

	function _handleSelectDept() {
		const $oriItem = $(this).parents('.DeptList__item')
		const title = $oriItem.find('.title').text();
		const $newItem = $(`
			<div class="pb-1 pl-1 pr-1 SelectedDeptList__item">
				<span class="title">${title}</span>
				<span class="btn-remove">
					<i class="fa fa-arrow-left d-none d-lg-inline" aria-hidden="true"></i>
					<i class="fa fa-arrow-up d-inline d-lg-none" aria-hidden="true"></i>
				</span>
			</div>
		`);

		$oriItem.remove();
		$SelectedDeptList.append($newItem);
	}

	function _handleremoveDept() {
		const $oriItem = $(this).parents('.SelectedDeptList__item')
		const title = $oriItem.find('.title').text();
		const $newItem = $(`
			<div class="pb-1 pl-1 pr-1 DeptList__item">
				<span class="title">${title}</span>
				<span class="btn-select">
					<i class="fa fa-arrow-right d-none d-lg-inline" aria-hidden="true"></i>
					<i class="fa fa-arrow-down d-inline d-lg-none" aria-hidden="true"></i>
				</span>
			</div>
		`);

		$oriItem.remove();
		$DeptList.append($newItem);
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
			$AccountList.find('tbody').append(`
				<tr class="AccountItem">
					<td class="text-warning clickable" data-toggle="modal" data-target=".AccountModal" data-type="U">
						<i class="fa fa-pencil" aria-hidden="true"></i>
					</td>
					<td class="text-danger clickable AccountItem__btn-del">
						<i class="fa fa-times" aria-hidden="true"></i>
					</td>
					<td class="AccountItem__username">${val.username}</td>
					<td class="AccountItem__orgnization">TODO</td>
					<td class="AccountItem__name">${val.name}</td>
					<td class="AccountItem__accountPermission">TODO</td>
					<td class="AccountItem__deptPermission">TODO</td>
					<td class="AccountItem__status">${val.deleted_at ? '停用' : '啟用'}</td>
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

	function _getUserList() {
		return new Promise((resolve, reject) => {
			window.API.getAvailableUsers((err, data) => {
				if (err) {
					console.error(err);
					reject(err);
					return;
				}

				resolve(data);
			});
		})
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
