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
		_setGreeting(data.name, data.school_reviewer.school.title);
	})

	/**
	 * private method
	 */
	function _setGreeting(name, school) {
		$('#greeting').text(`${school} ${name}，您好！`);
	}
})();
