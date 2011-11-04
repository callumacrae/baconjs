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
	if (typeof selector === 'string') {
		selector = selector.split(' ');
	}
	var elements;
	switch (selector[0].charAt(0)) {
		case '.':
			// It is a class
			elements = this.elements[0].getElementsByClassName(selector[0].slice(1));
			break;
		
		case '#':
			// It is an ID
			elements = this.elements[0].getElementById(selector[0].slice(1));
			if (elements !== null) {
				elements = [elements];
			}
			break;
		
		default:
			// It is probably a tag name
			elements = this.elements[0].getElementsByTagName(selector[0]);
			break;
	}
	this.elements = elements;
	if (elements === null) {
		return null;
	}
	return this;
}
