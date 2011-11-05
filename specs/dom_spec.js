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
	
	$.it('should use .next correctly', function() {
		$.expect($('#test').next().elements[0]).toBe($('h2').elements[0]);
		$.expect($('#test').next('div').elements[0]).toBe($('div').elements[1]);
	});
	
	$.it('should use .previous correctly', function() {
		$.expect($('h2').previous().elements[0]).toBe($('#test').elements[0]);
		$.expect($('h2').previous('h1').elements[0]).toBe($('h1').elements[0]);
	});
});