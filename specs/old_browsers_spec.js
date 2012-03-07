// These will obviously all pass in newer browsers.
$.describe('Old browser tests', function () {
	$.it('should add the JSON object successfully', function () {
		$.expect(window.JSON).toBeDefined();
		$.expect(typeof JSON).toEqual('object');
	});

	$.it('should add JSON.stringify correctly', function () {
		$.expect(bacon.JSON.stringify(true)).toEqual('true');
		$.expect(bacon.JSON.stringify(4)).toEqual('4');
		$.expect(bacon.JSON.stringify(-4)).toEqual('-4');
		$.expect(bacon.JSON.stringify('true')).toEqual('"true"');
		$.expect(bacon.JSON.stringify('tru"e')).toEqual('"tru\\"e"');
		$.expect(bacon.JSON.stringify({dsa: String.fromCharCode(0)})).toEqual('{"dsa":"\\u0000"}');
		$.expect(bacon.JSON.stringify(['one', 'two'])).toEqual('["one","two"]');
		$.expect(bacon.JSON.stringify({foo: 'bar'})).toEqual('{"foo":"bar"}');
		$.expect(bacon.JSON.stringify({foo: ['one', 'two']})).toEqual('{"foo":["one","two"]}');
		$.expect(bacon.JSON.stringify({foo: ['o"ne', 4]})).toEqual('{"foo":["o\\"ne",4]}');
	});

	$.it('should add JSON.parse correctly', function () {
		$.expect(bacon.JSON.parse('"test"')).toEqual('test');
		$.expect(bacon.JSON.parse('4')).toEqual(4);
		$.expect(bacon.JSON.parse('4.2')).toEqual(4.2);
		$.expect(bacon.JSON.parse('-17.9')).toEqual(-17.9);
		$.expect(bacon.JSON.parse('true')).toEqual(true);
		$.expect(bacon.JSON.parse('false')).toEqual(false);
		$.expect(bacon.JSON.parse('["one", 2]')).toEqual(['one', 2]);
		$.expect(bacon.JSON.parse('{"one":"two"}')).toEqual({one:'two'});
		$.expect(bacon.JSON.parse('{"one":"two","foo":"bar"}')).toEqual({one:'two', foo:"bar"});
		$.expect(bacon.JSON.parse('{"one":[23],"foo":"bar"}')).toEqual({one:[23], foo:"bar"});
	});

	$.it('should have added Date.toJSON correctly', function () {
		var d = '2012-03-07T08:53:36.699Z';
		$.expect(new Date(d).toJSON()).toEqual(d);
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

	$.it('should have added Array.isArray correctly', function () {
		$.expect(Array.isArray).toBeDefined();
		$.expect(Array.isArray('')).toBeFalsy();
		$.expect(Array.isArray([])).toBeTruthy();
	});
});
