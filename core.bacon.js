function BaconObj() {};

var $, bacon = $ = function(selector, limit) {
	var elements = new BaconObj();
	if (typeof selector === 'object') {
		elements.elements = (selector instanceof Array) ? selector : [selector];
	} else {
		elements.elements = [document];
		elements.select(selector, limit);
	}
	return (elements.elements === null) ? null : elements;
};
BaconObj.prototype = bacon.html = {};

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
	return this;
}
