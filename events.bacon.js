bacon._eventData = [];

/**
 * Adds an event handler for the specified event. Cross-browser compatible.
 *
 * @param string event The event name.
 * @param function callback The function to be called. You can use "this" in
 * 	every browser to access the element.
 */
bacon.html.on = function(event, callback) {
	this.each(function() {
		if (this.addEventListener) {
			function handler(e) {
				if (callback.call(this, e) === false) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			handler.callback = callback;
			this.addEventListener(event, handler);
		} else {
			// Internet Explorer support
			function handler(e) {
				if (callback.call(e.srcElement, e) === false) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			handler.callback = callback;
			this.attachEvent('on' + event, handler);
		}
			
		if (!this.dataset.baconId) {
			this.dataset.baconId = bacon._eventData.push([[event, handler]]) - 1;
		} else {
			bacon._eventData[this.dataset.baconId].push([event, handler]);
		}
	});
	return this;
}

/**
 * Triggers an event handler for the specified event.
 *
 * @param string event The event name to be triggered.
 * @param function callback The function to be called on completion.
 */
bacon.html.trigger = function(event, callback) {
	this.each(function() {
		if (this.dispatchEvent) {
			var evt = document.createEvent('UIEvents');
			evt.initUIEvent(event, true, true, window, 1);
			var cancelled = !this.dispatchEvent(evt);

			if (typeof callback === 'function') {
				callback.call(this, cancelled);
			}
		} else {
			// IE
		}
	});
	return this;
}

/**
 * Removes the specified handler / all handlers of that type for that element.
 *
 * @param string event The event name.
 * @param function callback The function specified in .on. Optional.
 */
bacon.html.removeHandlers = bacon.html.off = function(event, callback) {
	this.each(function() {
		if (this.dataset.baconId) {
			var data = bacon._eventData[this.dataset.baconId];
			for (var i = 0; i < data.length; i++) {
				if (data[i][0] === event && (typeof callback === 'undefined' || data[i][1].callback === callback)) {
					if (this.removeEventListener) {
						this.removeEventListener(data[i][0], data[i][1]);
					} else {
						// Internet Explorer support
						this.detachEvent('on' + data[i][0], data[i][1]);
					}
				}
			}
		}
	});
	return this;
}
