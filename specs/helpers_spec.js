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

	var qs_str = 'test=a&test2=b&test3[]=one&test3[]=two&test3[]=three&test4[test]=a&test4[test2]=b';
	var qs_obj = {
		test: 'a',
		test2: 'b',
		test3: ['one', 'two', 'three'],
		test4: {
			test: 'a',
			test2: 'b'
		}
	};

	$.it('should use .querystring correctly from objects to strings', function() {
		$.expect($.qs(qs_obj)).toEqual(qs_str);
	});

	$.it('should use .querystring correctly from strings to objects', function() {
		$.expect($.qs(qs_str)).toEqual(qs_obj);
	});

	$.it('should use .serialise correctly to strings', function() {
		$.expect($('#foobarform').serialise()).toEqual('foo=bar&bar=fooo');
	});

	$.it('should use .serialise correctly to objects', function() {
		var form = $('#foobarform').serialise(true);
		$.expect(form.bar).toEqual('fooo');
		$.expect(form.foo).toEqual('bar');
	});
});
