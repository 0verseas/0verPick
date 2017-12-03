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
			callback && callback(err);
			console.error(err);
			return;
		}

		console.error(status);
		err.json().then((msg) => {
			callback && callback({
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
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function logout() {
		fetch(`${_config.apiBase}/reviewers/logout`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { window.location.href = './login.html'; })
		.catch((err) => { handleError(err, callback) });
	}

	function getUser(callback) {
		fetch(`${_config.apiBase}/reviewers/login`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function getAvailableUsers(callback) {
		fetch(`${_config.apiBase}/reviewers/available-users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function getReviewers(callback) {
		fetch(`${_config.apiBase}/reviewers/users`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function getDepts(callback) {
		fetch(`${_config.apiBase}/reviewers/available-departments`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function addUser(data, callback) {
		fetch(`${_config.apiBase}/reviewers/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
	}

	function editUser(data, callback) {
		fetch(`${_config.apiBase}/reviewers/users/${data.userID}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data),
			credentials: 'include'
		})
		.then(parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { handleError(err, callback) });
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

	return {
		login,
		logout,
		getUser,
		getAvailableUsers,
		getReviewers,
		getDepts,
		addUser,
		editUser,
		CSVToArray
	};
})();
