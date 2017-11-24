(() => {
	/**
	 * cache DOM
	 */
	const $AccountModal = $('.AccountModal');
	const $AccountList = $('.AccountList');

	/**
	 * bind event
	 */
	$AccountModal.on('show.bs.modal', _handleShowAccountModal);
	$AccountList.on('click.delAccount', '.AccountItem__btn-del', _handleDelAccount);

	/**
	 * event handler
	 */
	function _handleShowAccountModal(e) {
		const type = $(e.relatedTarget).data('type');
		$AccountModal.find('.AccountModal__input-modalType').val(type);
		$AccountModal.find('.AccountModal__title').text(type === 'C' ? '新增帳號' : '編輯帳號');
		$AccountModal.find('.AccountModal__btn-submit').text(type === 'C' ? '新增' : '更新');

		// TODO: set old value
	}

	function _handleDelAccount() {
		alert();
	}

	/**
	 * private method
	 */
	function _renderAccount() {

	}
})();
