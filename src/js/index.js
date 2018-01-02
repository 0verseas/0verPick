(() => {

	/**
	 * cache DOM
	 */
	const $downloadPtt = $('#downloadPtt');
	const $importAccount = $('#importAccount');
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
		</div>
		`;
	$importAccount.html(importAccountHTML);

})();
