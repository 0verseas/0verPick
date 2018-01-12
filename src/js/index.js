(() => {

	/**
	 * cache DOM
	 */
	const $downloadPtt = $('#downloadPtt');
	const $importAccount = $('#importAccount');
	const $deptID = $('#deptID');
	const $noAcceptList = $('#noAcceptList');
	const $annex01 = $('#annex01');
	const $annex02 = $('#annex02');
	const $annex03 = $('#annex03');
	const _config = window.getConfig();


	let downloadPttHTML='';
	downloadPttHTML += `
		<div>
			<a href="${_config.apiBase}/forms/個人申請制備審資料下載與審查回覆系統操作說明.pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 個人申請制備審資料下載與審查回覆系統操作說明PTT
			</a>
		</div>
		`;
	$downloadPtt.html(downloadPttHTML);

	let importAccountHTML='';
	importAccountHTML += `
		<div>
			<a href="${_config.apiBase}/forms/下載系統匯入帳號範例.csv"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 匯入帳號範例.csv
			</a>
			<span style="font-size:13px">因目前測試以國立台灣大學為範例，故匯入時學士、港二技、碩士、博士，請改以國立台灣大學科系代碼表做測試。</span>
		</div>
		`;
	$importAccount.html(importAccountHTML);

	let deptIDHTML='';
	deptIDHTML += `
		<div>
			<a href="${_config.apiBase}/forms/學士系代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 學士班系代碼代碼表
			</a>
			<a href="${_config.apiBase}/forms/港二技代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 港二技代碼對照表
			</a>
			<a href="${_config.apiBase}/forms/碩士系代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 碩士班系代碼代碼表
			</a>
			<a href="${_config.apiBase}/forms/博士系代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 博士班系代碼代碼表
			</a>
			<span style="font-size: 13px;">（匯入帳號的各學制權限請使用以上提供的系代碼）</span>
		</div>
		`;
	$deptID.html(deptIDHTML);

	let noAcceptListHTML='';
	noAcceptListHTML += `
		<div>
			<a href="${_config.apiBase}/forms/審查結果不通過原因代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 審查結果不通過原因代碼對照表
			</a>
		</div>
		`;
	$noAcceptList.html(noAcceptListHTML);


	let annex01HTML='';
	annex01HTML += `
		<div>
			<a href="${_config.apiBase}/forms/入學大學同等學力認定標準.pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 大學辦理國外學歷採認辦法
			</a>
		</div>
		`;
	$annex01.html(annex01HTML);


	let annex02HTML='';
	annex02HTML += `
		<div>
			<a href="${_config.apiBase}/forms/香港澳門學歷檢覈及採認辦法(含學校認可名冊).pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 香港澳門學歷檢覈及採認辦法
			</a>
		</div>
		`;
	$annex02.html(annex02HTML);

	let annex03HTML='';
	annex03HTML += `
		<div>
			<a href="${_config.apiBase}/forms/大陸地區學歷採認辦法.pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 大陸地區學歷採認辦法
			</a>
		</div>
		`;
	$annex03.html(annex03HTML);

})();
