(() => {
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
		console.log([username, password]);
		window.location.href = '/';
		e.preventDefault();
	}
})();
