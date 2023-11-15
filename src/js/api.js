window.API = (() => {
	const _config = window.getConfig();
	let _loadingTimeout;
	let _loadingCount = 0;
	let _loadingStartTime = null;

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

	function getOneStudent(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/${data.system}/students/${data.deptID}/${data.userID}`, {
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

	function getStudentDiploma(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/${data.system}/students/${data.deptID}/${data.userID}/diploma`, {
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

	function getStudentTranscripts(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/${data.system}/students/${data.deptID}/${data.userID}/transcripts`, {
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

	function getApplicationDoc(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/${data.system}/students/${data.deptID}/${data.userID}/types/-1/admission-selection-application-document`, {
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

	function getIdentityDocs(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/students/${data.userID}`, {
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

	function getDownloadableDepts(system = 'all', callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems/${system}/departments`, {
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

	function getAllCanReviewDepts(system = 'all', callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems`, {
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

	function getStudentMergedFile(system, studentId, deptId, filetype) {
		_setLoading();

		const request = fetch(`${_config.apiBase}/reviewers/merged-pdf/systems/${system}/departments/${deptId}/students/${studentId}?mode=check&filetype=${filetype}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		_parseMergedFile(request);
	}

	function getAllStudentMergedFile(system, deptId, filetype) {
		_setLoading();

		const request = fetch(`${_config.apiBase}/reviewers/merged-pdf/systems/${system}/departments/${deptId}/students?mode=check&filetype=${filetype}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		_parseMergedFile(request);
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

	function getUrlParam(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
		const results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function getReviewFailResult(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/fail-results`, {
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

	function getDeptReviewResult(system, deptId, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems/${system}/departments/${deptId}`, {
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

	function unlockDeptReviewResult(system, deptId, mode, callback){
		if (mode !== 'unlock'){  // 不是要解鎖的人來亂什麼啦
			return;
		}

		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems/${system}/departments/${deptId}?mode=${mode}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
			.then(_parseData)
			.then((data) => { callback && callback(null, data) })
			.catch((err) => { _handleError(err, callback) });
	}

	function patchDeptReviewResult(system, deptId, mode, data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems/${system}/departments/${deptId}?mode=${mode}`, {
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

	function lockAllNoStudent(system, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/lock-all-no-student-department/${system}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
			.then(_parseData)
			.then((data) => { callback && callback(null, data) })
			.catch((err) => { _handleError(err, callback) });
	}

	/**
	 * private method
	 */
	function _setLoading() {
		_loadingCount ++;
		if (!_loadingStartTime) {
			_loadingStartTime = $.now();
		}

		Loading.start();
	}

	function _endLoading() {
		_loadingCount --;
		if (_loadingCount === 0) {
			const loadingDuration = $.now() - _loadingStartTime;
			_loadingStartTime = null;
			const antiOptimize = loadingDuration > 2000 ? 0 : (Math.random() * 1000) + 500;
			_loadingTimeout && clearTimeout(_loadingTimeout);
			_loadingTimeout = setTimeout(() => {
				Loading.stop();
			}, antiOptimize);
		}
	}

	function _parseData(res) {
		if (!res.ok) {
			throw res
		}

		_endLoading();

		if( res.status === 205 || res.status === 204 ){
			window.location.reload();
			alert('匯入成功');
			return ;
		}
		return res.json();
	}

	function _parseMergedFile(request) {
		return request.then(res => {
			// 有問題彈出問題
			if (!res.ok) {
				if (res.status === 404) {
					window.alert('檔案尚未合併完成');
				} else if (res.status === 401) {
					window.alert('無權限下載，請重新登入');
					// window.location.href = './login.html';
				}

				throw res;
			}

			// 沒問題取得檔案
			return res.json();
		}).then(({ url }) => {
			// 建立 a 物件供下載用
			const pom = document.createElement('a');

			// 設定下載連結
			pom.href = url;

			// 強制下載為檔案
			pom.download = true;
			pom.target="_self"; // required in Firefox

			// 將 pom 綁到 body 中
			document.body.appendChild(pom); // required in Firefox

			// 下載囉
			pom.click();

			// 移除下載用連結
			pom.remove();

			_endLoading();
		}).catch(err => {
			_endLoading();

			console.error(err);
		});
	}

	// 拿到所有學制的審查狀態
	function getSystems(callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems`, {
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

	// 拿到所有學制的審查狀態
	function confirmSystem(type_id, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/systems/${type_id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		})
		.then(_parseData)
		.then((data) => { callback && callback(null, data) })
		.catch((err) => { _handleError(err, callback) });
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
			if (err.status != 401) {
				alert(msg.messages[0]);
			}
			callback && callback({
				status,
				msg
			});
		});
	}

	function importUserList(data, callback) {
		_setLoading();
		fetch(`${_config.apiBase}/reviewers/user-list`, {
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
		getOneStudent,
		getStudentDiploma,
		getStudentTranscripts,
		getApplicationDoc,
		getIdentityDocs,
		getDownloadableDepts,
		getAllCanReviewDepts,
		getStudentMergedFile,
		getAllStudentMergedFile,
		CSVToArray,
		getUrlParam,
		getSystems,
		confirmSystem,
		getReviewFailResult,
		getDeptReviewResult,
		unlockDeptReviewResult,
		patchDeptReviewResult,
		lockAllNoStudent,
		importUserList
	};
})();
