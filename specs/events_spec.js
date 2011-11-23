$.describe('bacon event tests', function() {
	$.it('should handle .trigger correctly', function(done) {
		var el = $('h1', 1).elements[0];
		if (el.addEventListener) {
			el.addEventListener('click', function() {
				$.expect(this).toBe(el);
				done();
			});
		} else {
			el.attachEvent('onclick', function(e) {
				$.expect(e.srcElement).toBe(el);
				done();
			});
		}
		$('h1').trigger('click');
	}, true);

	$.it('should handle .on correctly', function(done) {
		$('h1').on('click', function() {
			$.expect(this).toBe($('h1').elements[0]);
			done();
		}).trigger('click'); // We tested .trigger in the previous test, it is safe to use
	}, true);

	var clicks = 0;
	$.it('should handle .live correctly', function(done) {
		$('p').live('click', function() {
			$.expect(this).toBe($('p', 1).elements[0]);
			clicks++;
			done();
		});
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(1);
	}, true);

	$.it('should handle .unlive correctly', function() {
		$('p').unlive('click');
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(1);
	});

	$.it('should handle .unlive correctly with function specified', function() {
		var cb = function() {
			clicks++;
		}
		$('p').live('click', cb);
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(2);
		$('p').unlive('click', cb);
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(2);
	});

	$.it('should handle .unlive correctly with nothing specified', function() {
		$('p').live('click', function() {
			clicks++;
		});
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(3);
		$('p').unlive();
		$('p', 1).trigger('click');
		$.expect(clicks).toEqual(3);
	});

	$.it('should handle .removeHandler correctly', function() {
		var clicks = 0;
		var cb = function() {
			clicks++;
		};
		$('#test').on('click', cb).removeHandlers('click', cb).trigger('click');
		$.expect(clicks).toEqual(0);
	});

	$.it('should handle .removeHandler correctly with one parameter', function() {
		var clicks = 0;
		var cb = function() {
			clicks++;
		};
		$('#test').on('click', cb).removeHandlers('click').trigger('click');
		$.expect(clicks).toEqual(0);
	});

	$.it('should handle .one correctly', function() {
		var clicks = 0;
		$('h1').one('click', function() {
			clicks++;
		}).trigger('click').trigger('click');
		$.expect(clicks).toEqual(1);
	});
});
