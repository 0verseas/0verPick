(() => {

	/**
	 * cache DOM
	 */
	const _config = window.getConfig();

	$('#link-list').html(`
		<li>
			<div>
				<a href="https://drive.google.com/file/d/12QrPOyCDQjVdjZ1JKI-fVdSoiZm-BPlc/view?usp=sharing"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i>本會114年2月5日海聯試字第1143000008號函-114學年度「個人申請」備審資料下載與審查作業事宜
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://docs.google.com/presentation/d/1oGg9g7O39IXjOT1uua5j9QmYQX9qELDd_hQKB0ric10"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 個人申請制備審資料下載與審查回覆系統操作步驟
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="${_config.apiBase}/forms/下載系統匯入帳號範例.csv"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 匯入帳號範例.csv
				</a>
				<span style="font-size: 13px;">（任意刪除欄位將會導致匯入失敗，帳號權限請依照範本使用 "啟用"、"關閉"）</span>
			</div>
		</li>
		<li>
			<div>
				<a href="https://drive.google.com/file/d/1EYUN1QPfv8xojKJmxx0dU9YxzdyUJyom/view?usp=sharing"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 各學制系代碼代碼表
				</a>
				<span style="font-size: 13px;">（匯入帳號的各學制權限請使用以上提供的系代碼）</span>
			</div>
		</li>
		<li>
			<div>
				<a href="${_config.apiBase}/forms/審查回覆表範例.csv"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 系所審查回覆表範例
				</a>
				<a href="${_config.apiBase}/forms/審查結果不通過原因代碼對照表.ods"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 審查結果不通過原因代碼對照表
				</a>
				<span style="font-size: 13px; color: DarkCyan;">若在審核回覆開放前要先填寫學生錄取狀況，可參閱系所審查回覆表範例，只需紀錄 僑生編號、審查結果（0：不通過；數字1234:
				審核通過並排序；-1：尚未審核）、不合格原因（審查結果為0時），備註為非必填欄位。其餘欄位在審核回覆開放後並進入下載時系統會自動帶入。</span>
			</div>
		</li>
		<li>
			<div>
				<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=H0030039"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 大學辦理國外學歷採認辦法
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://www.edu.tw/News_Content.aspx?n=0217161130F0B192&sms=DD4E27A7858227FF&s=DBFEB120E0C2C3E4"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 香港澳門學歷檢覈及採認辦法(含認可名冊)
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?PCode=H0010005"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 大陸地區學歷採認辦法
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=H0030032"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 入學大學同等學力認定標準
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://cmn-hant.overseas.ncnu.edu.tw/further-study-area/admissions-guide/"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 各地區招生簡章
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://student.overseas.ncnu.edu.tw/quota/index.html"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 僑生及港澳生招生名額查詢系統
				</a>
			</div>
		</li>
		<li>
			<div>
				<button type="button" class="btn btn-link" id="btn_myanmar_transcript" style="padding:0;">
					<i class="fa fa-download" aria-hidden="true"></i> 緬甸學生成績清冊下載
				</button>
			</div>
		</li>
		<li>
			<div>
				<a href="https://depart.moe.edu.tw/ED2500/News.aspx?n=E8380E03A0E16960&sms=D2E10027BB4EC183"  target="_blank">
					<i class="fa fa-link" aria-hidden="true"></i> 教育部外國大學校院參考名冊專區
				</a>
			</div>
		</li>
	`);

	$('#btn_myanmar_transcript').on('click', _handleMyanmarTranscriptDownload);

	function _handleMyanmarTranscriptDownload() {
		fetch(`${_config.apiBase}/reviewers/myanmar_transcript_download/check`, {
			method: 'GET',
			credentials: 'include'
		})
		.then((res) => {
			if (res.ok){
				window.open(`${_config.apiBase}/reviewers/myanmar_transcript_download/download`);
			} else {
				throw res;
			}
		})
		.catch((err) => {
			if (err.status && err.status === 404) {  // 找不到QQ or 未獲錄取
				err.json().then((data) => {
					alert(`查無資料！`);
				});
			} else {
				err.json && err.json().then((data) => {
					console.error(data);
					alert(`ERROR: \n${data.messages[0]}`);
				})
			}
		});
	}
})();
