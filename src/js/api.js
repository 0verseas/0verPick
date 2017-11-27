window.API = (() => {
	const _config = window.getConfig();
	function parseData(res) {
		if (!res.ok) {
			throw res
		}

		return res.json();
	}

	function handleError(err, callback) {
		const status = err.status
		if (!status) {
			callback(err);
			console.error(err);
			return;
		}

		console.error(status);
		err.json().then((msg) => {
			callback({
				status,
				msg
			});
		});
	}

	function login(data, callback) {
		fetch(`${_config.apiBase}/reviewers/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	return {
		login
	};
})();
