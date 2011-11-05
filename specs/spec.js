$.describe('Bacon test tests', function() {
	$.it('should work .toEqual correctly', function() {
		$.expect(4).toEqual(4);
		$.expect(2.5).toEqual(2.5);
		$.expect('example string').toEqual('example string');
		var obj = {};
		$.expect(obj).toEqual(obj);
	});
	
	$.it('should work .toNotEqual correctly', function() {
		$.expect(4).toNotEqual(5);
		$.expect(7).toNotEqual(6.999999);
		$.expect('foo').toNotEqual('bar');
		$.expect([]).toNotEqual([]);
		$.expect({}).toNotEqual({});
	});
});