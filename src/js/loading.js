window.Loading = (() => {
    return {
        start() {
            $('#loading-wrapper').show();
        },
        stop() {
            $('#loading-wrapper').hide()
        }
    }
})();
