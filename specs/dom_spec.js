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
	
	$.it('should use .each correctly', function() {
		//needs async
	});
});