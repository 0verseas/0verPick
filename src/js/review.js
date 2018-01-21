(() => {

	/**
	 * priveate variable
	 */

	const _reasonMapping = [
	{val: "", text: "未填寫不合格原因"},
	{val: "1", text: "＊未繳交報名"},
	{val: "2", text: "＊學歷資格不符"},
	{val: "3", text: "＊資料不完整，未符合系所規定"},
	{val: "4", text: "資料不完整－未附作品或作品不完整"},
	{val: "5", text: "資料不完整－未附成績單"},
	{val: "6", text: "資料不完整－未附研究計畫或研究計畫不完整"},
	{val: "7", text: "資料不完整－未附讀書計畫或讀書計畫不完整"},
	{val: "8", text: "資料不完整－未附推薦信"},
	{val: "9", text: "資料不完整－未附履歷"},
	{val: "10", text: "資料不完整－未附自傳"},
	{val: "11", text: "資料不完整－未附國際比賽證明"},
	{val: "12", text: "資料不完整－未附專業證明或證照或語言證明"},
	{val: "13", text: "資料不完整－未附術科成績證明書"},
	{val: "14", text: "資料不完整－未附影音作品"},
	{val: "15", text: "資料不完整－未附立體作品照片"},
	{val: "16", text: "＊審查資料成績未達標準"},
	{val: "17", text: "審查資料－學經歷背景與系所不符"},
	{val: "18", text: "審查資料－無系所相關專長"},
	{val: "19", text: "審查資料－相關的專業課程訓練不足"},
	{val: "20", text: "審查資料－專業能力不夠突出"},
	{val: "21", text: "審查資料－學業成績不夠理想"},
	{val: "22", text: "審查資料－創作能力要加強"},
	{val: "23", text: "審查資料－系所無該專長師資"},
	{val: "24", text: "審查資料－欠缺就讀的企圖"},
	{val: "25", text: "審查資料－缺乏發展潛力"},
	{val: "26", text: "審查資料－申請動機與系所宗旨不符"},
	{val: "27", text: "審查資料－志趣與系所課程規劃不符"},
	{val: "28", text: "審查資料－未能瞭解其就學及專業定向"},
	{val: "29", text: "審查資料－語言能力需再加強"},
	{val: "30", text: "審查資料－中文能力不佳"},
	{val: "31", text: "審查資料－英文能力不佳"},
	{val: "32", text: "審查資料－寫作能力不佳"},
	{val: "33", text: "審查資料－作品不夠優秀"},
	{val: "34", text: "審查資料－程度未達系所要求"},
	{val: "35", text: "＊術科測試成績未達錄取標準"},
	{val: "36", text: "＊筆試成績未達錄取標準"},
	{val: "37", text: "＊口試成績未達錄取標準"},
	{val: "38", text: "＊依會議決議決定"},
	{val: "39", text: "＊未通過委員同意"},
	{val: "40", text: "＊未達合格票數"},
	{val: "41", text: "＊自行通知放棄申請"},
	{val: "42", text: "＊已透過其他管道錄取"},
	{val: "43", text: "＊資料抄襲"},
	{val: "44", text: "＊審查資料─學生研究方向與系所不符"},
	{val: "45", text: "＊審查資料─學生出席情況欠佳"},
	{val: "46", text: "＊審查資料─學業成績不完整"},
	]

	let _departments = {};
	let _csvReviews = [];
	let _reasonOptionHTML = '';
	let _reviewPending = [];
	let _reviewPass = [];
	let _reviewFailed = [];

	/**
	 * cache DOM
	 */

	const $systemSel = $('#sel-system');
	const $deptSel = $('#sel-dept');
	const $uploadBtn = $('#btn-upload');
	const $fileInput = $('#file-input');
	const $pendingTbody = $('#tbody-pending');
	const $passTbody = $('#tbody-pass');
	const $failedTbody = $('#tbody-failed');

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

	/**
	 * event handler
	 */

	function _init() {
		// 取得某學制某系所的審查名冊檔案（.csv）
		window.API.getDownloadableDepts('all', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}
			_departments = data;
		});

		_reasonMapping.forEach(el => {
			_reasonOptionHTML += `<option value="${el.val}">${el.text}</option>`;
		})

		// 檢查某學制某系所是否有上傳過結果，有的話渲染合格、不合格名單
	}

	function _handleUpload() {
		$fileInput.trigger('click');
	}

	function _handleFileChange() {
		const file = _csvFile = this.files[0];

		const fileName = file.name;
		if (fileName.split('.').pop() !== 'csv') {
			alert('請匯入 .csv 欓');
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
		_csvReviews = rows.filter((val, i) => {
			return val.length === fieldLength;
		});
		// 清掉 table header
		_csvReviews = _csvReviews.slice(2);

		// 格式化 csv 資料
		// no: 僑生編號
		// name: 姓名
		// sortNum: 審查結果， -1: 未審查、0: 不及格、其他數字：審查排序
		// failedCode: 不及格原因代碼
		// comment: 備註

		_csvReviews = _csvReviews.map(el => {
			return {
				no: el[2],
				name: el[4],
				sortNum: Number(el[5]),
				failedCode: el[6],
				comment: el[7]
			}
		});

		_reviewPending = _csvReviews.filter(el => { return el.sortNum < 0; });
		_reviewPass = _csvReviews.filter(el => { return el.sortNum > 0; });
		_reviewFailed = _csvReviews.filter(el => { return el.sortNum === 0; });

		_reviewPass.sort(function (a, b) {
			return a.sortNum - b.sortNum;
		});

		_reRenderPending();
		_reRenderPass();
		_reRenderFailed();

		console.log("========== _csvReviews ==========");
		console.log(_csvReviews);
		console.log("========== _reviewFailed ==========");
		console.log(_reviewFailed);
		console.log("========== _reviewPass ==========");
		console.log(_reviewPass);
		console.log("========== _reviewPending ==========");
		console.log(_reviewPending);
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
		console.log(this.value);
	}

	function _reRenderPending() {
		let pendingHTML = '';
		_reviewPending.forEach((data, index) => {
			pendingHTML += `
			<tr>
				<td>${index + 1}</td>
				<td>${data.no}</td>
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
				<td>${data.no}</td>
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
			const reasonMsg = _reasonMapping.find(el => {
				return el.val == data.failedCode;
			}).text;
			failedHTML += `
			<tr>
				<td>${data.no}</td>
				<td>${data.name}</td>
				<td>
					<select id="failedReason-${index}" data-index="${index}" class="form-control form-control-sm sel-reason">
						${_reasonOptionHTML}
					</select>
				</td>
				<td>${data.comment}</td>
				<td class="text-center">
					<button class="btn btn-warning btn-failed-return" data-pass="0" data-index="${index}"> 退回 </button>
				</td>
			</tr>
			`
		})
		$failedTbody.html(failedHTML);
		_reviewFailed.forEach((data, index) => {
			$('#failedReason-' + index).val(data.failedCode);
		})
		$('.btn-failed-return').on('click', _handleToPending);
		$('.sel-reason').on('change', _handleReasonChange);
	}

	function _handlePass() {
		const index = $(this).data('index');
		if (!!$(this).data('pass')) {
			_reviewPass.push(_reviewPending[index]);
			_reviewPending.splice(index, 1);
			_reRenderPass();
		} else {
			_reviewFailed.push(_reviewPending[index]);
			_reviewPending.splice(index, 1);
			_reRenderFailed();
		}
		_reRenderPending();
	}

	function _handleToPending() {
		const index = $(this).data('index');
		if (!!$(this).data('pass')) {
			_reviewPass[index].sortNum = -1;
			_reviewPass[index].failedCode = "";
			_reviewPending.push(_reviewPass[index]);
			_reviewPass.splice(index, 1);
			_reRenderPass();
		} else {
			_reviewFailed[index].sortNum = -1;
			_reviewFailed[index].failedCode = "";
			_reviewPending.push(_reviewFailed[index]);
			_reviewFailed.splice(index, 1);
			_reRenderFailed();
		}
		_reRenderPending();
	}

	function _prevWish() { // 排序上調
		const index = $(this).data("index");
		console.log(index);
		if (index > 0) {
			const swap = _reviewPass[index];
			_reviewPass[index] = _reviewPass[index - 1];
			_reviewPass[index - 1] = swap;
			_reRenderPass();
		}
	}

	function _nextWish() { // 排序下調
		const index = $(this).data("index");
		console.log(index);
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
		_reviewFailed[index].failedCode = failedCode;
		console.log(_reviewFailed[index]);
	}

})();
