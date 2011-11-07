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
	var els, elements = [], i, j;
	for (i = 0; i < this.elements.length && (typeof limit === 'undefined' || elements.length < limit); i++) {
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
	while (next && next.nodeType !== 1 || (typeof selector !== 'undefined' && !$(next).matches(selector))) {
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
	while (previous && previous.nodeType !== 1 || (typeof selector !== 'undefined' && !$(previous).matches(selector))) {
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
		if (children[i].nodeType === 1 && (typeof selector === 'undefined' || $(children[i]).matches(selector))) {
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
	while (typeof selector !== 'undefined' && !$(parent).matches(selector)) {
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
};

/**
 * Gets the specified element from the list.
 *
 * @param int number The number of the element (starts from zero).
 * @returns BaconObj The element.
 */
bacon.html.get = function(number) {
	return $(this.elements[number]);
};

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
		return $(html.cloneNode(true));
	} else if (typeof html === 'string') {
		var div = document.createElement('div');
		div.innerHTML = html;
		return $(div).children();
	}
	return false;
};

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
};

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
};

/**
 * Moves the element to the element specified by the selector.
 *
 * @param string selector The element to move it to.
 * @param bool prepend If true, will be prepended instead of appended.
 */
bacon.html.moveTo = function(selector, prepend) {
	var to = ((typeof selector === 'string') ? $(selector, 1) : selector).elements[0];
	if (typeof prepend === 'undefined' || !prepend) {
		to.appendChild(this.elements[0]);
	} else {
		to.insertBefore(this.elements[0], to.childNodes[0])
	}
};

/**
 * Copies the element to the element specified by the selector.
 *
 * @param string selector The element to copy it to.
 * @param bool prepend If true, will be prepended instead of appended.
 */
bacon.html.copyTo = function(selector, prepend) {
	var to = (typeof selector === 'string') ? $(selector, 1) : selector;
	if (typeof prepend === 'undefined' || !prepend) {
		to.append(this);
	} else {
		to.prepend(this);
	}
};

/**
 * Tests whether an element matches a selector or not.
 *
 * @param string selector The selector to test.
 */
bacon.html.matches = function(selector) {
	if (this.elements[0].matchesSelector) {
		return this.elements[0].matchesSelector(selector);
	} else if (this.elements[0].webkitMatchesSelector) {
		return this.elements[0].webkitMatchesSelector(selector);
	} else if (this.elements[0].mozMatchesSelector) {
		return this.elements[0].mozMatchesSelector(selector);
	}
	var possibles = this.elements[0].parentNode.querySelectorAll(selector);
	for (var i = 0; i < possibles.length; i++) {
		if (possibles[i] === this.elements[0]) {
			return true;
		}
	}
	return false;
};



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

		if (!$(this).data('baconId')) {
			$(this).data('baconId', bacon._eventData.push([[event, handler]]) - 1);
		} else {
			bacon._eventData[$(this).data('baconId')].push([event, handler]);
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
		if ($(this).data('baconId')) {
			var data = bacon._eventData[$(this).data('baconId')];
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
 *                                            AJAX
 ****************************************************************************/

/**
 * Sends an XHR request. See the spec for more info, but you can specifiy
 * parameters or an object as the first parameter.
 *
 * @param string method HTTP method to use.
 * @param string url The URL to send to.
 * @param string data The object to send (can also be a string).
 * @param func callback Function to send the data to.
 */
bacon.req = function(method, url, data, callback) {
	if (typeof method === 'object') {
		url = method.url;
		data = method.data;
		callback = method.callback;
		error = method.error;
		method = method.method;
	} else if (typeof data === 'function') {
		callback = data;
	}

	if (typeof data === 'object') {
		data = bacon.querystring(data);
	}

	if (method === 'GET' && typeof data === 'string') {
		url += '?' + data;
		delete data;
	}

	if (window.XMLHttpRequest) {
		req = new XMLHttpRequest();
	} else {
		req = new ActiveXObject('Microsoft.XMLHTTP');
	}

	req.open(method, url, true);
	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			req.body = req.responseText;
			if (req.getResponseHeader('Content-type') === 'application/json') {
				callback(JSON.parse(req.responseText));
			} else {
				callback(req.responseText, req)
			}
		} else if (req.readyState === 4 && typeof error === 'function') {
			req.body = req.responseText;
			error(req.status, req);
		} else if (req.readyState === 4) {
			throw new Error('XHR Request failed: ' + req.status);
		}
	};
	req.send((typeof data === 'string') ? data + '\n': null);
};

