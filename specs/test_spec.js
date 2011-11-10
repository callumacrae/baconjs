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

	$.it('should work .toContain correctly for strings', function() {
		$.expect('hello world!').toContain('world');
		$.expect('another string').toContain('her');
	});

	$.it('should work .toNotContain correctly for strings', function() {
		$.expect('hello world!').toNotContain('her');
		$.expect('another string').toNotContain('world');
	});

	$.it('should work .toContain correctly for arrays', function() {
		$.expect(['one', 'two', 'three']).toContain('one');
		$.expect(['hello', 'world']).toContain('world');
	});

	$.it('should work .toNotContain correctly for arrays', function() {
		$.expect(['one', 'two', 'three']).toNotContain('world');
		$.expect(['hello', 'world']).toNotContain('ell');
	});

	$.it('should work .toBeLessThan correctly', function() {
		$.expect(4).toBeLessThan(8);
		$.expect(3.999).toBeLessThan(4);
		$.expect('abc').toBeLessThan('bc');
	});

	$.it('should work .toBeGreaterThan correctly', function() {
		$.expect(10).toBeGreaterThan(8);
		$.expect(4.0001).toBeGreaterThan(4);
		$.expect('zebra').toBeGreaterThan('aardvark');
	});

	$.it('should work .toBeDefined correctly', function() {
		var obj = {foo: 'bar'};
		$.expect(obj.foo).toBeDefined();
	});

	$.it('should work .toBeUndefined correctly', function() {
		$.expect(window.asgojnasgonawg).toBeUndefined();
	});

	$.it('should work .toBeNull correctly', function() {
		$.expect(null).toBeNull();
	});

	$.it('should work .toBeTruthy correctly', function() {
		$.expect('0').toBeTruthy();
		$.expect('hi').toBeTruthy();
		$.expect(true).toBeTruthy();
		$.expect(1).toBeTruthy();
		$.expect(125).toBeTruthy();
	});

	$.it('should work .toBeFalsy correctly', function() {
		$.expect(false).toBeFalsy();
		$.expect(0).toBeFalsy();
		$.expect(null).toBeFalsy();
		$.expect(NaN).toBeFalsy();
	});

	$.it('should catch errors with .toThrow correctly', function() {
		$.expect(function() {
			aong;
		}).toThrow('not_defined');
	});
});
