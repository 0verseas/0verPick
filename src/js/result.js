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
			} else {
				$bachelorNavItem.remove();
			}

			if (data.two_year_tech) {
				_renderSystems($twoYearTechTbody, data.two_year_tech);
			} else {
				$twoYearTechNavItem.remove();
			}

			if (data.master) {
				_renderSystems($masterTbody, data.master);
			} else {
				$masterNavItem.remove();
			}

			if (data.phd) {
				_renderSystems($phdTbody, data.phd);
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
						<td>${dept.review_confirm_at ? '已鎖定' : dept.review_students_at ? '已儲存' : '未審查'}</</td>
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

				case 3:
					$phdDownload.prop('disabled', false);
					$phdConfirm.prop('disabled', true);
					break;
			}
		}


	}

	return {

	}

})();
