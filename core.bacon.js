function BaconObj() {};

var $, bacon = $ = function(selector) {
	var elements = new BaconObj();
	if (typeof selector === 'object') {
		elements.elements = (selector instanceof Array) ? selector : [selector];
	} else {
		elements.elements = [document];
		elements.select(selector);
	}
	return (elements.elements === null ) ? null : elements;
};
BaconObj.prototype = bacon.html = {};

bacon.html.select = function(selector) {
	for (var els, elements = [], i = 0, j; i < this.elements.length; i++) {
		els = this.elements[i].querySelectorAll(selector);
		for (j = 0; j < els.length; j++) {
			elements.push(els[j]);
		}
	}
	this.elements = elements;
	return this;
}
