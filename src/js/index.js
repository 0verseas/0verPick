(() => {

	/**
	 * cache DOM
	 */
	const $downloadPtt = $('#downloadPtt');
	const $importAccount = $('#importAccount');
	const $deptID = $('#deptID');
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

})();
