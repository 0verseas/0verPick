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
			<a href="https://docs.google.com/presentation/d/1lav-5ToDGmc7gXl8fYDXNIDeDnHzC5ciTvfQvUbYI-0/edit#slide=id.g2f452ac164_0_0"  target="_blank">
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
			<span style="font-size: 13px;">（任意刪除欄位將會導致匯入失敗，帳號權限請依照範本使用 "啟用"、"關閉"）</span>
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
			<a href="${_config.apiBase}/forms/審查回覆表範例.csv"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 審查回覆表範例
			</a>
			<a href="${_config.apiBase}/forms/審查結果不通過原因代碼對照表.ods"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 審查結果不通過原因代碼對照表
			</a>
			<span style="font-size: 13px; color: DarkCyan;">若在審核回覆開放前要先填寫學生錄取狀況，可參閱審核回覆表範例，只需紀錄 僑生編號、審查結果（0：不通過；數字1234:
			審核通過並排序；-1：尚未審核）、不合格原因（審查結果為0時），備註為非必填欄位。其餘欄位在審核回覆開放後並進入下載時系統會自動帶入。</span>
		</div>
		`;
	$noAcceptList.html(noAcceptListHTML);


	let annex01HTML='';
	annex01HTML += `
		<div>
			<a href="http://edu.law.moe.gov.tw/LawContentDetails.aspx?id=FL040632"  target="_blank">
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
