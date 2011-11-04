bacon.html.on = function(event, callback) {
	this.each(function() {
		if (this.addEventListener) {
			this.addEventListener(event, function(e) {
				if (callback.call(this, e) === false) {
					e.stopPropagation();
					e.preventDefault();
				}
			});
		} else {
			// IE
		}
	});
	return this;
}

bacon.html.trigger = function(event, callback) {
	this.each(function() {
		if (this.dispatchEvent) {
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
}