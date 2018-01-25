(() => {

	/**
	 * private variable
	 */

	const _config = window.getConfig();
	let _user = {};
	let isConfirmed = true;
	let isSystemConfirmed = true;
	let needLock = true;
	let _reasonMapping = [];
	let _reasonOptionHTML = '';
	let _systems = {};
	let _systemId = ""
	let _deptId = "";
	let _reviewPending = [];
	let _reviewPass = [];
	let _reviewFailed = [];
	let _systemMapping = [];

	/**
	 * cache DOM
	 */

	const $reviewBlock = $('#review-block');
	const $systemSel = $('#sel-system');
	const $deptSel = $('#sel-dept');
	const $downloadCSVBtn = $('#btn-downloadCSV');
	const $uploadBtn = $('#btn-upload');
	const $fileInput = $('#file-input');
	const $pendingTbody = $('#tbody-pending');
	const $passTbody = $('#tbody-pass');
	const $failedTbody = $('#tbody-failed');
	const $patchBtn = $('.btn-patch');
	const $saveBtn = $('#btn-save');
	const $confirmBtn = $('#btn-confirm');
	const $infoDiv = $('#div-info');
	const $deptHeading = $('#heading-dept');
	const $systemHeading = $('#heading-system');
	const $submitDiv = $('#div-submit');
	const $adminSubmitDiv = $('#div-submit-admin');
	const $lockInfoDiv = $('#div-lock-info');
	const $confirmBlock = $('#confirm-block');
	const $confirmBy = $('#confirm-by');
	const $confirmAT = $('#confirm-at');

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	$systemSel.on('change', _handleSystemChange);
	$deptSel.on('change', _handleDeptChange);
	$uploadBtn.on('click', _handleUpload);
	$fileInput.on('change', _handleFileChange);
	$patchBtn.on('click', _handlePatchData);

	/**
	 * event handler
	 */

	function _init() {
		// 此 reviewer 可以看到的學系。
		window.API.getAllCanReviewDepts('all', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			_systems = data;
			_setSystems(_systems);
		});

		// 初始化審查未過原因。
		window.API.getReviewFailResult((err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			_reasonMapping = data;
			_reasonMapping.forEach(el => {
				_reasonOptionHTML += `<option value="${el.id}">${el.reason}</option>`;
			});
		})

		PubSub.on('user', (data) => {
			_user =  data;
		});
	}

	function _setSystems(systems = null) {
		let systemSelHtml = '<option value="-1">請選擇</option>';

		if (systems.bachelor) {
			_systemMapping.push({id: "1", key: "bachelor", name: "學士班"});
			systemSelHtml += '<option value="bachelor">學士班</option>';
		}

		if (systems.two_year_tech) {
			_systemMapping.push({id: "2", key: "two_year_tech", name: "港二技"});
			systemSelHtml += '<option value="two_year_tech">港二技</option>';
		}

		if (systems.master) {
			_systemMapping.push({id: "3", key: "master", name: "碩士班"});
			systemSelHtml += '<option value="master">碩士班</option>';
		}

		if (systems.phd) {
			_systemMapping.push({id: "4", key: "phd", name: "博士班"});
			systemSelHtml += '<option value="phd">博士班</option>';
		}

		$systemSel.html(systemSelHtml);

		// 若過濾結果為只有一個，直接幫使用者選定該學制
		if (Object.keys(systems).length === 1) {
			// 提取該學制 id（type name）
			const systemId = Object.keys(systems)[0];
			// 幫使用者選定
			$systemSel.children(`[value=${systemId}]`).prop('selected', true);
			$systemSel.change();
		}
	}

	function _handleUpload() {
		$fileInput.trigger('click');
	}

	function _handleFileChange() {
		const file = this.files[0];
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

		fileReaderAsBinaryString.readAsBinaryString(file);
	}

	function _renderCSVTable(fileName, data) {
		const rows = window.API.CSVToArray(data);
		const header = rows.shift();
		const fieldLength = header.length;
		if (header[2] !== '僑生編號' ||
			header[4] !== '姓名' ||
			header[5] !== '審查結果' ||
			header[6] !== '不合格原因代碼' ||
			header[7] !== '備註') {
			alert('匯入之 csv 欄位有誤');
			return;
		}
		// 清掉奇怪的空行
		let csvReviews = rows.filter((val, i) => val.length === fieldLength);

		// 格式化 csv 資料
		// overseas_student_id: 僑生編號
		// name: 姓名
		// review_order: 審查結果， -1: 未審查、0: 不及格、其他數字：審查排序
		// fail_result: 不及格原因代碼
		// review_memo: 備註

		csvReviews = csvReviews.map(el => ({
			overseas_student_id: el[2].padStart(6, '0'),
			name: el[4],
			review_order: Number(el[5]),
			fail_result: (el[6] === undefined || el[6] === '') ? null : el[6],
			review_memo: (el[7] === undefined || el[7] === '') ? null : el[7]
		}));

		// Review 暫存，整合系統上已有的學生
		let tempReview = [];
		tempReview = tempReview.concat(_reviewPending);
		tempReview = tempReview.concat(_reviewPass);
		tempReview = tempReview.concat(_reviewFailed);

		// 原有資料與 csv 做 merge
		csvReviews.forEach(csv => {
			const studentIndex = tempReview.findIndex(pen => pen.overseas_student_id === csv.overseas_student_id);
			if (studentIndex > -1) {
				tempReview[studentIndex].review_order = csv.review_order;
				tempReview[studentIndex].fail_result = csv.fail_result;
				tempReview[studentIndex].review_memo = csv.review_memo;
			}
		});

		_reviewPending = tempReview.filter(el => el.review_order < 0);
		_reviewPass = tempReview.filter(el => el.review_order > 0);
		_reviewFailed = tempReview.filter(el => el.review_order === 0);

		_reviewPending.forEach(el => {
			el.review_order = null;
		});

		_reviewPass.forEach(el => {
			el.fail_result = null;
			el.review_memo = null;
		});

		_reviewFailed.forEach(el => {
			el.fail_result = (el.fail_result === null) ? _reasonMapping[0].id : el.fail_result;
			el.review_memo = (el.review_memo === null) ? '' : el.review_memo;
		});

		_reviewPass.sort(function (a, b) {
			return a.sortNum - b.sortNum;
		});

		_reRenderPending();
		_reRenderPass();
		_reRenderFailed();

		// console.log("========== csvReviews ==========");
		// console.log(csvReviews);
		// console.log("========== _reviewFailed ==========");
		// console.log(_reviewFailed);
		// console.log("========== _reviewPass ==========");
		// console.log(_reviewPass);
		// console.log("========== _reviewPending ==========");
		// console.log(_reviewPending);
	}

	function _handleSystemChange() {
		$deptSel.html('<option value="-1">請選擇</option>');

		// 有值再說
		if (this.value === '-1') {
			return;
		}

		// 綁定系所列表
		let deptHTML = '';
		const deptList = _systems[this.value].departments;
		deptList.forEach(el => {
			deptHTML += `<option value="${el.id}">${el.title}</option>`;
		})
		$deptSel.append(deptHTML);

		// 若過濾結果為只有一個，直接幫使用者選定該系所
		if (deptList.length === 1) {
			// 提取該學制 id（type name）
			const deptId = deptList[0].id;
			// 幫使用者選定
			$deptSel.children(`[value=${deptId}]`).prop('selected', true);
			$deptSel.change();
		}
	}

	// 如果是 dept select 發生事件，取值丟入 renderDept
	function _handleDeptChange() {
		const deptId = this.value;
		_renderDeptReviewResult(deptId);
	}

	// 改成丟入某系 id render 系所審查結果
	function _renderDeptReviewResult(deptId) {
		const systemKey = $systemSel.val();
		const systemName = _systemMapping.find(el => el.key === systemKey).name;
		_systemId = _systemMapping.find(el => el.key === systemKey).id;
		_deptId = deptId;

		window.API.getDeptReviewResult(_systemId, _deptId, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			let _studentList = data.students.map(el => {
				return {
					id: el.user_id,
					review_order: el.review_order,
					fail_result: el.fail_result,
					name: el.name,
					overseas_student_id: el.overseas_student_id,
					review_memo: el.review_memo
				}
			});

			// 判斷是否已確認
			isConfirmed = !!data.student_order_confirmer;
			isSystemConfirmed = !!data.system_data.review_confirmed_at

			// 系所鎖 => 一般使用者不得用
			// 學制鎖 => admin 也不得用
			needLock = isConfirmed && (!_user.school_reviewer.has_admin || isSystemConfirmed);

			_reviewPending = _studentList.filter(el => el.review_order === null);
			_reviewPass = _studentList.filter(el => el.review_order > 0);
			_reviewFailed = _studentList.filter(el => el.review_order === 0);

			// reRender 時，丟入參數判斷是否已鎖定，若已鎖定且非 admin，將所有 input disabled
			_reRenderPending();
			_reRenderPass();
			_reRenderFailed();

			$infoDiv.show();
			$deptHeading.text(data.title);
			$systemHeading.text(systemName);
			$downloadCSVBtn.attr('href', `${_config.apiBase}/reviewers/systems/${_systemId}/departments/${_deptId}?type=file`);

			// 系所資料已鎖定
			if (isConfirmed) {
				// 隱藏儲存按鈕群
				$submitDiv.hide();

				// 但 admin 仍可「儲存修改」
				if (!needLock) {
					$adminSubmitDiv.show();
				}

				// 顯示系所鎖定狀態
				const date = moment(data.review_confirmed_at);
				$confirmAT.text(date.format('YYYY/MM/DD HH:mm:ss'));
				$confirmBy.text(data.student_order_confirmer.name);
				$confirmBlock.show();
			} else {
				// 系所資料尚未鎖定，顯示儲存按鈕並隱藏「儲存修改」按鈕
				$adminSubmitDiv.hide();
				$submitDiv.show();
			}

			if (needLock) {
				// 已送出資料並鎖定，同時不能不能匯入檔案
				$uploadBtn.hide();
				$lockInfoDiv.show();
			} else {
				$lockInfoDiv.hide();
			}

			// 顯示審查區塊
			$reviewBlock.show();
		});
	}

	function _reRenderPending() {
		const noDataHtml = '<tr><td colspan=3 class="text-center"><h4>無資料</h4></td></tr>';

		// 設定鎖定 html
		let lockHtml = '';

		if (needLock) {
			lockHtml = 'disabled';
		}

		let pendingHTML = '';
		_reviewPending.forEach((data, index) => {
			pendingHTML += `
			<tr>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td class="text-right">
					<button class="btn btn-success btn-judge" data-pass="1" data-index="${index}" ${lockHtml}>
						<i class="fa fa-circle-o" aria-hidden="true"></i>
						合格
					</button>
					<button class="btn btn-danger btn-judge" data-pass="0" data-index="${index}" ${lockHtml}>
						<i class="fa fa-times" aria-hidden="true"></i>
						不合格
					</button>
				</td>
			</tr>
			`
		})

		$pendingTbody.html(_reviewPending.length > 0 ? pendingHTML : noDataHtml);
		$('.btn-judge').on('click', _handlePass);
	}

	function _reRenderPass() {
		const noDataHtml = '<tr><td colspan=4 class="text-center"><h4>無資料</h4></td></tr>';

		// 設定鎖定 html
		let lockHtml = '';

		if (needLock) {
			lockHtml = 'disabled';
		}

		let passHTML = '';
		_reviewPass.forEach((data, index) => {
			passHTML += `
			<tr>
				<td>${index + 1}</td>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td class="text-center">
					<button class="btn btn-secondary up-arrow" data-index="${index}" ${lockHtml}><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
					<button class="btn btn-secondary down-arrow" data-index="${index}" ${lockHtml}><i class="fa fa-arrow-down" aria-hidden="true"></i></button>
					<button class="btn btn-warning btn-pass-return" data-pass="1" data-index="${index}" ${lockHtml}> 退回 </button>
				</td>
			</tr>
			`
		})
		$passTbody.html(_reviewPass.length > 0 ? passHTML : noDataHtml);
		$('.btn-pass-return').on('click', _handleToPending);
		$('.up-arrow').on('click', _prevWish);
		$('.down-arrow').on('click', _nextWish);
	}

	function _reRenderFailed() {
		const noDataHtml = '<tr><td colspan=5 class="text-center"><h4>無資料</h4></td></tr>';

		// 設定鎖定 html
		let lockHtml = '';

		if (needLock) {
			lockHtml = 'disabled';
		}

		let failedHTML = '';
		_reviewFailed.forEach((data, index) => {
			failedHTML += `
			<tr>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td>
					<select id="failedReason-${index}" data-index="${index}" class="form-control form-control-sm sel-reason" ${lockHtml}>
						${_reasonOptionHTML}
					</select>
				</td>
				<td>
					<input type="text" data-index="${index}" class="input-memo form-control form-control-sm" value="${data.review_memo}" ${lockHtml}>
				</td>
				<td class="text-center">
					<button class="btn btn-warning btn-failed-return" data-pass="0" data-index="${index}" ${lockHtml}> 退回 </button>
				</td>
			</tr>
			`
		})
		$failedTbody.html(_reviewFailed.length > 0 ? failedHTML : noDataHtml);
		_reviewFailed.forEach((data, index) => {
			$('#failedReason-' + index).val(data.fail_result);
		})
		$('.btn-failed-return').on('click', _handleToPending);
		$('.sel-reason').on('change', _handleReasonChange);
		$('.input-memo').on('change', _handleMemoChange);
	}

	function _handlePass() {
		const index = $(this).data('index');
		if (!!$(this).data('pass')) {
			_reviewPass.push(_reviewPending[index]);
			_reviewPending.splice(index, 1);
			_reRenderPass();
		} else {
			_reviewPending[index].review_order = 0;
			_reviewPending[index].fail_result = _reasonMapping[0].id;
			_reviewPending[index].review_memo = "";
			_reviewFailed.push(_reviewPending[index]);
			_reviewPending.splice(index, 1);
			_reRenderFailed();
		}
		_reRenderPending();
	}

	function _handleToPending() {
		const index = $(this).data('index');
		if (!!$(this).data('pass')) {
			_reviewPass[index].review_order = null;
			_reviewPending.push(_reviewPass[index]);
			_reviewPass.splice(index, 1);
			_reRenderPass();
		} else {
			_reviewFailed[index].review_order = null;
			_reviewFailed[index].fail_result = null;
			_reviewFailed[index].review_memo = null;
			_reviewPending.push(_reviewFailed[index]);
			_reviewFailed.splice(index, 1);
			_reRenderFailed();
		}
		_reRenderPending();
	}

	function _prevWish() { // 排序上調
		const index = $(this).data('index');
		if (index > 0) {
			const swap = _reviewPass[index];
			_reviewPass[index] = _reviewPass[index - 1];
			_reviewPass[index - 1] = swap;
			_reRenderPass();
		}
	}

	function _nextWish() { // 排序下調
		const index = $(this).data('index');
		if (index < _reviewPass.length - 1) {
			const swap = _reviewPass[index];
			_reviewPass[index] = _reviewPass[index + 1];
			_reviewPass[index + 1] = swap;
			_reRenderPass();
		}
	}

	function _handleReasonChange() {
		const index = $(this).data('index');
		const failedCode = $(this).val();
		_reviewFailed[index].fail_result = failedCode;
	}

	function _handleMemoChange() {
		const index = $(this).data('index');
		const memoText = $(this).val();
		_reviewFailed[index].review_memo = memoText;
	}

	function _handlePatchData() {
		const mode = $(this).data('mode');
		if (_deptId !== "") {
			if (_reviewPending.length === 0) {
				let sendData = [];
				let passData = _reviewPass.map((data, index) => {
					return {
						id: data.id,
						review_order: index + 1,
						fail_result: null,
						review_memo: null
					}
				});
				let failedData = _reviewFailed.map((data, index) => {
					return {
						id: data.id,
						review_order: 0,
						fail_result: data.fail_result,
						review_memo: data.review_memo
					}
				});
				sendData = sendData.concat(passData);
				sendData = sendData.concat(failedData);

				const studentsData = { students: sendData };

				window.API.patchDeptReviewResult(_systemId, _deptId, mode, studentsData, (err, data) => {
					if (err) {
						console.error(err);
						return;
					}

					if (mode === 'confirm') {
						alert('審查結果已送出，並鎖定審查結果。');
						// 成功鎖定後，重 render 一次系所審查結果
						_renderDeptReviewResult(data.id);
					} else {
						alert('審查結果已儲存。');
					}
				});

			} else {
				alert('尚有待審查項目，請審查完畢再儲存。');
			}
		} else {
			alert('請先選擇系所。');
		}
	}

})();
