$.describe('Bacon test tests', function() {
	$.it('should work .toBe correctly', function() {
		$.expect(4).toBe(4);
		$.expect(2.5).toBe(2.5);
		$.expect('example string').toBe('example string');
		var obj = {};
		$.expect(obj).toBe(obj);
	});
	
	$.it('should work .toNotBe correctly', function() {
		$.expect(4).toNotBe(5);
		$.expect(7).toNotBe(6.999999);
		$.expect('foo').toNotBe('bar');
		$.expect([]).toNotBe([]);
		$.expect({}).toNotBe({});
	});
});