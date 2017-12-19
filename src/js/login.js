(() => {
	/**
	 * private variable
	 */
	const _config = window.getConfig();

	/**
	 * cache dom
	 */
	const $loginForm = $('.LoginForm');

	/**
	 * bind event
	 */
	$loginForm.on('submit', _handleLogin);

	/**
	 * event handler
	 */
	function _handleLogin(e) {
		const username = $loginForm.find('.LoginForm__input-username').val();
		const password = $loginForm.find('.LoginForm__input-password').val();
		window.API.login({
			username,
			password: sha256(password)
		}, function (err, data) {
			if (err) {
				console.error(err);
				if (err.status === 401) {
					alert('帳號或密碼有誤');
				}
				
				return;
			}

			location.href = './';
		});

		e.preventDefault();
	}
})();
