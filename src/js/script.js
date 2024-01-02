(() => {
	/**
	 * init
	 */
	window.API.getUser(function (err, data) {
		if (err) {
			!err.status && console.error(err);
			if (err.status === 401) {
				window.location.replace('./login.html');
			} else {
				alert(`Error ${err.status}: ${err.msg}`)
			}

			return;
		}

		PubSub.emit('user', data);
		_setGreeting(data.name, data.school_reviewer.school.title);
		_setNavLink(
			data.school_reviewer.has_admin,
			data.school_reviewer.department_permissions.length,
			data.school_reviewer.master_permissions.length,
			data.school_reviewer.phd_permissions.length,
			data.school_reviewer.two_year_tech_department_permissions.length
		);

		// 不管有沒有權限 沒有已打包的學生資料就不出現港二技頁面
		if(!data.two_year_need_review){
			$('.Nav__twoyear').remove();
		}
	})

	/**
	 * private method
	 */
	function _setGreeting(name, school) {
		$('#greeting').text(`${school} ${name}，您好！`);
	}

	function _setNavLink(admin, b, m, p, t) {
		if (!!admin) return;
		if (!admin) {
			$('.Nav__account').remove();
			$('.Nav__result').remove();
		}

		if (!b) $('.Nav__bachelor').remove();
		if (!m) $('.Nav__master').remove();
		if (!p) $('.Nav__phd').remove();
		if (!t) $('.Nav__twoyear').remove();
		if (!b && !m && !p && !t) {
			$('.Nav__download').remove();
			$('.Nav__review').remove();
		}
	}
})();
