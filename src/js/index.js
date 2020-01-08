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
	const $annex04 = $('#annex04');
	const $annex05 = $('#annex05');
	const $annex06 = $('#annex06');
	const _config = window.getConfig();


	let downloadPttHTML='';
	downloadPttHTML += `
		<div>
			<a href="https://docs.google.com/presentation/d/1lav-5ToDGmc7gXl8fYDXNIDeDnHzC5ciTvfQvUbYI-0/edit#slide=id.g4c2c41d31c_0_35"  target="_blank">
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
			&nbsp;
			<a href="https://drive.google.com/open?id=1Su08J1Lcj6210rbbOPLba8XkCNd1lnAj"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 109年各校匯入下載系統之帳號
			</a>
			<span style="font-size: 13px;">（任意刪除欄位將會導致匯入失敗，帳號權限請依照範本使用 "啟用"、"關閉"）</span>
		</div>
		`;
	$importAccount.html(importAccountHTML);

	let deptIDHTML='';
	deptIDHTML += `
		<div>
			<a href="${_config.apiBase}/forms/2019下載系統系所代碼表.xlsx"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 各學制系代碼代碼表
			</a>
			<span style="font-size: 13px;">（匯入帳號的各學制權限請使用以上提供的系代碼）</span>
			<span style="font-size: 13px;">（因測試站以國立臺灣大學為範例，故匯入時請暫時以國立臺灣大學科系代碼表做測試）</span>
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
			<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=H0030039"  target="_blank">
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
			<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=H0010005"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 大陸地區學歷採認辦法
			</a>
		</div>
		`;
	$annex03.html(annex03HTML);

	let annex04HTML='';
	annex04HTML += `
		<div>
			<a href="http://edu.law.moe.gov.tw/LawContent.aspx?id=FL008644"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 入學大學同等學力認定標準
			</a>
		</div>
		`;
	$annex04.html(annex04HTML);

	let annex05HTML='';
	annex05HTML += `
		<div>
			<a href="${_config.apiBase}/forms/港二技_本會彙整報名學生畢肄業學校經香港當地評審情形一覽表.pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 本會彙整報名學生畢肄業學校經香港當地評審情形一覽表
			</a>
		</div>
		`;
	$annex05.html(annex05HTML);

	let annex06HTML='';
	annex06HTML += `
		<div>
			<a href="${_config.apiBase}/forms/港二技_香港副學士或高級文憑學生來臺升讀學士班適用簡章.pdf"  target="_blank">
				<i class="fa fa-download" aria-hidden="true"></i> 香港副學士或高級文憑學生來臺升讀學士班適用簡章
			</a>
		</div>
		`;
	$annex06.html(annex06HTML);

})();
