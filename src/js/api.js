window.API = (() => {
	const _config = window.getConfig();
	let _loadingTimeout;
	let _loadingCount = 0;
	
	/**
	 * public method
	 */
	function login(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}, 
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function logout() {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { window.location.replace('./login.html'); })
		.catch((err) => { _handleError(err, callback) });
	}

	function getUser(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function getAvailableUsers(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/available-users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function getReviewers(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function getDepts(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/available-departments`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function addUser(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function editUser(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/users/${data.userID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function disableUser(userID, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/users/${userID}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function getStudents(system, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/${system}/students`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
	}

	function CSVToArray(strData, strDelimiter) {
		// Check to see if the delimiter is defined. If not,
		// then default to comma.
		strDelimiter = (strDelimiter || ",");
		// Create a regular expression to parse the CSV values.
		var objPattern = new RegExp((
			// Delimiters.
			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
			// Quoted fields.
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
			// Standard fields.
			"([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
		// Create an array to hold our data. Give the array
		// a default empty first row.
		var arrData = [[]];
		// Create an array to hold our individual pattern
		// matching groups.
		var arrMatches = null;
		// Keep looping over the regular expression matches
		// until we can no longer find a match.
		while (arrMatches = objPattern.exec(strData)) {
			// Get the delimiter that was found.
			var strMatchedDelimiter = arrMatches[1];
			// Check to see if the given delimiter has a length
			// (is not the start of string) and if it matches
			// field delimiter. If id does not, then we know
			// that this delimiter is a row delimiter.
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
				// Since we have reached a new row of data,
				// add an empty row to our data array.
				arrData.push([]);
			}
			// Now that we have our delimiter out of the way,
			// let's check to see which kind of value we
			// captured (quoted or unquoted).
			if (arrMatches[2]) {
				// We found a quoted value. When we capture
				// this value, unescape any double quotes.
				var strMatchedValue = arrMatches[2].replace(
					new RegExp("\"\"", "g"), "\"");
			} else {
				// We found a non-quoted value.
				var strMatchedValue = arrMatches[3];
			}
			// Now that we have our value string, let's add
			// it to the data array.
			arrData[arrData.length - 1].push(strMatchedValue);
		}
		// Return the parsed data.
		return (arrData);
	}

	/**
	 * private method
	 */
	function _setLoading() {
		_loadingCount ++;
		Loading.start();
	}

	function _endLoading() {
		_loadingCount --;
		if (_loadingCount === 0) {
			_loadingTimeout && clearTimeout(_loadingTimeout);
			_loadingTimeout = setTimeout(() => {
				Loading.stop();
			}, (Math.random() * 1000) + 500);
		}
	}

	function _parseData(res) {
		if (!res.ok) {
			throw res
		}
		
		_endLoading();
		return res.json();
	}

	function _handleError(err, callback) {
		const status = err.status;
		_endLoading();
		if (!status) {
			callback && callback(err);
			console.error(err);
			return;
		}

		console.error(status);
		err.json().then((msg) => {
			alert(msg.messages[0]);
			callback && callback({
				status,
				msg
			});
		});
	}

	return {
		login,
		logout,
		getUser,
		getAvailableUsers,
		getReviewers,
		getDepts,
		addUser,
		editUser,
		disableUser,
		getStudents,
		CSVToArray
	};
})();
