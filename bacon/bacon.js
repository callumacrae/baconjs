function BaconObj() {};

var $, bacon = $ = function(selector, limit) {
	var elements = new BaconObj();
	if (typeof selector === 'object') {
		elements.elements = (selector instanceof Array) ? selector : [selector];
		elements.length = elements.elements.length;
	} else {
		elements.elements = [document];
		elements.select(selector, limit);
	}
	return elements;
};
BaconObj.prototype = bacon.html = {};




/*****************************************************************************
 *                      DOCUMENT OBJECT MODEL
 ****************************************************************************/

/**
 * Select an element using a CSS selector.
 *
 * @param string selector The selector to use.
 * @param int limit Limit the returned elements to this value.
 */
bacon.html.select = function(selector, limit) {
	for (var els, elements = [], i = 0, j; i < this.elements.length && (typeof limit === 'undefined' || elements.length < limit); i++) {
		els = this.elements[i].querySelectorAll(selector);
		for (j = 0; j < els.length && (typeof limit === 'undefined' || elements.length < limit); j++) {
			elements.push(els[j]);
		}
	}
	this.elements = elements;
	this.length = this.elements.length;
	return this;
};

/**
 * Cycles through the elements, executing the callback for each one.
 *
 * @param function callback The function to be called for each element. Use
 * 	"this" to access the element.
 */
bacon.html.each = function(callback) {
	for (var i = 0; i < this.elements.length; i++) {
		callback.call(this.elements[i]);
	}
	return this;
};

bacon._eventData = [];



/*****************************************************************************
 *                               EVENT HANDLING
 ****************************************************************************/

/**
 * Adds an event handler for the specified event. Cross-browser compatible.
 *
 * @param string event The event name.
 * @param function callback The function to be called. You can use "this" in
 * 	every browser to access the element.
 * @param bool one Only trigger once? It is recommended that you use .one.
 */
bacon.html.on = function(event, callback, one) {
	this.each(function() {
		var that = this, handler = function(e) {
			if (callback.call(that, e) === false) {
				e.stopPropagation();
				e.preventDefault();
			}
			
			if (handler.one) {
				bacon.html.removeHandlers.call($(that), event, callback);
			}
		};
		handler.one = (typeof one !== 'undefined');
		handler.callback = callback;
		if (this.addEventListener) {
			this.addEventListener(event, handler);
		} else {
			// Internet Explorer support
			this.attachEvent('on' + event, handler);
		}

		// The dataset object is the data attributes - this.dataset.thisThing
		// would be data-this-thing.
		if (!this.dataset.baconId) {
			this.dataset.baconId = bacon._eventData.push([[event, handler]]) - 1;
		} else {
			bacon._eventData[this.dataset.baconId].push([event, handler]);
		}
	});
	return this;
};

/**
 * Adds an event handler for the specified event which will be executed only
 * once and then removed.
 *
 * @param string event The event name.
 * @param function callback The function to be called.
 */
bacon.html.one = function(event, callback) {
	return bacon.html.on.call(this, event, callback, true);
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
			// Create and dispatch the event
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
};

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
};
