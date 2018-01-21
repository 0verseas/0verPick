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
		});

	}

	// 渲染某學制系所
	function _renderDepartments($tbody, system, systemName, depts) {
		let deptsHtmlString = '';

		for (let dept of depts) {
			// PDF 的 onclick
			// app.getStudentApplicationDocsFile('${system}', '${dept.id}', 'pdf')

			deptsHtmlString += `
				<tr>
					<td>${dept.title}</td>
					<td class="text-center btn-download">
						<button class="btn btn-success btn-sm" onclick="alert('尚未開放');">
							<i class="fa fa-download" aria-hidden="true"></i> PDF 合併檔
						</button>
					</td>
					<td class="text-center btn-download">
						<button class="btn btn-success btn-sm" onclick="app.getStudentApplicationDocsFile('${system}', '${dept.id}', 'raw')">
							<i class="fa fa-download" aria-hidden="true"></i> 原始檔案合併檔
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
