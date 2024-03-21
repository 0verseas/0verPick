const app = ( () => {
	const _config = window.getConfig();
	/**
	 * priveate variable
	 */

	/**
	 * cache DOM
	 */
	const $oyvtpTbody = $('#oyvtpTbody');

	const $oyvtpNavItem = $('#oyvtp-nav-item');

	// 下載某學制的審查結果回覆表
	const $oyvtpDownload = $('#oyvtp-download-review-form');

	// 確認並鎖定某學制的審查結果
	const $oyvtpCantComfirm = $('#oyvtp-cant-confirm');

	const $oyvtpCanComfirm = $('#oyvtp-can-confirm');

	// 確認並鎖定某學制的審查結果
	const $oyvtpConfirm = $('#oyvtp-confirm');

	// 最後送出資訊
	const $oyvtpConfirmBlock = $('#oyvtp-confirm-block');
	const $oyvtpConfirmBy = $('#oyvtp-confirm-by');
	const $oyvtpConfirmAt = $('#oyvtp-confirm-at');

	// 鎖定所有無人選填系所
	const $oyvtpLockAllNoStudent = $('#oyvtp-lock-all-no-student');

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	/**
	 * event handler
	 */
	function systemDownload(type_id, mode) {
		window.open(`${_config.apiBase}/young-associate/systems/${type_id}/departments/all/review-result?mode=${mode}`, `_blank`);
	}

	function systemConfirm(type_id) {

		// 問一下是否要鎖定學制
		const isConfirmed = confirm('確定要鎖定學制嗎？');
		if (!isConfirmed) {
			return;
		}

		window.API.confirmSystem(type_id, (err, system) => {
			if (err) {
				console.error(err);
				return;
			}
			window.location.reload();
			switch (system.type_id) {
				case 2:
					_renderSystems($oyvtpTbody, system);
					break;
			}
		});
	}

	function lockAllNoStudent(system_id) {
		window.API.lockAllNoStudent(system_id, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			switch (system_id) {
				case 2:
					_renderSystems($oyvtpTbody, data.oyvtp);
					break;
			}
		});
	}

	function _init() {
		// 取得所有學制的審查狀態
		window.API.getSystems((err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			// 判斷學制存不存在
			if (data.oyvtp) {
				_renderSystems($oyvtpTbody, data.oyvtp);

				$oyvtpConfirm.click(() =>{
					systemConfirm(2);
				});
				$oyvtpLockAllNoStudent.click(() => {
					lockAllNoStudent(2);
				});
			} else {
				$oyvtpNavItem.remove();
				document.getElementById("oyvtp").classList.remove('active');
				document.getElementById("oyvtp").classList.remove('show');
			}
		});

	}

	// 渲染某學制系所
	function _renderSystems($tbody, system = null) {
		const lock = system.review_confirmed_at;
		let deptsHtmlString = '';
		let canConfirm = true;
		let canDownload = false;

		if (system) {
			const depts = system.departments;

			for (let dept of depts) {
				if (!dept.review_confirmed_at) {
					canConfirm = false;
				}
				switch(dept.is_extended_department){
					case 1:
						dept.title = '<span class="badge table-warning">重點產業系所</span> ' + dept.title;
						break;
					case 2:
						dept.title = '<span class="badge table-primary">國際專修部</span> ' + dept.title;
						break;
				}
				deptsHtmlString += `
					<tr>
						<td>${dept.id}</td>
						<td>${dept.title}</td>
						<td>${dept.review_confirmed_at ? '<font color="green">已鎖定</font>' : dept.review_students_at ? '<font color="#F19510">已儲存</font>' : '<font color="red">未審查</font>'}</td>
						<td>${dept.student_order_reviewer ? encodeHtmlCharacters(dept.student_order_reviewer.name) : ''}</td>
						<td>${dept.review_students_at ? dateFns.format(dept.review_students_at, 'YYYY/MM/DD HH:mm:ss') : ''}</td>
					</tr>
				`;
			}
		}

		$tbody.html(deptsHtmlString);

		if (lock) {
			canConfirm = false;
			canDownload = true;
		}
		// 若學制已確認並鎖定，可以下載審核回覆表
		switch (system.type_id) {
			case 2:
				if (canDownload) {
					$oyvtpDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載四年制產學合作學士班審查結果回覆表';

					$oyvtpDownload.click(() => {
						systemDownload(2, 'formal');
					});
				} else {
					$oyvtpDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載四年制產學合作學士班審查結果回覆表（預覽版）';

					$oyvtpDownload.click(() => {
						systemDownload(2, 'preview');
					});
				}

				$oyvtpConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$oyvtpCantComfirm.hide();
					$oyvtpCanComfirm.show();
				}
				else{
					$oyvtpCanComfirm.hide();
				}
				if (lock) {
					$oyvtpConfirmBy.text(system.student_order_confirmer.name);
					$oyvtpConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$oyvtpConfirmBlock.show();
					$oyvtpCantComfirm.hide();
				}

				break;
		}


	}

	// 轉換一些敏感字元避免 XSS
	function encodeHtmlCharacters(bareString) {
		if (bareString === null) return '';
		return bareString.replace(/&/g, "&amp;")  // 轉換 &
			.replace(/</g, "&lt;").replace(/>/g, "&gt;")  // 轉換 < 及 >
			.replace(/'/g, "&apos;").replace(/"/g, "&quot;")  // 轉換英文的單雙引號
			.replace(/ /g, " &nbsp;")
			;
	}

	return {

	}

})();
