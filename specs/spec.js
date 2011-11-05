$.describe('Bacon test tests', function() {
	$.it('should work .toEqual correctly', function() {
		$.expect(1).toEqual(true);
		$.expect(0).toEqual(false);
		$.expect('se').toEqual('se');
		var obj = {};
		$.expect(obj).toEqual(obj);
		$.expect({}).toEqual({});
		$.expect([]).toEqual([]);
		$.expect([{test:'one'}]).toEqual([{test:'one'}])
		$.expect([[[[[[[['', 4]]]]]]]]).toEqual([[[[[[[['', 4]]]]]]]]);
		$.expect([true]).toEqual([1]);
	});
	
	$.it('should work .toNotEqual correctly', function() {
		$.expect({}).toNotEqual({foo:'bar'});
		$.expect(false).toNotEqual(1);
		$.expect(false).toNotEqual(true);
		$.expect('test').toNotEqual('bacon');
		$.expect(['']).toNotEqual(['', '']);
	});
	
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
	
	$.it('should work .toMatch correctly', function() {
		$.expect('a').toMatch('[a-z]');
		$.expect('a').toMatch(/[a-z]/);
		$.expect('a').toMatch(/[A-Z]/i);
	});
	
	$.it('should work .toNotMatch correctly', function() {
		$.expect('a').toNotMatch('[b-z]');
		$.expect('a').toNotMatch(/[b-z]/);
		$.expect('a').toNotMatch(/[A-Z]/);
	});
});