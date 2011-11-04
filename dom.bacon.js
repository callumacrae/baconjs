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
