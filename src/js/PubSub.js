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
    function on(event, callbak) {
        _events[event] = _events[event] || [];
        _events[event].push(callbak);
    }

    function emit(event, data) {
        if (!_events[event]) return;
        _events[event].forEach(callbak => {
            callbak(data);
        });
    }
    
    return {
        on,
        emit
    }
})();
