(() => {
	/**
	 * cache DOM
	 */
	const $AccountModal = $('.AccountModal');

	/**
	 * bind event
	 */
	$AccountModal.on('show.bs.modal', _handleShowAccountModal);

	/**
	 * event handler
	 */
	function _handleShowAccountModal(e) {
		const type = $(e.relatedTarget).data('type');
		$AccountModal.find('.AccountModal__input-modalType').val(type);
		$AccountModal.find('.AccountModal__title').text(type === 'C' ? '新增帳號' : '編輯帳號');
		$AccountModal.find('.AccountModal__btn-submit').text(type === 'C' ? '新增' : '更新');
	}
})();
