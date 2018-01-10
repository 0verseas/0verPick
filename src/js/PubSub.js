window.PubSub = (() => {
    /**
     * private variable
     */
    let _events = {
        // event_name: [callback1, callback2]
    };

    /**
     * public method
     */
    function on(event, callback) {
        _events[event] = _events[event] || [];
        _events[event].push(callback);
    }

    function emit(event, data) {
        if (!_events[event]) return;
        _events[event].forEach(callback => {
            callback(data);
        });
    }

    return {
        on,
        emit
    }
})();
