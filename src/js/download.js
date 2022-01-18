const app = ( () => {
	/**
	 * priveate variable
	 */

	/**
	 * cache DOM
	 */
	const $bachelorTbody = $('#bachelorTbody');
	const $twoYearTechTbody = $('#twoYearTechTbody');
	const $masterTbody = $('#masterTbody');
	const $phdTbody = $('#phdTbody');

	const $allpdfzip = $('#allpdfzip');
	const $twoyearallpdfzip = $('#twoyearallpdfzip');

	let _two_year_tech_depts = [];

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
		window.API.getDownloadableDepts('all', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			_renderDepartments($bachelorTbody, 'bachelor', '學士班', data.bachelor_depts)
			_renderDepartments($twoYearTechTbody, 'two-year', '港二技', data.two_year_tech_depts)
			_renderDepartments($masterTbody, 'master', '碩士班', data.master_depts)
			_renderDepartments($phdTbody, 'phd', '博士班', data.phd_depts)

			// 學士班有人就顯示 系所表格
			if(data.bachelor_depts.length > 0){
				$('.bachelorForm').show();
			}

			// 港二技有人就顯示 系所表格
			if(data.two_year_tech_depts.length > 0){
				$('.twoYearForm').show();
			}

			// 碩士班有人就顯示 系所表格
			if(data.master_depts.length > 0){
				$('.masterForm').show();
			}

			// 博士班有人就顯示 系所表格
			if(data.phd_depts.length > 0){
				$('.phdForm').show();
			}

			// 學碩博沒人就隱藏 全校檔案按鈕
			if((data.bachelor_depts.length + data.master_depts.length + data.phd_depts.length) < 1){
				$allpdfzip.remove();
			}

			_two_year_tech_depts = data.two_year_tech_depts;
			if (_two_year_tech_depts.length < 1) {
				$twoyearallpdfzip.remove();
			} else {
				$twoyearallpdfzip.show();
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
	function _renderDepartments($tbody, system, systemName, depts) {
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
