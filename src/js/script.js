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

		console.log(data);
		window.currentUser = data;
		_setGreeting(data.name, data.school_reviewer.school.title);
		_setNavLink(
			data.school_reviewer.has_admin,
			data.school_reviewer.department_permissions.length,
			data.school_reviewer.master_permissions.length,
			data.school_reviewer.phd_permissions.length,
			data.school_reviewer.two_year_tech_department_permissions.length
		);
	})

	/**
	 * private method
	 */
	function _setGreeting(name, school) {
		$('#greeting').text(`${school} ${name}，您好！`);
	}

	function _setNavLink(admin, b, m, p, t) {
		if (!!admin) return;
		if (!admin) $('.Nav__account').remove();
		if (!b) $('.Nav__bachelor').remove();
		if (!m) $('.Nav__master').remove();
		if (!p) $('.Nav__phd').remove();
		if (!t) $('.Nav__twoyear').remove();
	}
})();
