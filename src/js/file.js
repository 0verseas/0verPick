(() => {
	/**
	 * private variable
	 */
	const _url = window.location.href;
	const _dept = window.API.getUrlParam('department', _url);
	const _students = window.API.getUrlParam('students', _url);
	const _file = window.API.getUrlParam('file', _url);

	/**
	 * init
	 */
	_checkLogin();

	/**
	 * private method
	 */
	function _checkLogin() {
		window.API.getUser(function (err, data) {
			if (err) {
				!err.status && console.error(err);
				if (err.status === 401) {
					window.location.replace(`./login.html?url=${_url}`);
				} else {
					alert(`Error ${err.status}: ${err.msg}`)
				}

				return;
			}
		})
	}
})();
