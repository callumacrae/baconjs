bacon.html.on = function(event, callback) {
	this.each(function() {
		if (this.addEventListener) {
			this.addEventListener(event, function(e) {
				if (callback.call(this, e) === false) {
					e.stopPropagation();
					e.preventDefault();
				}
			});
		}
	});
}