bacon._eventData = [];

bacon.html.on = function(event, callback) {
	this.each(function() {
		if (this.addEventListener) {
			var handler = function(e) {
				if (callback.call(this, e) === false) {
					e.stopPropagation();
					e.preventDefault();
				}
			};
			handler.callback = callback;
			this.addEventListener(event, handler);
			
			if (!this.dataset.baconId) {
				this.dataset.baconId = bacon._eventData.push([['click', handler]]) - 1;
			} else {
				bacon._eventData[this.dataset.baconId].push(['click', handler]);
			}
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

bacon.html.removeHandlers = bacon.html.off = function(event, callback) {
	this.each(function() {
		if (this.dataset.baconId) {
			var data = bacon._eventData[this.dataset.baconId];
			for (var i = 0; i < data.length; i++) {
				if (data[i][0] === event && (typeof callback === 'undefined' || data[i][1].callback === callback)) {
					if (this.removeEventListener) {
						this.removeEventListener(data[i][0], data[i][1]);
					} else {
						// IE
					}
				}
			}
		}
	});
	return this;
}