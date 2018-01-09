( () => {
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
	function _init() {
		// 取得使用者可下載的系所列表
		window.API.getDownloadableDepts('all', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			_renderDepartments($bachelorTbody, data.bachelor_depts)
			_renderDepartments($twoYearTechTbody, data.two_year_tech_depts)
			_renderDepartments($masterTbody, data.master_depts)
			_renderDepartments($phdTbody, data.phd_depts)
		});

	}

	// 渲染某學制系所
	function _renderDepartments($tbody, depts) {
		let deptsHtmlString = '';

		for (let dept of depts) {
			deptsHtmlString += `
				<tr>
					<td>${dept.title}系</td>
					<td class="text-center btn-download">
						<button class="btn btn-success btn-sm">
							<i class="fa fa-download" aria-hidden="true"></i> 下載
						</button>
					</td>
				</tr>
			`;
		}

		$tbody.html(deptsHtmlString);
	}

})();
