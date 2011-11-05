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

/**
 * Returns the next DOM element (optionally matching a specified selector).
 * If the current object holds more than one element, only the first will be used.
 *
 * @param string selector The selector to be used.
 * @returns BaconObj The next element.
 */
bacon.html.next = function(selector) {
	var next = this.elements[0].nextSibling;
	while (next && next.nodeType !== 1 || (typeof selector !== 'undefined' && !next.matchesSelector(selector))) {
		next = next.nextSibling;
	}
	return $(next);
};

/**
 * Returns the previous DOM element (optionally matching a specified selector).
 * If the current object holds more than one element, only the first will be used.
 *
 * @param string selector The selector to be used.
 * @returns BaconObj The previous element.
 */
bacon.html.previous = function(selector) {
	var previous = this.elements[0].previousSibling;
	while (previous && previous.nodeType !== 1 || (typeof selector !== 'undefined' && !previous.matchesSelector(selector))) {
		previous = previous.previousSibling;
	}
	return $(previous);
};

/**
 * Returns a list of immediate children nodes (optionally matching selector).
 * If the current object holds more than one element, only the first will be used.
 *
 * @param string selector The selector to be used.
 * @returns BaconObj The children.
 */
bacon.html.children = function(selector) {
	var children = this.elements[0].childNodes, final_children = [];
	for (var i = 0; i < children.length; i++) {
		if (children[i].nodeType === 1 && (typeof selector === 'undefined' || children[i].matchesSelector(selector))) {
			final_children.push(children[i]);
		}
	}
	return $(final_children);
};

/**
 * Returns the parent DOM element (optionally matching a specified selector).
 * If the current object holds more than one element, only the first will be used.
 *
 * @param string selector The selector to be used.
 * @returns BaconObj The parent element.
 */
bacon.html.parent = function(selector) {
	var parent = this.elements[0].parentNode;
	while (typeof selector !== 'undefined' && !parent.matchesSelector(selector)) {
		parent = parent.parentNode;
	}
	return $(parent);
};

/**
 * Returns the siblings of the current element (optionally matching a specified
 * selector). If the current object holds more than one element, only the first
 * will be used.
 *
 * @param string selector The selector to be used.
 * @returns BaconObj The siblings.
 */
bacon.html.siblings = function(selector) {
	var siblings = this.parent().children(selector);
	for (var i = 0; i < siblings.length; i++) {
		// Remove the current element (it isn't a sibling).
		if (siblings.elements[i] === this.elements[0]) {
			siblings.elements.splice(i, 1);
			siblings.length--;
			break;
		}
	}
	return siblings;
}

/**
 * Gets the specified element from the list.
 *
 * @param int number The number of the element (starts from zero).
 * @returns BaconObj The element.
 */
bacon.html.get = function(number) {
	return $(this.elements[number]);
}

/**
 * Takes either an HTMLElement, BaconObj or HTML string and returns a
 * BaconObj.
 *
 * @param object html HTMLElement / BaconObj / HTML string.
 * @returns BaconObj.
 */
bacon._toBaconObj = function(html) {
	if (html instanceof BaconObj) {
		return html;
	} else if (html instanceof  HTMLElement) {
		var obj = new BaconObj();
		obj.length = 1;
		obj.elements = [html.cloneNode(true)];
		return obj;
	} else if (typeof html === 'string') {
		var div = document.createElement('div');
		div.innerHTML = html;
		var children = $(div).children().elements;
		var obj = new BaconObj();
		obj.length = children.length;
		obj.elements = [];
		for (var i = 0; i < children.length; i++) {
			obj.elements.push(children[i]);
		}
		return obj;
	}
	return false;
}

/**
 * Appends the provided node / BaconObj / HTML string to the current element(s).
 *
 * @param object html The HTMLElement / BaconObj / HTML string to append.
 */
bacon.html.append = function(html) {
	html = bacon._toBaconObj(html);
	var i;
	this.each(function() {
		for (i = 0; i < html.elements.length; i++) {
			this.appendChild(html.elements[i].cloneNode(true));
		}
	});
	return this;
}

/**
 * Prepends the provided node / BaconObj / HTML string to the current element(s).
 *
 * @param object html The HTMLElement / BaconObj / HTML string to prepend.
 */
bacon.html.prepend = function(html) {
	html = bacon._toBaconObj(html);
	var i;
	this.each(function() {
		for (i = 0; i < html.elements.length; i++) {
			this.insertBefore(html.elements[i].cloneNode(true), this.childNodes[0]);
		}
	});
	return this;
}



/*****************************************************************************
 *                               EVENT HANDLING
 ****************************************************************************/

bacon._eventData = [];

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
};

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



/*****************************************************************************
 *                                  OLD BROWSERS
 ****************************************************************************/


if (!HTMLElement.prototype.matchesSelector) {
	HTMLElement.prototype.matchesSelector = function(selector) {
		if (HTMLElement.prototype.webkitMatchesSelector) {
			return this.webkitMatchesSelector(selector);
		} else if (HTMLElement.prototype.mozMatchesSelector) {
			return this.mozMatchesSelector(selector);
		}
		var possibles = this.parentNode.querySelectorAll(selector);
		for (var i = 0; i < possibles.length; i++) {
			if (possibles[i] === this) {
				return true;
			}
		}
		return false;
	};
}

