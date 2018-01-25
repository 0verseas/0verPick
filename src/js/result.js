const app = ( () => {
	const _config = window.getConfig();
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

	const $bachelorNavItem = $('#bachelor-nav-item');
	const $twoYearTechNavItem = $('#two-year-tech-nav-item');
	const $masterNavItem = $('#master-nav-item');
	const $phdNavItem = $('#phd-nav-item');

	// 下載某學制的審查結果回覆表
	const $bachelorDownload = $('#bachelor-download-review-form');
	const $twoYearTechDownload = $('#two-year-tech-download-review-form');
	const $masterDownload = $('#master-download-review-form');
	const $phdDownload = $('#phd-download-review-form');

	// 確認並鎖定某學制的審查結果
	const $bachelorConfirm = $('#bachelor-confirm');
	const $twoYearTechConfirm = $('#two-year-tech-confirm');
	const $masterConfirm = $('#master-confirm');
	const $phdConfirm = $('#phd-confirm');

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
	function systemDownload(type_id) {
		window.open(`${_config.apiBase}/reviewers/systems/${type_id}/review-result`, `_blank`);
	}

	function systemConfirm(type_id) {
		window.API.confirmSystem(type_id, (err, system) => {
			if (err) {
				console.error(err);
				return;
			}
			switch (system.type_id) {
				case 1:
					_renderSystems($bachelorTbody, system);
					break;
				case 2:
					_renderSystems($twoYearTechTbody, system);
					break;
				case 3:
					_renderSystems($masterTbody, system);
					break;
				case 4:
					_renderSystems($phdTbody, system);
					break;
			}
		});
	}

	function _init() {
		// 取得所有學制的審查狀態
		window.API.getSystems((err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			console.log(data);

			// 判斷學制存不存在
			if (data.bachelor) {
				_renderSystems($bachelorTbody, data.bachelor);
				$bachelorDownload.click(() => {
					systemDownload(1)
				});
				$bachelorConfirm.click(() =>{
					systemConfirm(1);
				});
			} else {
				$bachelorNavItem.remove();
			}

			if (data.two_year_tech) {
				_renderSystems($twoYearTechTbody, data.two_year_tech);
				$twoYearTechDownload.click(() => {
					systemDownload(2)
				});
				$twoYearTechConfirm.click(() =>{
					systemConfirm(2);
				});
			} else {
				$twoYearTechNavItem.remove();
			}

			if (data.master) {
				_renderSystems($masterTbody, data.master);
				$masterDownload.click(() => {
					systemDownload(3)
				});
				$masterConfirm.click(() =>{
					systemConfirm(3);
				});
			} else {
				$masterNavItem.remove();
			}

			if (data.phd) {
				_renderSystems($phdTbody, data.phd);
				$phdDownload.click(() => {
					systemDownload(4);
				});
				$phdConfirm.click(() =>{
					systemConfirm(4);
				});
			} else {
				$phdNavItem.remove();
			}
		});

	}

	// 渲染某學制系所
	function _renderSystems($tbody, system = null) {

		// console.log(system);

		let deptsHtmlString = '';

		if (system) {
			const depts = system.departments;

			for (let dept of depts) {
				deptsHtmlString += `
					<tr>
						<td>${dept.id}</td>
						<td>${dept.title}</td>
						<td>${dept.review_confirmed_at ? '已鎖定' : dept.review_students_at ? '已儲存' : '未審查'}</</td>
						<td>${dept.review_students_by ? dept.student_order_reviewer.name : ''}</</td>
						<td>${dept.review_students_at ? dateFns.format(dept.review_students_at, 'YYYY/MM/DD HH:mm:ss') : ''}</</td>
					</tr>
				`;
			}
		}
		console.log(system);
		$tbody.html(deptsHtmlString);

		// 若學制已確認並鎖定，可以下載審核回覆表
		if (system.review_confirmed_at) {
			switch (system.type_id) {
				case 1:
					$bachelorDownload.prop('disabled', false);
					$bachelorConfirm.prop('disabled', true);
					break;

				case 2:
					$twoYearTechDownload.prop('disabled', false);
					$twoYearTechConfirm.prop('disabled', true);
					break;

				case 3:
					$masterDownload.prop('disabled', false);
					$masterConfirm.prop('disabled', true);
					break;

				case 4:
					$phdDownload.prop('disabled', false);
					$phdConfirm.prop('disabled', true);
					break;
			}
		}


	}

	return {

	}

})();
