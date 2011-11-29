function BaconObj() {};

var $, bacon = $ = function(selector, limit) {
	if (selector instanceof BaconObj) {
		console.log('debug: BaconObj passed to BaconObj.');
		return selector;
	}

	var elements = new BaconObj();
	if (typeof selector === 'object') {
		elements.elements = (selector instanceof Array) ? selector : [selector];
		elements.length = elements.elements.length;
	} else {
		elements.selector = selector;
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
 * A simple HTML text escape.
 *
 * @param string text The text to escape.
 */
bacon._escape = function(text) {
	return text.replace(/&/g, '&amp;')
		.replace(/\</g, '&lt;').replace(/\>/g, '&gt;')
		.replace(/'/g, '&#39;').replace(/"/g, '&quot;');
};

/**
 * Returns an elements text with all tags stripped. (<a>h<b>i</b></a> -> "hi").
 *
 * @param obj element The HTML element.
 */
bacon._getElementText = function(element) {
	var childNodes = element.childNodes, end = '', i;
	for (i = 0; i < childNodes.length; i++) {
		end += (childNodes[i] instanceof Text) ? childNodes[i].nodeValue : bacon._getElementText(childNodes[i]);
	}
	return end;
};

/**
 * Takes either an HTMLElement, BaconObj or HTML string and returns a BaconObj.
 *
 * @param object html HTMLElement / BaconObj / HTML string.
 * @returns BaconObj.
 */
bacon._toBaconObj = function(html) {
	if (typeof html === 'object') {
		return (html instanceof BaconObj) ? html : $(html.cloneNode(true));
	}
	return (typeof html === 'string') ? $(document.createElement('div')).html(html).children() : false;
};

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
	this.length = elements.length;
	this.selector = selector;
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
 * Modifies or retrieves the HTML of an element.
 *
 * @param string html The HTML to set.
 */
bacon.html.html = function(html) {
	return (typeof html !== 'undefined') ? this.each(function() {
		this.innerHTML = html;
	}) : this.elements[0].innerHTML;
};

/**
 * Modifies or retrieves the text contained in an element.
 *
 * @param string text The text to set. If not specified, will return text.
 */
bacon.html.text = function(text) {
	if (typeof text !== 'undefined') {
		//.each returns this
		text = bacon._escape(bacon._escape(text));
		return this.each(function() {
			this.innerHTML = text;
		});
	}

	return bacon._getElementText(this.elements[0]);
};

/**
 * Modifies or retrieves the value of an element.
 *
 * @param string html The value to set.
 */
bacon.html.val = bacon.html.value = function(text) {
	return (typeof text !== 'undefined') ? this.each(function() {
		this.value = text;
	}) : this.elements[0].value;
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
	var children = this.elements[0].childNodes, final_children = [], i;
	for (i = 0; i < children.length; i++) {
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
 * Appends the provided node / BaconObj / HTML string to the current element(s).
 *
 * @param object html The HTMLElement / BaconObj / HTML string to append.
 */
bacon.html.append = function(html) {
	html = bacon._toBaconObj(html);
	return this.each(function() {
		for (var i = 0; i < html.elements.length; i++) {
			this.appendChild(html.elements[i].cloneNode(true));
		}
	});
};

/**
 * Appends the current element to the specified element(s).
 *
 * @param string selector The selector to use (can also be BaconObj).
 * @param int limit Limit the number of elements.
 *
 * @returns BaconObj Returns the element itself, not the element it was copied to.
 */
bacon.html.appendTo = function(selector, limit) {
	$(selector, limit).append(this);
	return this;
};

/**
 * Prepends the provided node / BaconObj / HTML string to the current element(s).
 *
 * @param object html The HTMLElement / BaconObj / HTML string to prepend.
 */
bacon.html.prepend = function(html) {
	html = bacon._toBaconObj(html);
	return this.each(function() {
		for (var i = 0; i < html.elements.length; i++) {
			this.insertBefore(html.elements[i].cloneNode(true), this.childNodes[0]);
		}
	});
};

/**
 * Prepends the current element to the specified element(s).
 *
 * @param string selector The selector to use (can also be BaconObj).
 * @param int limit Limit the number of elements.
 *
 * @returns BaconObj Returns the element itself, not the element it was copied to.
 */
bacon.html.prependTo = function(selector, limit) {
	$(selector, limit).prepend(this);
	return this;
};

/**
 * Inserts the specified element before the current element.
 *
 * @param object element The selector / BaconObj etc to insert.
 */
bacon.html.insertBefore = function(element) {
	element = bacon._toBaconObj(element);
	return this.each(function() {
		var that = this;
		element.each(function() {
			that.parentNode.insertBefore(this.cloneNode(true), that);
		});
	});
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
	return this;
};

/**
 * Copies the element to the element specified by the selector.
 *
 * @param string selector The element to copy it to.
 * @param bool prepend If true, will be prepended instead of appended.
 */
bacon.html.copyTo = function(selector, prepend) {
	var to = (typeof selector === 'string') ? $(selector, 1) : selector;
	to[(typeof prepend === 'undefined' || !prepend) ? 'append' : 'prepend'](this);
	return this;
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
	return possibles.indexOf(this.elements[0]) !== -1;
};



/*****************************************************************************
 *                               EVENT HANDLING
 ****************************************************************************/

// Object to store the events attached to the document for .live
bacon._documentEvents = {};
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
	return this.each(function() {
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
 * Adds an event handler to all elements which match the selector, now and in the
 * future.
 *
 * @param string event The event name.
 * @param function callback The function to be called.
 */
bacon.html.live = function(event, callback) {
	if (!bacon._documentEvents[event]) {
		bacon._documentEvents[event] = [];
		$(document).on(event, function(e) {
			for (var i = 0, t; i < bacon._documentEvents[event].length; i++) {
				t = (e.target) ? e.target : e.srcElement;
				if ($(t).matches(bacon._documentEvents[event][i][0])) {
					bacon._documentEvents[event][i][1].call(t, e);
				}
			}
		});
	}

	bacon._documentEvents[event].push([this.selector, callback]);
	return this;
};

/**
 * Removes an event handler or group of event handlers set by .live.
 *
 * @param string event The event name (optional, if ommitted will remove all).
 * @param function callback The event handler (optional, same as above).
 */
bacon.html.unlive = function(event, callback) {
	if (typeof event === 'undefined' && typeof callback === 'undefined') {
		var i, prop;
		for (prop in bacon._documentEvents) {
			for (i = 0; i < bacon._documentEvents[prop].length; i++) {
				if (bacon._documentEvents[prop][i][0] === this.selector) {
					bacon._documentEvents[prop].splice(i, 1);
				}
			}
		}
	} else if (bacon._documentEvents[event]) {
		for (var events = bacon._documentEvents[event], i = 0; i < events.length; i++) {
			if (events[i][0] === this.selector && (typeof callback === 'undefined' || events[i][1] === callback)) {
				events.splice(i, 1);
			}
		}
	}
	return this;
};

/**
 * Removes the specified handler / all handlers of that type for that element.
 *
 * @param string event The event name.
 * @param function callback The function specified in .on. Optional.
 */
bacon.html.removeHandlers = bacon.html.off = function(event, callback) {
	return this.each(function() {
		if ($(this).data('baconId')) {
			var data = bacon._eventData[$(this).data('baconId')], i;
			for (i = 0; i < data.length; i++) {
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
};

/**
 * Triggers an event handler for the specified event.
 *
 * @param string event The event name to be triggered.
 * @param function callback The function to be called on completion.
 *
 * @todo Add callback support to IE stuff.
 */
bacon.html.trigger = function(event, callback) {
	return this.each(function() {
		if (this.dispatchEvent) {
			// Create and dispatch the event
			var cancelled, evt = document.createEvent('UIEvents');
			evt.initUIEvent(event, true, true, window, 1);
			cancelled = !this.dispatchEvent(evt);

			if (typeof callback === 'function') {
				callback.call(this, cancelled);
			}
		} else if (document.createEventObject) {
			// Internet Explorer support
			var clickEvent = document.createEventObject();
			clickEvent.button = 1;
			this.fireEvent('on' + event, clickEvent);
		}
	});
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

	var req = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	if (method === 'GET' && typeof data === 'string') {
		url += '?' + data;
		delete data;
	}

	req.open(method, url, true);

	if (method === 'POST' && typeof data === 'string') {
		req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	}

	req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			req.body = req.responseText;
			if (req.getResponseHeader('Content-type') === 'application/json') {
				callback(JSON.parse(req.responseText), req);
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
	req.send((typeof data === 'string') ? data : null);

	return this;
};

/**
 * GETs the specified URL.
 *
 * @param string url The URL to send to.
 * @param string data The object to send (can also be a string).
 * @param func callback The function to send that data to.
 */
bacon.get = function(url, data, callback) {
	url.method = 'GET'; // Doesn't matter if it is a string, it'll be ignored
	return (typeof url === 'object') ? bacon.req(url) : bacon.req('GET', url, data, callback);
};

/**
 * POSTs data to the specified URL.
 *
 * @param string url The URL to send to.
 * @param string data The object to send (can also be a string).
 * @param func callback The function to send that data to.
 */
bacon.post = function(url, data, callback) {
	url.method = 'POST';
	return (typeof url === 'object') ? bacon.req(url) : bacon.req('POST', url, data, callback);
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
	return this.each(function() {
		if (!this.dataset) {
			this.dataset = {};
		}
		this.dataset[get] = set;
	});
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
		for (var match, obj = {}, i = 0; i < query.length; i++) {
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




/*****************************************************************************
 *                                 ARRAY HELPERS
 ****************************************************************************/

/**
 * Enables the bacon array features.
 */
bacon.enableArrayFeatures = function() {

	/**
	 * Removes all falsey values from an Array.
	 *
	 * @return array Array with all falsey values removed.
	 */
	Array.prototype.compact = function() {
		for (var end = [], i = 0; i < this.length; i++) {
			if (this[i]) {
				end.push(this[i]);
			}
		}
		return end;
	};

	/**
	 * Flattens the array (removes all nesting).
	 *
	 * @returns array Flattened array.
	 */
	Array.prototype.flatten = function() {
		for (var end = [], flat, i = 0, j; i < this.length; i++) {
			if (this[i] instanceof Array) {
				end = end.concat(this[i].flatten());
			} else {
				end.push(this[i]);
			}
		}
		return end;
	};

	/**
	 * Groups items from the array by the returned value of the callback.
	 *
	 * @param function sortBy The function to query.
	 * @returns object Object of the grouped array items.
	 */
	Array.prototype.groupBy = function(sortBy) {
		for (var a, obj = {}, i = 0; i < this.length; i++) {
			a = sortBy(this[i]);
			if (!obj[a]) {
				obj[a] = [];
			}
			obj[a].push(this[i]);
		}
		return obj;
	};

	/**
	 * Tests whether the specified value is included in the array.
	 *
	 * @param prop The value to test.
	 * @returns bool Whether it is included or not.
	 */
	Array.prototype.included = function(prop) {
		return this.indexOf(prop) !== -1;
	};

	/**
	 * Finds the maximum value of an array. Supports strings and numbers, but not
	 * both at the same time.
	 *
	 * @param string type The type wanted. If left, will default to the type of the first entry.
	 */
	Array.prototype.max = function(type) {
		if (typeof type === 'undefined') {
			type = typeof this[0];
		}

		for (var i = 0, max = null; i < this.length; i++) {
			if (typeof this[i] === type && (max === null || this[i] > max)) {
				max = this[i];
			}
		}
		return max;
	};

	/**
	 * Finds the minimum value of an array. Supports strings and numbers, but not
	 * both at the same time.
	 *
	 * @param string type The type wanted. If left, will default to the type of the first entry.
	 */
	Array.prototype.min = function(type) {
		if (typeof type === 'undefined') {
			type = typeof this[0];
		}

		for (var i = 0, min = null; i < this.length; i++) {
			if (typeof this[i] === type && (min === null || this[i] < min)) {
				min = this[i];
			}
		}
		return min;
	};

	/**
	 * Returns a random item or selection of items from the array.
	 *
	 * @param number limit The number of elements to return.
	 * @returns array The items. Will not be an array if limit is not specified.
	 */
	Array.prototype.rand = Array.prototype.random = function(limit) {
		if (typeof limit !== 'number') {
			return this[Math.floor(Math.random() * this.length)];
		}
		if (limit > this.length) {
			throw new Error('Cannot return more items than the array contains.');
		}
		var end = [], clone = this.slice();
		while (end.length < limit) {
			end = end.concat(clone.splice(Math.floor(Math.random() * clone.length), 1));
		}
		return end;
	};

	/**
	 * Returns the difference between the minimum and maximum vales of an array.
	 * Supports only numbers.
	 */
	Array.prototype.range = function() {
		for (var i = 0, min = null, max = null; i < this.length; i++) {
			if (typeof this[i] === 'number') {
				if (min === null || this[i] < min) {
					min = this[i];
				} else if (max === null || this[i] > max) {
					max = this[i];
				}
			}
		}
		return max - min;
	};

	/**
	 * Shufles the array.
	 *
	 * @returns array The shuffled array.
	 */
	Array.prototype.shuffle = function() {
		var end = [], clone = this.slice();
		while (clone.length) {
			end = end.concat(clone.splice(Math.floor(Math.random() * clone.length), 1));
		}
		return end;
	};

	/**
	 * Returns the array with all duplicate entries removed.
	 *
	 * @returns array The array without the duplicates.
	 */
	Array.prototype.unique = function() {
		for (var i = 0, clone = this.slice(); i < clone.length; i++) {
			if (clone.indexOf(clone[i]) < i) {
				clone.splice(i--, 1);
			}
		}
		return clone;
	};

	/**
	 * Removes all instances of value or an array of values.
	 *
	 * @param value The value / values to remove.
	 * @param bool array If true, will treat value as an array of values.
	 * @returns array The array without the values.
	 */
	Array.prototype.without = function(value, array) {
		if (typeof array === 'undefined' || !array) {
			value = [value];
		}

		for (var clone = this.slice(), i = 0; i < value.length; i++) {
			while (clone.indexOf(value[i]) !== -1) {
				clone.splice(clone.indexOf(value[i]), 1);
			}
		}

		return clone;
	};

	return true;
};


/*****************************************************************************
 *                                 OLD BROWSERS
 ****************************************************************************/

if (typeof JSON === 'undefined') {
	JSON = {};

	JSON.parse = function(text) {
		return eval('(' + text + ')');
	};
	JSON.stringify = function(value) {
		 var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			meta = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'};

		function str(value) {
			if (value.toJSON) {
				return '"' + value.toJSON() + '"';
			}
			if (typeof value === 'string') {
				return '"' + value.replace(escapable, function(a) {
					var c = meta[a];
					return typeof c === 'string' ? c : '\\u' +  ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				}) + '"';
			}
			if (typeof value === 'number') {
				// JSON numbers must be finite
				return isFinite(obj) ? String(value) : 'null';
			}
			if (typeof value === 'boolean') {
				return value;
			}
			if (typeof value === 'object' && !value) {
				return 'null';
			}
			var i, partial = [];
			if (value instanceof Array) {
				for (i = 0; i < value.length; i++) {
					partial.push(str(value[i]) || 'null');
				}
				return '[' + partial.join(',') + ']';
			}
			if (typeof value === 'object') {
				for (i in value) {
					partial.push(str(i) + ':' + str(value[i]));
				}
				return '{' + partial.join(',') + '}';
			}
			throw new TypeError('No JSON representation for this object');
		}
		return str(value);
	};

	if (typeof Date.prototype.toJSON !== 'function') {
		Date.prototype.toJSON = function(key) {
			function f(n) {
				return n < 10 ? '0' + n : n;
			}

			return isFinite(this) ?
				this.getUTCFullYear()			+ '-' +
				f(this.getUTCMonth() + 1)	+ '-' +
				f(this.getUTCDate())			+ 'T' +
				f(this.getUTCHours())			+ ':' +
				f(this.getUTCMinutes())		+ ':' +
				f(this.getUTCSeconds())		+ 'Z' : null;
		};
	}
}


if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fn) {
		for (var i = 0; i < this.length; i++) {
			fn.call(null, this[i], i, this);
		}
	};
}

/*****************************************************************************
 *                                    ANIMATIONS
 ****************************************************************************/

bacon.defaultAnimTime = 400;

/**
 * Fades in an element / group of elements.
 *
 * @param int time Time to fade it in over (optional).
 * @param func cb Callback to call when fadeIn has completed (optional).
 */
bacon.html.fadeIn = function(time, cb) {
	if (typeof time !== 'number') {
		cb = time;
		time = bacon._defaultAnimTime;
	}

	var startTime = Date.now(), orig = this;
	setTimeout(function() {
		cb.call(orig);
	}, time + 4);

	return this.each(function() {
		var interval, start = (this.style.opacity) ? this.style.opacity : '0', that = this;
		if (start !== '1') {
			interval = setInterval(function() {
				that.style.opacity = ((Date.now() - startTime) * (1 - start) / time);
				if (that.style.opacity >= 1 && (that.style.opacity = 1)) {
					clearInterval(interval);
				}
			}, 4);
		}
	});
};

/**
 * Fades out an element / group of elements.
 *
 * @param int time Time to fade it out over (optional).
 * @param func cb Callback to call when fadeOut has completed (optional).
 */
bacon.html.fadeOut = function(time, cb) {
	if (typeof time !== 'number') {
		cb = time;
		time = bacon._defaultAnimTime;
	}

	var startTime = Date.now(), orig = this;
	setTimeout(function() {
		cb.call(orig);
	}, time + 4);

	return this.each(function() {
		var interval, start = ((this.style.opacity) ? this.style.opacity : 1), that = this;
		if (this.style.opacity !== '0') {
			interval = setInterval(function() {
				that.style.opacity = 1 - ((Date.now() - startTime) * start / time);
				if (that.style.opacity <= 0 && !(that.style.opacity = 0)) {
					clearInterval(interval);
				}
			}, 4);
		}
	});
};
