(() => {

	/**
	 * priveate variable
	 */

	const _reasonMapping = [
	{val: "-1", text: "未填寫不合格原因"},
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

	let _csvReviews = [];

	/**
	 * cache DOM
	 */

	const $systemSel = $('#sel-system');
	const $deptSel = $('#sel-dept');
	const $uploadBtn = $('#btn-upload');
	const $fileInput = $('#file-input');
	const $passTbody = $('#tbody-pass');
	const $failedTbody = $('#tbody-failed');

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	$uploadBtn.on('click', _handleUpload);
	$fileInput.on('change', _handleFileChange);

	/**
	 * event handler
	 */

	function _init() {
		// 取得某學制某系所的審查名冊檔案（.csv）

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

		let reviewNeeded = _csvReviews.filter(el => { return el.sortNum < 0; });
		let reviewPass = _csvReviews.filter(el => { return el.sortNum > 0; });
		let reviewFailed = _csvReviews.filter(el => { return el.sortNum === 0; });

		reviewPass.sort(function (a, b) {
			if (a.sortNum > b.sortNum) { return 1; }
			if (a.sortNum < b.sortNum) { return -1; }
			return 0;
		});

		let passHTML = '';
		let failedHTML = '';

		reviewPass.forEach((data, index) => {
			passHTML += `
			<tr>
				<td>${index}</td>
				<td>${data.no}</td>
				<td>${data.name}</td>
			</tr>
			`
		})

		reviewFailed.forEach((data, index) => {
			const reasonMsg = _reasonMapping.find(el => {
				return el.val == data.failedCode;
			}).text;
			failedHTML += `
			<tr>
				<td>${data.no}</td>
				<td>${data.name}</td>
				<td>${reasonMsg}</td>
			</tr>
			`
		})

		$passTbody.html(passHTML);
		$failedTbody.html(failedHTML);

		console.log("========== _csvReviews ==========");
		console.log(_csvReviews);
		console.log("========== reviewFailed ==========");
		console.log(reviewFailed);
		console.log("========== reviewPass ==========");
		console.log(reviewPass);
		console.log("========== reviewNeeded ==========");
		console.log(reviewNeeded);
		// $CSVModal.find('.CSVModal__body').html(`
		// 	<table class="table table-bordered table-hover">
		// 		<thead>
		// 			<tr>
		// 				${
		// 					header.map((val, i) => `<th>${val}</th>`).join().replace(/,/g, '')
		// 				}
		// 			</tr>
		// 		</thead>
		// 		<tbody>
		// 			${
		// 				_csvReviews.map((r, i) => {
		// 					return `
		// 						<tr>
		// 							${
		// 								_csvReviews[i].map((val, j) => `<td>${val}</td>`).join().replace(/,/g, '')
		// 							}
		// 						</tr>
		// 					`;
		// 				}).join().replace(/,/g, '')
		// 			}
		// 		</tbody>
		// 	</table>
		// `);

		// $CSVModal.modal();
	}




})();