/**
 * GETs the specified URL.
 *
 * @param string url The URL to send to.
 * @param string data The object to send (can also be a string).
 * @param func callback The function to send that data to.
 */
bacon.get = function(url, data, callback) {
	if (typeof url === 'object') {
		url.method = 'GET';
		return bacon.req(url);
	} else {
		return bacon.req('GET', url, data, callback);
	}
};

/**
 * POSTs data to the specified URL.
 *
 * @todo: Why isn't this working?
 *
 * @param string url The URL to send to.
 * @param string data The object to send (can also be a string).
 * @param func callback The function to send that data to.
 */
bacon.post = function(url, data, callback) {
	if (typeof url === 'object') {
		url.method = 'POST';
		return bacon.req(url);
	} else {
		return bacon.req('POST', url, data, callback);
	}
};



/*****************************************************************************
 *                                         HELPERS
 ****************************************************************************/

/**
 * Data helper: attaches data to an element to be retrieved later. Also can retrieve
 * the data. Uses data attributes if the dataset object is available.
 *
 * @param string get The name of the data to store.
 * @param set The data to store. Can be any type.
 */
bacon.html.data = function(get, set) {
	if (typeof set === 'undefined') {
		return (this.elements[0].dataset) ? this.elements[0].dataset[get] : null;
	}

	this.each(function() {
		if (!this.dataset) {
			this.dataset = {};
		}
		this.dataset[get] = set;
	});
	return this;
};


/**
 * Querystring helper: Converts querystrings to objects and back.
 *
 * @param string query The querystring to be converted.
 * @returns object The converted object.
 *
 * OR:
 *
 * @param object query The object to be converted.
 * @returns string The converted querystring.
 */
bacon.querystring = bacon.qs = function(query) {
	if (typeof query === 'object') {
		// Convert from object to string
		var string = [], i, j;
		for (i in query) {
			if (typeof query[i] === 'string') {
				string.push(i + '=' + query[i]);
			} else if (query[i] instanceof Array) {
				for (j = 0; j < query[i].length; j++) {
					string.push(i + '[]=' + query[i][j]);
				}
			} else if (typeof query[i] === 'object') {
				for (j in query[i]) {
					string.push(i + '[' + j + ']=' + query[i][j]);
				}
			}
		}
		return string.join('&');
	} else if (typeof query === 'string') {
		// Convert from string to object
		query = query.split('&');
		for (var obj = {}, i = 0; i < query.length; i++) {
			var match;
			if (match = /^([^\[\]]+)\[([^\[\]]+)\]=(.+)$/.exec(query[i])) {
				if (typeof obj[match[1]] === 'undefined') {
					obj[match[1]] = {};
				}
				obj[match[1]][match[2]] = match[3];
			} else if (match = /^([^\[\]]+)\[\]=(.+)$/.exec(query[i])) {
				if (typeof obj[match[1]] === 'undefined') {
					obj[match[1]] = [];
				}
				obj[match[1]].push(match[2]);
			} else if (match = /^([^=]+)=(.+)$/.exec(query[i])) {
				obj[match[1]] = match[2];
			}
		}
		return obj;
	}
};

/**
 * Form helper: serialises form into a querystring or object.
 *
 * @param bool object If true, will return an object.
 */
bacon.html.serialise = function(object) {
	if (this.elements[0].tagName !== 'FORM') {
		throw new Error('You can only serialise forms.');
	}
	if (typeof object !== 'boolean') {
		object = false;
	}

	var form = this.elements[0].elements, i, string = [], obj = {};
	for (i = 0; i < form.length; i++) {
		if (object) {
			obj[form[i].name] = form[i].value;
		} else {
			string.push(form[i].name + '=' + form[i].value);
		}
	}
	return (object) ? obj : string.join('&');
};
