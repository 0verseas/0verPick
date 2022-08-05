const app = ( () => {
	const _config = window.getConfig();
	/**
	 * priveate variable
	 */

	/**
	 * cache DOM
	 */
	const $bachelorTbody = $('#bachelorTbody');
	const $twoYearTechTbody = $('#twoYearTechTbody');
	const $masterTbody = $('#masterTbody');
	const $phdTbody = $('#phdTbody');
	const $youngAssociateTbody = $('#youngAssociateTbody');

	const $bachelorNavItem = $('#bachelor-nav-item');
	const $twoYearTechNavItem = $('#two-year-tech-nav-item');
	const $masterNavItem = $('#master-nav-item');
	const $phdNavItem = $('#phd-nav-item');
	const $youngAssociateNavItem = $('#young-associate-nav-item');

	// 下載某學制的審查結果回覆表
	const $bachelorDownload = $('#bachelor-download-review-form');
	const $twoYearTechDownload = $('#two-year-tech-download-review-form');
	const $masterDownload = $('#master-download-review-form');
	const $phdDownload = $('#phd-download-review-form');
	const $youngAssociateDownload = $('#young-associate-download-review-form');

	// 確認並鎖定某學制的審查結果
	const $bachelorCantComfirm = $('#bachelor-cant-confirm');
	const $twoYearTechCantConfirm = $('#two-year-tech-cant-confirm');
	const $masterCantConfirm = $('#master-cant-confirm');
	const $phdCantConfirm = $('#phd-cant-confirm');
	const $youngAssociateCantConfirm = $('#young-associate-cant-confirm');

	const $bachelorCanComfirm = $('#bachelor-can-confirm');
	const $twoYearTechCanConfirm = $('#two-year-tech-can-confirm');
	const $masterCanConfirm = $('#master-can-confirm');
	const $phdCanConfirm = $('#phd-can-confirm');
	const $youngAssociateCanConfirm = $('#young-associate-can-confirm');

	// 確認並鎖定某學制的審查結果
	const $bachelorConfirm = $('#bachelor-confirm');
	const $twoYearTechConfirm = $('#two-year-tech-confirm');
	const $masterConfirm = $('#master-confirm');
	const $phdConfirm = $('#phd-confirm');
	const $youngAssociateConfirm = $('#young-associate-confirm');

	// 最後送出資訊
	const $bachelorConfirmBlock = $('#bachelor-confirm-block');
	const $bachelorConfirmBy = $('#bachelor-confirm-by');
	const $bachelorConfirmAt = $('#bachelor-confirm-at');

	const $twoYearTechConfirmBlock = $('#two-year-tech-confirm-block');
	const $twoYearTechConfirmBy = $('#two-year-tech-confirm-by');
	const $twoYearTechConfirmAt = $('#two-year-tech-confirm-at');

	const $masterConfirmBlock = $('#master-confirm-block');
	const $masterConfirmBy = $('#master-confirm-by');
	const $masterConfirmAt = $('#master-confirm-at');

	const $phdConfirmBlock = $('#phd-confirm-block');
	const $phdConfirmBy = $('#phd-confirm-by');
	const $phdConfirmAt = $('#phd-confirm-at');

	const $youngAssociateConfirmBlock = $('#young-associate-confirm-block');
	const $youngAssociateConfirmBy = $('#young-associate-confirm-by');
	const $youngAssociateConfirmAt = $('#young-associate-confirm-at');

	// 鎖定所有無人選填系所
	const $bachelorLockAllNoStudent = $('#bachelor-lock-all-no-student');
	const $masterLockAllNoStudent = $('#master-lock-all-no-student');
	const $phdLockAllNoStudent = $('#phd-lock-all-no-student');
	const $twoYearTechLockAllNoStudent = $('#two-year-tech-lock-all-no-student');
	const $youngAssociateLockAllNoStudent = $('#young-associate-lock-all-no-student');

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
		window.open(`${_config.apiBase}/reviewers/systems/${type_id}/departments/all/review-result?mode=${mode}`, `_blank`);
	}

	function systemConfirm(type_id) {

		// 問一下是否要鎖定學制
		swal({
			title: '確定要鎖定學制嗎？',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: '確定',
			cancelButtonText: '取消',
		}).then(function () { // 確定後資料再解鎖
			window.API.confirmSystem(type_id, (err, system) => {
				if (err) {
					console.error(err);
					return;
				}
				window.location.reload();
				switch (system.type_id) {
					case 1:
						_renderSystems($bachelorTbody, system);
						break;
					case 2:
						_renderSystems($twoYearTechTbody, system);
						break;
					case 3:
						_renderSystems($masterTbody, system);
						break;
					case 4:
						_renderSystems($phdTbody, system);
						break;
					case 5:
						_renderSystems($youngAssociateTbody, system);
						break;
				}
			});
		}, function (dismiss) { // 取消則什麼也不發生
			return;
		});
	}

	function lockAllNoStudent(system_id) {
		window.API.lockAllNoStudent(system_id, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			switch (system_id) {
				case 1:
					_renderSystems($bachelorTbody, data.bachelor);
					break;
				case 2:
					_renderSystems($twoYearTechTbody, data.two_year_tech);
					break;
				case 3:
					_renderSystems($masterTbody, data.master);
					break;
				case 4:
					_renderSystems($phdTbody, data.phd);
					break;
				case 5:
					_renderSystems($youngAssociateTbody, data.young_associate);
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
			if (data.bachelor) {
				_renderSystems($bachelorTbody, data.bachelor);

				$bachelorConfirm.click(() =>{
					systemConfirm(1);
				});
				$bachelorLockAllNoStudent.click(() => {
					lockAllNoStudent(1);
				});
			} else {
				$bachelorNavItem.remove();
				document.getElementById("bachelor").classList.remove('active');
				document.getElementById("bachelor").classList.remove('show');
				document.getElementById("master").classList.add('active');
				document.getElementById("master").classList.add('show');
			}

			if (data.two_year_tech) {
				_renderSystems($twoYearTechTbody, data.two_year_tech);

				$twoYearTechConfirm.click(() =>{
					systemConfirm(2);
				});
				$twoYearTechLockAllNoStudent.click(() => {
					lockAllNoStudent(2);
				});
			} else {
				$twoYearTechNavItem.remove();
			}

			if (data.master) {
				_renderSystems($masterTbody, data.master);

				$masterConfirm.click(() =>{
					systemConfirm(3);
				});
				$masterLockAllNoStudent.click(() => {
					lockAllNoStudent(3);
				});
			} else {
				$masterNavItem.remove();
			}

			if (data.phd) {
				_renderSystems($phdTbody, data.phd);

				$phdConfirm.click(() =>{
					systemConfirm(4);
				});
				$phdLockAllNoStudent.click(() => {
					lockAllNoStudent(4);
				});
			} else {
				$phdNavItem.remove();
			}

			if (data.young_associate) {
				_renderSystems($youngAssociateTbody, data.young_associate);

				$youngAssociateConfirm.click(() =>{
					systemConfirm(5);
				});
				$youngAssociateLockAllNoStudent.click(() => {
					lockAllNoStudent(5);
				});
			} else {
				$youngAssociateNavItem.remove();
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
			case 1:
				if (canDownload) {
					$bachelorDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載學士班審查結果回覆表';

					$bachelorDownload.click(() => {
						systemDownload(1, 'formal');
					});
				} else {
					$bachelorDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載學士班審查結果回覆表（預覽版）';

					$bachelorDownload.click(() => {
						systemDownload(1, 'preview');
					});
				}

				$bachelorConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$bachelorCantComfirm.hide();
					$bachelorCanComfirm.show();
				}
				else{
					$bachelorCanComfirm.hide();
				}
				if (lock) {
					$bachelorConfirmBy.text(system.student_order_confirmer.name);
					$bachelorConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$bachelorConfirmBlock.show();
					$bachelorCantComfirm.hide();
				}

				break;

			case 2:
				if (canDownload) {
					$twoYearTechDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載港二技審查結果回覆表';

					$twoYearTechDownload.click(() => {
						systemDownload(2, 'formal');
					});
				} else {
					$twoYearTechDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載港二技審查結果回覆表（預覽版）';

					$twoYearTechDownload.click(() => {
						systemDownload(2, 'preview');
					});
				}

				$twoYearTechConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$twoYearTechCantConfirm.hide();
					$twoYearTechCanConfirm.show();
				}
				else{
					$twoYearTechCanConfirm.hide();
				}
				if (lock) {
					$twoYearTechConfirmBy.text(system.student_order_confirmer.name);
					$twoYearTechConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$twoYearTechConfirmBlock.show();
					$twoYearTechCantConfirm.hide();
				}

				break;

			case 3:
				if (canDownload) {
					$masterDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載碩士班審查結果回覆表';

					$masterDownload.click(() => {
						systemDownload(3, 'formal');
					});
				} else {
					$masterDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載碩士班審查結果回覆表（預覽版）';

					$masterDownload.click(() => {
						systemDownload(3, 'preview');
					});
				}

				$masterConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$masterCantConfirm.hide();
					$masterCanConfirm.show();
				}
				else{
					$masterCanConfirm.hide();
				}
				if (lock) {
					$masterConfirmBy.text(system.student_order_confirmer.name);
					$masterConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$masterConfirmBlock.show();
					$masterCantConfirm.hide();
				}

				break;

			case 4:
				if (canDownload) {
					$phdDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載博士班審查結果回覆表';

					$phdDownload.click(() => {
						systemDownload(4, 'formal');
					});
				} else {
					$phdDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載博士班審查結果回覆表（預覽版）';

					$phdDownload.click(() => {
						systemDownload(4, 'preview');
					});
				}

				$phdConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$phdCantConfirm.hide();
					$phdCanConfirm.show();
				}
				else{
					$phdCanConfirm.hide();
				}
				if (lock) {
					$phdConfirmBy.text(system.student_order_confirmer.name);
					$phdConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$phdConfirmBlock.show();
					$phdCantConfirm.hide();
				}

				break;
				
			case 5:
				if (canDownload) {
					$youngAssociateDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載海青班審查結果回覆表';

					$youngAssociateDownload.click(() => {
						systemDownload(5, 'formal');
					});
				} else {
					$youngAssociateDownload[0].innerHTML = '<i class="fa fa-download" aria-hidden="true"></i>下載海青班審查結果回覆表（預覽版）';

					$youngAssociateDownload.click(() => {
						systemDownload(5, 'preview');
					});
				}

				$youngAssociateConfirm.prop('disabled', !canConfirm);

				if(canConfirm == true){
					$youngAssociateCantConfirm.hide();
					$youngAssociateCanConfirm.show();
				}
				else{
					$youngAssociateCanConfirm.hide();
				}
				if (lock) {
					$youngAssociateConfirmBy.text(system.student_order_confirmer.name);
					$youngAssociateConfirmAt.html(window.dateFns.format(system.review_confirmed_at, 'YYYY/MM/DD HH:mm:ss'));
					$youngAssociateConfirmBlock.show();
					$youngAssociateCantConfirm.hide();
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
