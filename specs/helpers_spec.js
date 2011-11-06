$.describe('helpers tests', function() {
	$.it('should use .data correctly on single elements', function() {
		$.expect($('.thediv').data('test', 'hello') instanceof BaconObj).toBeTruthy();
		$.expect($('.thediv').data('test')).toEqual('hello');
	});

	$.it('should use .data correctly on multiple elements', function() {
		$.expect($('p').data('foo', 'bar') instanceof BaconObj).toBeTruthy();
		$.expect($('p').data('foo')).toEqual('bar');
		$.expect($('p').get(2).data('foo')).toEqual('bar');
	});
});