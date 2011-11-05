$.describe('bacon DOM tests', function() {
	$.it('should select elements using tagname', function() {
		$.expect($('p').length).toEqual(4);
		$.expect($('a').length).toEqual(2);
	});
	
	$.it('should select elements using parameters', function() {
		$.expect($('a[href="#"]').length).toEqual(2);
		$.expect($('[style]').length).toEqual(1);
	});
	
	$.it('should use the select method correctly', function() {
		$.expect($(document).select('p').length).toEqual(4);
	});
	
	$.it('should use the select method on multiple elements', function() {
		$.expect($(document).select('p').select('a').length).toEqual(2);
	});
	
	$.it('should use .each correctly', function(done) {
		var total = 0;
		$('p').each(function() {
			$.expect(this.tagName).toEqual('P');
			total++;
		});
		setTimeout(function() {
			$.expect(total).toEqual(4);
			done();
		}, 1);
	}, true);
});