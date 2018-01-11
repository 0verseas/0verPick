(() => {
	/**
	 * private variable
	 */
	const _url = window.location.href;
	const _system = window.API.getUrlParam('system', _url);
	const _department_id = window.API.getUrlParam('department_id', _url);
	const _student_id = window.API.getUrlParam('student_id', _url);
	const _type_id = window.API.getUrlParam('type_id', _url);
	const _filename = window.API.getUrlParam('filename', _url);

	/**
	 * init
	 */
	if ([_system, _department_id, _student_id, _type_id, _filename].some((val) => val === null)) {
		alert('Wrong url.');
		return;
	}

	_checkLogin().then(() => {
		window.location.href = `${window.getConfig().apiBase}/reviewers/${_system}/students/${_department_id}/${_student_id}/types/${_type_id}/admission-selection-application-document/${_filename}`;
	});

	/**
	 * private method
	 */
	function _checkLogin() {
		return new Promise((resolve, reject) => {
			window.API.getUser(function (err, data) {
				if (err) {
					!err.status && console.error(err);
					if (err.status === 401) {
						window.location.replace(`./login.html?url=${_url}`);
						reject();
					} else {
						alert(`Error ${err.status}: ${err.msg}`);
						reject();
					}

					return;
				}

				resolve();
			})
		})
	}
})();
