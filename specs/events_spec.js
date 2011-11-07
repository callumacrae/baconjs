$.describe('bacon event tests', function() {
	$.it('should handle .trigger correctly', function(done) {
		// This test is not suitable for IE.
		$('h1').elements[0].addEventListener('click', function() {
			$.expect(this).toBe($('h1').elements[0]);
			done();
		});
		$('h1').trigger('click');
	}, true);

	$.it('should handle .on correctly', function(done) {
		$('h1').on('click', function() {
			$.expect(this).toBe($('h1').elements[0]);
			done();
		}).trigger('click'); // We tested .trigger in the previous test, it is safe to use
	}, true);

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
