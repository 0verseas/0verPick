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
			data.school_reviewer.young_associate_department_permissions.length
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

	function _setNavLink(admin, o) {
		if (!!admin) return;
		if (!admin) {
			$('.Nav__account').remove();
			$('.Nav__result').remove();
		}

		if (!o) $('.Nav__oyvtp').remove();
		if (!o) {
			$('.Nav__download').remove();
			$('.Nav__review').remove();
		}
	}
})();
