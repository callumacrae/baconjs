bacon.html.each = function(callback) {
	for (var i = 0; i < this.elements.length; i++) {
		callback.call(this.elements[i]);
	}
	return this;
}
