// These will obviously all pass in newer browsers.
$.describe('Old browser tests', function () {
	$.it('should add the JSON object successfully', function () {
		$.expect(window.JSON).toBeDefined();
		$.expect(typeof JSON).toEqual('object');
	});

	$.it('should add JSON.stringify correctly', function () {
		$.expect(JSON.stringify(true)).toEqual('true');
		$.expect(JSON.stringify(4)).toEqual('4');
		$.expect(JSON.stringify('true')).toEqual('"true"');
		$.expect(JSON.stringify('tru"e')).toEqual('"tru\\"e"');
		$.expect(JSON.stringify({dsa: String.fromCharCode(0)})).toEqual('{"dsa":"\\u0000"}');
		$.expect(JSON.stringify(['one', 'two'])).toEqual('["one","two"]');
		$.expect(JSON.stringify({foo: 'bar'})).toEqual('{"foo":"bar"}');
		$.expect(JSON.stringify({foo: ['one', 'two']})).toEqual('{"foo":["one","two"]}');
		$.expect(JSON.stringify({foo: ['o"ne', 4]})).toEqual('{"foo":["o\\"ne",4]}');
	});

	$.it('should have added Array.forEach correctly', function (done) {
		var ary = [10, 9, 8];
		ary.forEach(function (value, index, array) {
			$.expect(value).toEqual(10 - index);
			$.expect(array).toBe(ary);
			if (index == 2) {
				done();
			}
		});
	}, true);
});
