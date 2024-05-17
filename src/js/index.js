(() => {

	/**
	 * cache DOM
	 */
	const _config = window.getConfig();

	$('#link-list').html(`
		<li>
			<div>
				<a href="https://docs.google.com/presentation/d/14mHF4c4pq1czkmv2gj6eMVMbMQC_gUO8/edit?usp=sharing&ouid=113984502575913490966&rtpof=true&sd=true"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 海外青年技術訓練班學生資料下載與審查回覆系統操作步驟
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://drive.google.com/file/d/1gq9P20OOFAVlfqALkF3qe9UxNtMgL8R6/view?usp=sharing"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 匯入帳號範例(海青班).csv
				</a>
				<span style="font-size: 13px;">（任意刪除欄位將會導致匯入失敗，帳號權限請依照範本使用 "啟用"、"關閉"）</span>
			</div>
		</li>
		<li>
			<div>
				<a href="https://docs.google.com/spreadsheets/d/1yflElrO-5byc6n1S8rzaTmz7-nfllnHs/edit?usp=sharing&ouid=113984502575913490966&rtpof=true&sd=true"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 海青四年制產學合作學士班系代碼表
				</a>
				<span style="font-size: 13px;">（匯入帳號的各學制權限請使用以上提供的系代碼）</span>
			</div>
		</li>
		<li>
			<div>
				<a href="https://drive.google.com/file/d/14hNHCI_E1KP0jy_eWyRCPlfY7mPSXK-I/view?usp=sharing"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 系所審查結果表範例
				</a>
				<a href="https://drive.google.com/file/d/1GgUHLQhc4XtP2N3x8nM6lbUcJZZPmMOJ/view?usp=sharing"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 系所審查結果不通過原因代碼對照表
				</a>
				<span style="font-size: 13px; color: DarkCyan;">若在審核回覆開放前要先填寫學生錄取狀況，可參閱審核回覆表範例，只需紀錄 僑生編號、審查結果（0：不通過；數字1234:
				審核通過並排序；-1：尚未審核）、不合格原因（審查結果為0時），備註為非必填欄位。其餘欄位在審核回覆開放後並進入下載時系統會自動帶入。</span>
			</div>
		</li>
		<!--<li>
			<div>
				<a href="https://admission.taiwan-world.net/zh_tw/4year/brochure4"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 各地區招生簡章
				</a>
			</div>
		</li>
		<li>
			<div>
				<a href="https://student.oyvtp.org/quota.html"  target="_blank">
					<i class="fa fa-download" aria-hidden="true"></i> 僑生及港澳生招生名額查詢系統
				</a>
			</div>
		</li>-->
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
