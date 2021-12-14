(() => {
	/**
	 * private variable
	 */
	const _config = window.getConfig();

	// 引入 reCAPTCHA 的 JS 檔案
    var s = document.createElement('script');
    let src = 'https://www.google.com/recaptcha/api.js?render=' + _config.reCAPTCHA_site_key;
    s.setAttribute('src', src);
    document.body.appendChild(s);

	/**
	 * cache dom
	 */
	const $loginForm = $('.LoginForm');

	/**
	*	init
	*/

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

		var loginForm = {
			username: username,
			password: sha256(password),
			google_recaptcha_token: ''
		}

		grecaptcha.ready(function() {
            grecaptcha.execute(_config.reCAPTCHA_site_key, {
              action: 'PickLogin'
            }).then(function(token) {
                // token = document.getElementById('btn-login').value
                loginForm.google_recaptcha_token=token;
            }).then(function(){
				window.API.login(loginForm, function (err, data) {
					if (err) {
						// console.error(err);

						if (err.status == 401) {
							alert('帳號或密碼有誤');
						} else if (err.status == 403) {
							alert('Google reCAPTCHA verification failed');
						}
						else if (err.status == 429) {  // 429 Too Many Requests
							alert('錯誤次數太多，請稍後再試。');
						}
						
						return;
					}
		
					const url = window.location.href.split('?url=')[1];
					if (url) {
						window.location.href = url;
					} else {
						window.location.href = './';
					}
				});
			});
        });

		e.preventDefault();
	}
})();
