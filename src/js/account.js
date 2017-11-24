(() => {
	/**
	 * priveate variable
	 */
	let _csvFile;

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
	function _renderAccount() {

	}

	function _renderCSVTable(fileName, data) {
		$CSVModal.find('.CSVModal__title').text(`預覽匯入清單 ${fileName}`);
		$CSVModal.find('.CSVModal__body').empty();
		const rows = data.split('\r');
		const header = rows.shift();
		$CSVModal.find('.CSVModal__body').html(`
			<table class="table table-bordered table-hover">
				<thead>
					<tr>
						${
							header.split(',').map((val, i) => `<th>${val}</th>`).join().replace(/,/g, '')
						}
					</tr>
				</thead>
				<tbody>
					${
						rows.map((r, i) => {
							return `
								<tr>
									${
										rows[i].split(',').map((val, j) => `<td>${val}</td>`).join().replace(/,/g, '')
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
})();
