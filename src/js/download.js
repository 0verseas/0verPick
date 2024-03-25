const app = ( () => {
	/**
	 * priveate variable
	 */

	/**
	 * cache DOM
	 */
	const $oyvtpTbody = $('#oyvtpTbody');

	const $allpdfzip = $('#allpdfzip');

	/**
	 * init
	 */

	_init();

	/**
	 * bind event
	 */

	/**
	 * event handler
	 */

	function getStudentApplicationDocsFile(system, deptId, filetype) {
		window.API.getAllStudentMergedFile(system, deptId, filetype);
	}

	function _init() {
		// 取得使用者可下載的系所列表
		window.API.getDownloadableDepts(2, (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			_renderDepartments($oyvtpTbody, 2, data)

			// 海青班有人就顯示 系所表格
			if(data.length > 0){
				$('.oyvtpForm').show();
			}

			// 海青沒人就隱藏 全校檔案按鈕
			if(data.length < 1){
				$allpdfzip.remove();
			}
		});

		PubSub.on('user', (user) => {
			if (!!user.school_reviewer.has_admin) {
				$allpdfzip.show();
			} else {
				$twoyearallpdfzip.remove();
				$allpdfzip.remove();
			}
		});
	}

	// 渲染某學制系所
	function _renderDepartments($tbody, system, depts) {
		let deptsHtmlString = '';

		for (let dept of depts) {
			deptsHtmlString += `
				<tr>
					<td>${dept.title}</td>
					<td class="text-center btn-download">
						<button class="btn btn-success btn-sm" onclick="app.getStudentApplicationDocsFile('${system}', '${dept.id}', 'pdf');">
							<i class="fa fa-download" aria-hidden="true"></i> PDF 合併檔
						</button>
					</td>
				</tr>
			`;
		}

		$tbody.html(deptsHtmlString);
	}

	return {
		getStudentApplicationDocsFile,
	}

})();
