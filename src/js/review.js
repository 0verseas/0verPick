(() => {

	/**
	 * priveate variable
	 */

	const _config = window.getConfig();
	let _reasonMapping = [];
	let _reasonOptionHTML = '';
	let _departments = {};
	let _systemId = ""
	let _deptId = "";
	let _reviewPending = [];
	let _reviewPass = [];
	let _reviewFailed = [];
	const _systemMapping = [
	{id: "1", key: "bachelor_depts", name: "學士班"},
	{id: "2", key: "two_year_tech_depts", name: "港二技"},
	{id: "3", key: "master_depts", name: "碩士班"},
	{id: "4", key: "phd_depts", name: "博士班"}
	]

	/**
	 * cache DOM
	 */

	const $systemSel = $('#sel-system');
	const $deptSel = $('#sel-dept');
	const $downloadCSVBtn = $('#btn-downloadCSV');
	const $uploadBtn = $('#btn-upload');
	const $uploadTextBtn = $('#btn-upload-text')
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
	const $lockInfoDiv = $('#div-lock-info');
	const $confirmerText = $('#text-confirmer');

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
		window.API.getDownloadableDepts('all', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			_departments = data;
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
			})
		})
	}

	function _handleUpload() {
		$fileInput.trigger('click');
	}

	function _handleFileChange() {
		const file = _csvFile = this.files[0];

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
		// 清掉奇怪的空行
		let _csvReviews = rows.filter((val, i) => {
			return val.length === fieldLength;
		});

		// 格式化 csv 資料
		// overseas_student_id: 僑生編號
		// name: 姓名
		// review_order: 審查結果， -1: 未審查、0: 不及格、其他數字：審查排序
		// fail_result: 不及格原因代碼
		// review_memo: 備註

		_csvReviews = _csvReviews.map(el => {
			return {
				overseas_student_id: el[2],
				name: el[4],
				review_order: Number(el[5]),
				fail_result: (el[6] === undefined || el[6] === "") ? null : el[6],
				review_memo: (el[7] === undefined || el[7] === "") ? null : el[7]
			}
		});

		// Review 暫存，整合系統上已有的學生
		let tempReview = [];
		tempReview = tempReview.concat(_reviewPending);
		tempReview = tempReview.concat(_reviewPass);
		tempReview = tempReview.concat(_reviewFailed);

		// 原有資料與 csv 做 merge
		_csvReviews.forEach(csv => {
			const studentIndex = tempReview.findIndex(pen => { return pen.overseas_student_id === csv.overseas_student_id });
			if (studentIndex > -1) {
				tempReview[studentIndex].review_order = csv.review_order;
				tempReview[studentIndex].fail_result = csv.fail_result;
				tempReview[studentIndex].review_memo = csv.review_memo;
			}
		})

		_reviewPending = tempReview.filter(el => { return el.review_order < 0; });
		_reviewPass = tempReview.filter(el => { return el.review_order > 0; });
		_reviewFailed = tempReview.filter(el => { return el.review_order === 0; });

		_reviewPending.forEach(el => {
			el.review_order = null;
		})

		_reviewPass.forEach(el => {
			el.fail_result = null;
			el.review_memo = null;
		})

		_reviewFailed.forEach(el => {
			el.fail_result = (el.fail_result === null) ? _reasonMapping[0].id : el.fail_result;
			el.review_memo = (el.review_memo === null) ? "" : el.review_memo;
		})

		_reviewPass.sort(function (a, b) {
			return a.sortNum - b.sortNum;
		});

		_reRenderPending();
		_reRenderPass();
		_reRenderFailed();

		// console.log("========== _csvReviews ==========");
		// console.log(_csvReviews);
		// console.log("========== _reviewFailed ==========");
		// console.log(_reviewFailed);
		// console.log("========== _reviewPass ==========");
		// console.log(_reviewPass);
		// console.log("========== _reviewPending ==========");
		// console.log(_reviewPending);
	}

	function _handleSystemChange() {
		console.log(this.value);
		let deptHTML = '<option value="-1">請選擇</option>';

		if (this.value !== "-1") {
			const deptList = _departments[this.value];
			deptList.forEach(el => {
				deptHTML += `<option value="${el.id}">${el.title}</option>`;
			})
		}
		$deptSel.html(deptHTML);
	}

	function _handleDeptChange() {
		const systemKey = $systemSel.val();
		const systemName = _systemMapping.find(el => el.key === systemKey).name;
		_systemId = _systemMapping.find(el => el.key === systemKey).id;
		_deptId = this.value;

		window.API.getDeptReviewResult(_systemId, _deptId, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(data);
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
			_reviewPending = _studentList.filter(el => { return el.review_order === null });
			_reviewPass = _studentList.filter(el => { return el.review_order > 0 });
			_reviewFailed = _studentList.filter(el => { return el.review_order === 0 });

			_reRenderPending();
			_reRenderPass();
			_reRenderFailed();

			$infoDiv.show();
			$deptHeading.text(data.title);
			$systemHeading.text(systemName);
			$downloadCSVBtn.attr("href", `${_config.apiBase}/reviewers/systems/${_systemId}/departments/${_deptId}?type=file`);
			$uploadTextBtn.text(systemName + data.title);
			if (!!data.student_order_confirmer) {
				// 已送出資料並鎖定
				$submitDiv.hide();
				$lockInfoDiv.show();
				let date = moment(data.review_confirmed_at);
				$confirmerText.text(data.student_order_confirmer.name + " (" + date.format("YYYY/MM/DD HH:mm:ss") + ") ");
			} else {
				$submitDiv.show();
				$lockInfoDiv.hide();
			}
		});
	}

	function _reRenderPending() {
		let pendingHTML = '';
		_reviewPending.forEach((data, index) => {
			pendingHTML += `
			<tr>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td class="text-right">
					<button class="btn btn-success btn-judge" data-pass="1" data-index="${index}">
						<i class="fa fa-circle-o" aria-hidden="true"></i>
						合格
					</button>
					<button class="btn btn-danger btn-judge" data-pass="0" data-index="${index}">
						<i class="fa fa-times" aria-hidden="true"></i>
						不合格
					</button>
				</td>
			</tr>
			`
		})
		$pendingTbody.html(pendingHTML);
		$('.btn-judge').on('click', _handlePass);
	}

	function _reRenderPass() {
		let passHTML = '';
		_reviewPass.forEach((data, index) => {
			passHTML += `
			<tr>
				<td>${index + 1}</td>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td class="text-center">
					<button class="btn btn-secondary up-arrow" data-index="${index}"><i class="fa fa-arrow-up" aria-hidden="true"></i></button>
					<button class="btn btn-secondary down-arrow" data-index="${index}"><i class="fa fa-arrow-down" aria-hidden="true"></i></button>
					<button class="btn btn-warning btn-pass-return" data-pass="1" data-index="${index}"> 退回 </button>
				</td>
			</tr>
			`
		})
		$passTbody.html(passHTML);
		$('.btn-pass-return').on('click', _handleToPending);
		$('.up-arrow').on('click', _prevWish);
		$('.down-arrow').on('click', _nextWish);
	}

	function _reRenderFailed() {
		let failedHTML = '';

		_reviewFailed.forEach((data, index) => {
			failedHTML += `
			<tr>
				<td>${data.overseas_student_id}</td>
				<td>${data.name}</td>
				<td>
					<select id="failedReason-${index}" data-index="${index}" class="form-control form-control-sm sel-reason">
						${_reasonOptionHTML}
					</select>
				</td>
				<td>
					<input type="text" data-index="${index}" class="input-memo form-control form-control-sm" value="${data.review_memo}">
				</td>
				<td class="text-center">
					<button class="btn btn-warning btn-failed-return" data-pass="0" data-index="${index}"> 退回 </button>
				</td>
			</tr>
			`
		})
		$failedTbody.html(failedHTML);
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
		const index = $(this).data("index");
		if (index > 0) {
			const swap = _reviewPass[index];
			_reviewPass[index] = _reviewPass[index - 1];
			_reviewPass[index - 1] = swap;
			_reRenderPass();
		}
	}

	function _nextWish() { // 排序下調
		const index = $(this).data("index");
		if (index < _reviewPass.length - 1) {
			const swap = _reviewPass[index];
			_reviewPass[index] = _reviewPass[index + 1];
			_reviewPass[index + 1] = swap;
			_reRenderPass();
		}
	}

	function _handleReasonChange() {
		const index = $(this).data("index");
		const failedCode = $(this).val();
		_reviewFailed[index].fail_result = failedCode;
	}

	function _handleMemoChange() {
		const index = $(this).data("index");
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
				})
				let failedData = _reviewFailed.map((data, index) => {
					return {
						id: data.id,
						review_order: 0,
						fail_result: data.fail_result,
						review_memo: data.review_memo
					}
				})
				sendData = sendData.concat(passData);
				sendData = sendData.concat(failedData);

				const studentsData = { students: sendData }

				window.API.patchDeptReviewResult(_systemId, _deptId, mode, studentsData, (err, data) => {
					if (err) {
						console.error(err);
						return;
					}

					if (mode === "confirm") {
						alert("審查結果已送出，並鎖定審查結果。");
					} else {
						alert("審查結果已儲存。");
					}
				});

			} else {
				alert("尚有待審查項目，請審查完畢再儲存。");
			}
		} else {
			alert("請先選擇系所。");
		}
	}

})();
